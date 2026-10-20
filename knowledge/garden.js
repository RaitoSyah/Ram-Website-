// garden.js
// Lapisan data dan fungsi bersama Knowledge Garden (dipakai index.html, category.html, detail.html).
//
// Koleksi Firestore:
//   knowledge        : materi terbit (bisa dibaca semua orang)
//   knowledgeDrafts  : draft (hanya admin)
// ID dokumen = slug materi, jadi URL-nya stabil: detail.html?s=<slug>

import { db } from "../firebase-config.js";

import {
    collection,
    getDocs,
    doc,
    getDoc,
    query,
    where,
    limit
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

import { CATEGORIES, categoryById } from "./categories.js";
import { DEMO_ITEMS, USE_DEMO_WHEN_EMPTY } from "./demo.js";

export { CATEGORIES, categoryById };

export const PAGE_SIZE = 12;

const CACHE_KEY = "kgIndex";
const CACHE_TTL = 5 * 60 * 1000; // 5 menit per tab, supaya tidak boros pembacaan database


// ---------- Pembantu umum ----------

export const esc = (t) => String(t ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));

export function normalizeTag(t) {
    return String(t || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function toMs(ts) {
    if (!ts) return 0;
    if (typeof ts === "number") return ts;
    if (typeof ts.toMillis === "function") return ts.toMillis();
    return 0;
}

// Aman untuk HTML apa pun: DOMParser tidak menjalankan skrip atau atribut kejadian
function htmlToText(html) {
    const d = new DOMParser().parseFromString(String(html || ""), "text/html");
    return (d.body.textContent || "").replace(/\s+/g, " ").trim();
}

export function readMinutes(text) {
    const words = String(text || "").trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 250));
}

export function formatDate(ms) {
    return ms
        ? new Date(ms).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : "";
}

export function normalizeItem(id, d, full = false) {

    const text = d.contentText ?? htmlToText(d.content);

    const item = {
        id,
        demo: !!d.demo,
        title: d.title || "",
        summary: d.summary || "",
        category: d.category || "",
        tags: (Array.isArray(d.tags) ? d.tags : []).map(normalizeTag).filter(Boolean),
        featured: !!d.featured,
        publishedMs: toMs(d.publishedAt) || toMs(d.createdAt),
        updatedMs: toMs(d.updatedAt),
        minutes: readMinutes(text),
        text: text.slice(0, 4000) // cukup untuk pencarian isi, tanpa membengkakkan cache
    };

    if (full) {
        item.content = d.content || "";
        item.interpretation = d.interpretation || "";
        item.sources = Array.isArray(d.sources) ? d.sources : [];
        item.related = Array.isArray(d.related) ? d.related : [];
    }

    return item;
}


// ---------- Memuat data ----------

// Mengembalikan { items, demo }. Materi demo hanya tampil kalau koleksi masih kosong.
export async function loadIndex() {

    try {
        const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
        if (cached && Date.now() - cached.at < CACHE_TTL) return cached.data;
    } catch (e) { /* lanjut ambil baru */ }

    const snap = await getDocs(collection(db, "knowledge"));

    let items = snap.docs.map(d => normalizeItem(d.id, d.data()));
    let demo = false;

    if (!items.length && USE_DEMO_WHEN_EMPTY) {
        items = DEMO_ITEMS.map(x => normalizeItem(x.id, x));
        demo = true;
    }

    const data = { items, demo };

    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data })); } catch (e) { /* abaikan */ }

    return data;
}

// Satu materi lengkap. draft=true membaca knowledgeDrafts (hanya admin yang diizinkan aturan Firestore).
// Mengembalikan { item, demo } atau null.
export async function getItem(slug, draft = false) {

    if (draft) {
        const s = await getDoc(doc(db, "knowledgeDrafts", slug));
        return s.exists() ? { item: normalizeItem(slug, s.data(), true), demo: false, draft: true } : null;
    }

    const s = await getDoc(doc(db, "knowledge", slug));
    if (s.exists()) return { item: normalizeItem(slug, s.data(), true), demo: false };

    // Cadangan demo, hanya selama koleksi masih kosong
    if (USE_DEMO_WHEN_EMPTY) {
        const idx = await loadIndex();
        if (idx.demo) {
            const d = DEMO_ITEMS.find(x => x.id === slug);
            if (d) return { item: normalizeItem(slug, d, true), demo: true };
        }
    }

    return null;
}

// Materi terkait: pilihan manual dari editor dulu, lalu dilengkapi dari kesamaan tag.
export async function getRelated(item, demo, max = 4) {

    const out = [];
    const seen = new Set([item.id]);

    const add = (it) => {
        if (it && !seen.has(it.id) && out.length < max) {
            seen.add(it.id);
            out.push(it);
        }
    };

    if (demo) {
        const { items } = await loadIndex();
        (item.related || []).forEach(id => add(items.find(x => x.id === id)));
        items
            .map(x => ({ x, n: x.tags.filter(t => item.tags.includes(t)).length }))
            .filter(r => r.n > 0)
            .sort((a, b) => b.n - a.n || b.x.publishedMs - a.x.publishedMs)
            .forEach(r => add(r.x));
        return out;
    }

    // Manual
    const manual = await Promise.all((item.related || []).slice(0, max).map(async (id) => {
        try {
            const s = await getDoc(doc(db, "knowledge", id));
            return s.exists() ? normalizeItem(id, s.data()) : null;
        } catch (e) {
            return null;
        }
    }));
    manual.forEach(add);

    // Otomatis dari tag
    if (out.length < max && item.tags.length) {
        try {
            const snap = await getDocs(query(
                collection(db, "knowledge"),
                where("tags", "array-contains-any", item.tags.slice(0, 10)),
                limit(20)
            ));
            snap.docs
                .map(d => normalizeItem(d.id, d.data()))
                .map(x => ({ x, n: x.tags.filter(t => item.tags.includes(t)).length }))
                .sort((a, b) => b.n - a.n || b.x.publishedMs - a.x.publishedMs)
                .forEach(r => add(r.x));
        } catch (e) { /* rekomendasi bersifat tambahan */ }
    }

    return out;
}


// ---------- Pencarian, urutan, hitungan ----------

export function searchItems(items, q) {

    const tokens = String(q || "").toLowerCase().split(/\s+/).filter(Boolean);
    if (!tokens.length) return items;

    return items.filter(it => {
        const cat = categoryById(it.category);
        const hay = [
            it.title,
            it.summary,
            it.tags.join(" "),
            cat ? cat.name : "",
            it.text
        ].join(" ").toLowerCase();
        return tokens.every(t => hay.includes(t));
    });
}

export function sortItems(items, mode) {
    const a = [...items];
    if (mode === "az") a.sort((x, y) => x.title.localeCompare(y.title, "id"));
    else a.sort((x, y) => y.publishedMs - x.publishedMs);
    return a;
}

export function countBy(items, keyFn) {
    const m = new Map();
    items.forEach(it => {
        const keys = keyFn(it);
        (Array.isArray(keys) ? keys : [keys]).forEach(k => {
            if (k) m.set(k, (m.get(k) || 0) + 1);
        });
    });
    return m;
}


// ---------- Kartu materi ----------

export function cardHtml(it) {

    const cat = categoryById(it.category);
    const date = formatDate(it.publishedMs);
    const meta = (date ? date + " · " : "") + it.minutes + " min read";

    const tags = it.tags.length
        ? `<div class="kg-tags">${it.tags.slice(0, 5).map(t =>
            `<a class="kg-tag" href="index.html?tag=${encodeURIComponent(t)}">${esc(t)}</a>`).join("")}</div>`
        : "";

    return `
        <div class="writing-card kg-card">
            <p class="writing-category">${esc(cat ? cat.name : "Tanpa kategori")}${it.demo ? ' <span class="kg-badge">DEMO</span>' : ""}</p>
            <h3><a class="kg-title-link" href="detail.html?s=${encodeURIComponent(it.id)}">${esc(it.title)}</a></h3>
            <p class="kg-meta">${esc(meta)}</p>
            <p>${esc(it.summary)}</p>
            ${tags}
            <a href="detail.html?s=${encodeURIComponent(it.id)}">Baca materi →</a>
        </div>
    `;
}

export const DEMO_BANNER = "Mode demo: materi di halaman ini hanya contoh, bukan materi asli. Spanduk ini hilang otomatis saat kamu menerbitkan materi pertama.";
