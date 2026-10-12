// ========================================
// AUTH WIDGET
// Avatar/tombol login di pojok kanan atas + popup panel.
// Include file ini di halaman mana pun dengan:
// <script type="module" src="PATH/auth-widget.js"></script>
// (sesuaikan PATH relatif ke lokasi firebase-config.js)
// ========================================

import { auth, db } from "./firebase-config.js";

import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

import {
    collection,
    query,
    orderBy,
    limit,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";


const ADMIN_EMAIL = "im.raito.id@gmail.com";

// account.html ada di folder yang sama dengan file ini, apa pun halaman yang memanggilnya
const ACCOUNT_URL = new URL("account.html", import.meta.url).href;

// Escape teks dari pengguna (nama/email/foto) sebelum masuk ke HTML
const esc = (t) => String(t ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));


// ---- NOTIFIKASI TULISAN BARU (di dalam website) ----
// Saat pengunjung membuka website dan ada tulisan yang terbit setelah terakhir
// kali dia lihat, muncul titik merah di ikon profil dan kotak info di panel.
// Tidak butuh server. Hanya jalan kalau website sedang dibuka.

const ARTICLE_URL = new URL("writings/article.html", import.meta.url).href;
const SAVED_URL = new URL("writings/saved.html", import.meta.url).href;

let latest = null; // { id, title, ms } tulisan terbaru yang sudah terbit

function notifOn() {
    try { return localStorage.getItem("notif") === "on"; } catch (e) { return false; }
}

function setNotifOn(on) {
    try {
        if (on) localStorage.setItem("notif", "on");
        else localStorage.removeItem("notif");
    } catch (e) { /* penyimpanan diblokir */ }
}

function getSeen() {
    try { return Number(localStorage.getItem("notifSeen") || 0); } catch (e) { return 0; }
}

function setSeen(ms) {
    try { localStorage.setItem("notifSeen", String(ms)); } catch (e) { /* abaikan */ }
}

function hasNew() {
    return notifOn() && latest && latest.ms > getSeen();
}

// Satu pengambilan data per 10 menit per tab, supaya tidak boros pembacaan database
async function loadLatest(force) {

    if (!force) {
        try {
            const cached = JSON.parse(sessionStorage.getItem("notifLatest") || "null");
            if (cached && Date.now() - cached.at < 10 * 60 * 1000) {
                latest = cached.data;
                return;
            }
        } catch (e) { /* lanjut ambil baru */ }
    }

    try {
        const snap = await getDocs(query(collection(db, "writings"), orderBy("createdAt", "desc"), limit(1)));

        if (snap.empty) {
            latest = null;
        } else {
            const d = snap.docs[0];
            const data = d.data();
            latest = {
                id: d.id,
                title: data.title || "Tulisan baru",
                ms: data.createdAt && data.createdAt.toMillis ? data.createdAt.toMillis() : 0
            };
        }

        try { sessionStorage.setItem("notifLatest", JSON.stringify({ at: Date.now(), data: latest })); } catch (e) { /* abaikan */ }

    } catch (e) {
        latest = null; // gagal mengambil: notifikasi diam saja, website tetap normal
    }
}

// Kalau pengunjung sedang membuka tulisan terbaru itu, anggap sudah dibaca
function markSeenIfReading() {
    if (!latest) return;
    const params = new URLSearchParams(location.search);
    if (location.pathname.endsWith("article.html") && params.get("id") === latest.id) {
        setSeen(latest.ms);
    }
}


// ---- TEMA ----
// "auto" = ikut pengaturan HP (terang/gelap). Pilihan disimpan di browser.

const THEMES = [
    { id: "auto",  label: "Otomatis",  swatch: "linear-gradient(90deg,#f5f7fb 50%,#14171c 50%)" },
    { id: "light", label: "Terang",    swatch: "linear-gradient(90deg,#f5f7fb 50%,#93CAED 50%)" },
    { id: "dark",  label: "Gelap",     swatch: "linear-gradient(90deg,#14171c 50%,#93CAED 50%)" },
    { id: "warm",  label: "Hangat",    swatch: "linear-gradient(90deg,#f6efe4 50%,#c8693f 50%)" },
    { id: "mono",  label: "Monokrom",  swatch: "linear-gradient(90deg,#f2f2f2 50%,#222222 50%)" }
];

function getStoredTheme() {
    try {
        const t = localStorage.getItem("theme");
        return THEMES.some(x => x.id === t) ? t : "auto";
    } catch (e) {
        return "auto";
    }
}

function applyTheme(id) {
    const root = document.documentElement;
    if (!id || id === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", id);
}

// Dipasang sedini mungkin (potongan kecil di <head> tiap halaman menghindari kedipan)
applyTheme(getStoredTheme());

function renderNotifArea() {

    const area = document.getElementById("auth-widget-notif");
    const dot = document.getElementById("auth-widget-dot");

    const showNew = hasNew();
    if (dot) dot.style.display = showNew ? "block" : "none";

    if (!area) return;

    const on = notifOn();

    let html = "";

    if (showNew) {
        html += `
            <div class="auth-widget-notice">
                <strong>Tulisan baru</strong>
                <p>${esc(latest.title)}</p>
                <a href="${ARTICLE_URL}?id=${encodeURIComponent(latest.id)}" data-notif-read>Baca sekarang →</a>
                <button type="button" class="auth-widget-mini" data-notif-dismiss>Tandai dibaca</button>
            </div>
        `;
    }

    html += `
        <div class="auth-widget-section-label">Notifikasi</div>
        <div class="auth-widget-switch-row">
            <span>Beri tahu tulisan baru</span>
            <button type="button" class="auth-widget-switch ${on ? "on" : ""}" role="switch" aria-checked="${on}" aria-label="Notifikasi tulisan baru" data-notif-toggle><span></span></button>
        </div>
        <p class="auth-widget-hint">Penanda muncul saat kamu membuka website dan ada tulisan baru sejak kunjungan terakhirmu.</p>
    `;

    area.innerHTML = html;
}

function renderThemePicker() {
    return `
        <div class="auth-widget-section-label">Tema</div>
        <div class="auth-widget-themes">
            ${THEMES.map(t => `
                <button type="button" class="auth-widget-theme-btn" data-theme-choice="${t.id}">
                    <span class="auth-widget-swatch" style="background:${t.swatch};"></span>
                    ${t.label}
                </button>
            `).join("")}
        </div>
    `;
}

function markActiveTheme() {
    const current = getStoredTheme();
    document.querySelectorAll("[data-theme-choice]").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.themeChoice === current);
    });
}

function chooseTheme(id) {
    try {
        if (id === "auto") localStorage.removeItem("theme");
        else localStorage.setItem("theme", id);
    } catch (e) { /* penyimpanan diblokir: tema tetap berlaku untuk sesi ini */ }
    applyTheme(id);
    markActiveTheme();
    window.dispatchEvent(new Event("themechange"));
}


// ---- SOCIAL LINKS ----

const SOCIAL_LINKS = [
    {
        name: "Instagram",
        url: "https://www.instagram.com/im.mrrs.id",
        color: "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)",
        icon: `<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`
    },
    {
        name: "TikTok",
        url: "https://www.tiktok.com/@mrrs.gt",
        color: "#000000",
        icon: `<svg viewBox="0 0 24 24"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`
    },
    {
        name: "YouTube",
        url: "https://youtube.com/@raitosyah",
        color: "#FF0000",
        icon: `<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
    },
    {
        name: "X",
        url: "https://x.com/RaitoSyah",
        color: "#000000",
        icon: `<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
    },
    {
        name: "Threads",
        url: "https://www.threads.com/@im.mrrs.id",
        color: "#000000",
        icon: `<svg viewBox="0 0 24 24"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.03.569c-1.104-3.96-3.898-5.984-8.317-6.015-2.938.022-5.159.943-6.6 2.735C4.32 6.437 3.617 8.868 3.593 12c.024 3.132.727 5.563 2.09 7.226 1.44 1.792 3.66 2.714 6.6 2.735 2.634-.02 4.377-.646 5.826-2.095 1.652-1.65 1.619-3.673 1.088-4.897-.313-.72-.878-1.319-1.643-1.756-.19 1.358-.611 2.435-1.259 3.209-.87 1.036-2.098 1.601-3.649 1.68-1.178.062-2.312-.217-3.196-.783-1.049-.67-1.663-1.688-1.729-2.865-.13-2.303 1.706-3.958 4.573-4.121a13.69 13.69 0 0 1 2.756.13c-.113-.674-.34-1.21-.68-1.596-.463-.526-1.181-.792-2.134-.797h-.041c-.769 0-1.81.213-2.475 1.226l-1.734-1.185c.892-1.352 2.343-2.098 4.09-2.098h.055c2.966.018 4.732 1.827 4.909 5.005.101.043.201.088.3.135 1.4.66 2.424 1.665 2.961 2.906.744 1.721.812 4.526-1.464 6.799-1.822 1.822-4.03 2.65-7.152 2.673Zm1.276-9.822c-.234-.008-.474-.007-.716.005-1.756.099-2.85.949-2.788 2.166.032.626.35 1.164.895 1.516.522.337 1.204.512 1.926.474 1.184-.062 2.086-.512 2.61-1.302.401-.6.6-1.375.646-2.474-.878-.226-1.685-.353-2.573-.385Z"/></svg>`
    },
    {
        name: "Discord",
        url: "https://discord.com/users/1406973836523606120",
        color: "#5865F2",
        icon: `<svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.955 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`
    },
    {
        name: "Facebook",
        url: "https://www.facebook.com/share/1Fck9x3xXp/",
        color: "#1877F2",
        icon: `<svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
    }
];


function renderSocialLinks() {

    let html = `<div class="auth-widget-social-label">Follow / Pantau Aku</div><div class="auth-widget-social">`;

    SOCIAL_LINKS.forEach(social => {
        html += `
            <a href="${social.url}" target="_blank" rel="noopener noreferrer" title="${social.name}" style="background:${social.color};">
                ${social.icon}
            </a>
        `;
    });

    html += `</div>`;

    return html;

}


// ---- CSS WIDGET (disuntik otomatis, tidak perlu tambahan di file lain) ----

const style = document.createElement("style");
style.textContent = `

    .auth-widget-trigger {
        position: absolute;
        top: 16px;
        right: 16px;
        z-index: 999;

        width: 40px;
        height: 40px;
        border-radius: 50%;

        display: flex;
        align-items: center;
        justify-content: center;

        background: var(--surface-soft, #f0f0f0);
        border: 1px solid var(--border, #ddd);
        cursor: pointer;
        overflow: hidden;
        padding: 0;
    }

    .auth-widget-trigger img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .auth-widget-trigger svg {
        width: 20px;
        height: 20px;
        color: var(--text-light, #888);
    }

    .auth-widget-overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.35);
        z-index: 1000;
    }

    .auth-widget-overlay.open {
        display: block;
    }

    .auth-widget-panel {
        position: fixed;
        top: 0;
        right: 0;
        bottom: auto;
        height: 100vh;
        height: 100dvh;
        width: min(85vw, 340px);

        background: var(--bg, #fff);
        box-shadow: -4px 0 20px rgba(0,0,0,0.15);

        /* Tombol tutup tetap di atas, isi panel yang bisa digulir */
        display: flex;
        flex-direction: column;
        padding: 0;
        box-sizing: border-box;

        transform: translateX(100%);
        transition: transform 0.25s ease;
    }

    .auth-widget-overlay.open .auth-widget-panel {
        transform: translateX(0);
    }

    .auth-widget-close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: var(--text-light, #888);
        align-self: flex-end;
        flex-shrink: 0;
        margin: 14px 16px 0 0;
        padding: 4px 8px;
    }

    #auth-widget-content {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
        padding: 0 20px calc(28px + env(safe-area-inset-bottom, 0px));
    }

    /* Saat panel terbuka, halaman di belakangnya tidak ikut tergulir */
    html.auth-widget-lock { overflow: hidden; }

    .auth-widget-profile {
        text-align: center;
        margin-top: 30px;
    }

    .auth-widget-profile img {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        margin-bottom: 12px;
    }

    .auth-widget-name {
        font-weight: bold;
        font-size: 16px;
    }

    .auth-widget-email {
        font-size: 13px;
        color: var(--text-light, #888);
        margin-bottom: 4px;
    }

    .auth-widget-badge {
        display: inline-block;
        font-size: 11px;
        font-weight: bold;
        letter-spacing: 1px;
        padding: 3px 10px;
        border-radius: 20px;
        background: var(--accent, #5b9bd5);
        color: var(--on-accent, #fff);
        margin-top: 6px;
    }

    .auth-widget-btn {
        width: 100%;
        padding: 12px;
        margin-top: 24px;
        border-radius: 10px;
        border: 1px solid var(--border, #ddd);
        background: var(--surface-soft, #f7f7f7);
        color: var(--text, #333);
        font-weight: bold;
        font-size: 14px;
        cursor: pointer;
    }

    .auth-widget-btn.primary {
        background: var(--accent, #5b9bd5);
        color: var(--on-accent, #fff);
        border: none;
    }

    .auth-widget-intro {
        text-align: center;
        margin-top: 40px;
        color: var(--text-light, #888);
        font-size: 14px;
    }

    .auth-widget-social {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid var(--border, #ddd);
    }

    .auth-widget-social a {
        width: 38px;
        height: 38px;
        border-radius: 50%;

        display: flex;
        align-items: center;
        justify-content: center;

        text-decoration: none;
    }

    .auth-widget-social a svg {
        width: 18px;
        height: 18px;
        fill: white;
    }

    .auth-widget-social-label {
        text-align: center;
        font-size: 12px;
        color: var(--text-light, #888);
        margin-top: 20px;
        letter-spacing: 1px;
        text-transform: uppercase;
    }

    .auth-widget-section-label {
        text-align: center;
        font-size: 12px;
        color: var(--text-light, #888);
        margin-top: 24px;
        letter-spacing: 1px;
        text-transform: uppercase;
    }

    .auth-widget-themes {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-top: 12px;
    }

    .auth-widget-theme-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        padding: 9px 10px;
        border-radius: 10px;
        border: 1px solid var(--border, #ddd);
        background: var(--surface-soft, #f7f7f7);
        color: var(--text, #333);
        font-size: 13px;
        cursor: pointer;
        text-align: left;
    }

    .auth-widget-theme-btn.active {
        border-color: var(--accent, #5b9bd5);
        box-shadow: 0 0 0 1px var(--accent, #5b9bd5);
        font-weight: bold;
    }

    .auth-widget-swatch {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 1px solid var(--border, #ddd);
        flex-shrink: 0;
    }

    .auth-widget-switch-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        margin-top: 12px;
        font-size: 14px;
        color: var(--text, #333);
    }

    .auth-widget-switch {
        position: relative;
        width: 44px;
        height: 24px;
        flex-shrink: 0;
        margin: 0;
        padding: 0;
        border-radius: 999px;
        border: 1px solid var(--border, #ddd);
        background: var(--surface-soft, #f7f7f7);
        cursor: pointer;
    }

    .auth-widget-switch span {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: var(--text-light, #888);
        transition: left 0.2s;
    }

    .auth-widget-switch.on {
        background: var(--accent, #5b9bd5);
        border-color: var(--accent, #5b9bd5);
    }

    .auth-widget-switch.on span {
        left: 22px;
        background: var(--on-accent, #fff);
    }

    .auth-widget-hint {
        font-size: 12px;
        color: var(--text-light, #888);
        margin-top: 8px;
        line-height: 1.5;
    }

    .auth-widget-notice {
        margin-top: 20px;
        padding: 12px;
        border: 1px solid var(--accent, #5b9bd5);
        border-radius: 10px;
        background: var(--surface-soft, #f7f7f7);
        font-size: 14px;
        color: var(--text, #333);
    }

    .auth-widget-notice p {
        margin: 4px 0 8px;
    }

    .auth-widget-notice a {
        color: var(--accent-hover, #5b9bd5);
        font-weight: bold;
        margin-right: 8px;
    }

    .auth-widget-mini {
        margin: 0;
        padding: 4px 10px;
        border-radius: 8px;
        border: 1px solid var(--border, #ddd);
        background: transparent;
        color: var(--text-light, #888);
        font-size: 12px;
        cursor: pointer;
    }

    #auth-widget-dot {
        display: none;
        position: absolute;
        top: 12px;
        right: 12px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #e53e3e;
        border: 2px solid var(--bg, #fff);
        z-index: 999;
        pointer-events: none;
    }

    /* style.css punya aturan button:hover global (latar aksen). Di panel ini dinetralkan,
       supaya tombol tidak tetap berwarna aksen setelah diketuk di layar sentuh. */
    .auth-widget-trigger:hover { background: var(--surface-soft, #f0f0f0); }
    .auth-widget-close:hover { background: none; }
    .auth-widget-btn:hover { background: var(--surface-soft, #f7f7f7); }
    .auth-widget-btn.primary:hover { background: var(--accent-hover, #5b9bd5); }
    .auth-widget-theme-btn:hover { background: var(--surface-soft, #f7f7f7); }
    .auth-widget-switch:hover { background: var(--surface-soft, #f7f7f7); }
    .auth-widget-switch.on:hover { background: var(--accent, #5b9bd5); }
    .auth-widget-mini:hover { background: transparent; }

`;
document.head.appendChild(style);


// ---- HTML WIDGET (disuntik otomatis) ----

const trigger = document.createElement("button");
trigger.className = "auth-widget-trigger";
trigger.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="8" r="4"></circle>
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6"></path>
    </svg>
`;
document.body.appendChild(trigger);

const dot = document.createElement("span");
dot.id = "auth-widget-dot";
document.body.appendChild(dot);

const overlay = document.createElement("div");
overlay.className = "auth-widget-overlay";
overlay.innerHTML = `
    <div class="auth-widget-panel">
        <button class="auth-widget-close">✕</button>
        <div id="auth-widget-content"></div>
    </div>
`;
document.body.appendChild(overlay);

const contentEl = document.getElementById("auth-widget-content");


// ---- BUKA / TUTUP PANEL ----

function setPanel(open) {
    overlay.classList.toggle("open", open);
    document.documentElement.classList.toggle("auth-widget-lock", open);
}

trigger.addEventListener("click", () => setPanel(true));
overlay.querySelector(".auth-widget-close").addEventListener("click", () => setPanel(false));
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) setPanel(false);
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) setPanel(false);
});


// ---- RENDER ISI PANEL SESUAI STATUS LOGIN ----

function renderLoggedOut() {

    trigger.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="8" r="4"></circle>
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6"></path>
        </svg>
    `;

    contentEl.innerHTML = `
        <p class="auth-widget-intro">
            Login untuk ikut komentar di tulisan.
        </p>
        <button class="auth-widget-btn primary" id="auth-widget-login-btn">
            Sign in with Google
        </button>
        <div id="auth-widget-notif"></div>
        ${renderThemePicker()}
        ${renderSocialLinks()}
    `;

    document.getElementById("auth-widget-login-btn").addEventListener("click", async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            alert("Login gagal, coba lagi.");
        }
    });

}


function renderLoggedIn(user) {

    trigger.innerHTML = `<img src="${esc(user.photoURL || '')}" alt="${esc(user.displayName || '')}">`;

    const isAdmin = user.email === ADMIN_EMAIL;

    contentEl.innerHTML = `
        <div class="auth-widget-profile">
            <img src="${esc(user.photoURL || '')}" alt="${esc(user.displayName || '')}">
            <p class="auth-widget-name">${esc(user.displayName || 'Tanpa nama')}</p>
            <p class="auth-widget-email">${esc(user.email)}</p>
            ${isAdmin ? `<span class="auth-widget-badge">ADMIN</span>` : ""}
        </div>

        <a href="${SAVED_URL}" style="text-decoration:none;"><button class="auth-widget-btn" type="button">Tersimpan</button></a>

        ${isAdmin ? `<a href="${ACCOUNT_URL}" style="text-decoration:none;"><button class="auth-widget-btn">Buka Panel Admin</button></a>` : ""}

        <button class="auth-widget-btn" id="auth-widget-logout-btn">
            Logout
        </button>

        <div id="auth-widget-notif"></div>
        ${renderThemePicker()}
        ${renderSocialLinks()}
    `;

    document.getElementById("auth-widget-logout-btn").addEventListener("click", () => signOut(auth));

}


contentEl.addEventListener("click", async (e) => {

    const themeBtn = e.target.closest("[data-theme-choice]");
    if (themeBtn) {
        chooseTheme(themeBtn.dataset.themeChoice);
        return;
    }

    // Saklar notifikasi
    if (e.target.closest("[data-notif-toggle]")) {
        if (notifOn()) {
            setNotifOn(false);
        } else {
            setNotifOn(true);
            await loadLatest(true);
            // Mulai dari sekarang: hanya tulisan BERIKUTNYA yang diberi tahu
            setSeen(latest ? latest.ms : Date.now());
        }
        renderNotifArea();
        return;
    }

    // "Baca sekarang": tandai dibaca lalu biarkan tautannya jalan
    if (e.target.closest("[data-notif-read]")) {
        if (latest) setSeen(latest.ms);
        return;
    }

    if (e.target.closest("[data-notif-dismiss]")) {
        if (latest) setSeen(latest.ms);
        renderNotifArea();
    }
});

async function initNotif() {
    if (!notifOn()) return;
    await loadLatest(false);
    markSeenIfReading();
    renderNotifArea();
}

initNotif();

onAuthStateChanged(auth, (user) => {
    if (user) {
        renderLoggedIn(user);
    } else {
        renderLoggedOut();
    }
    markActiveTheme();
    renderNotifArea();
});
