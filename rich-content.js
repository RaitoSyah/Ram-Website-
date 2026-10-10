// rich-content.js
// Dipakai bersama oleh account.html (editor) dan writings/article.html (tampilan),
// supaya aturan penyaringan HTML dan pemuatan font selalu sama di kedua tempat.

const BASE = new URL("./", import.meta.url); // folder utama website

// Font bawaan perangkat (selalu tersedia di pilihan font)
export const BUILTIN_FONTS = ["Georgia", "Courier New", "Verdana"];

// Pilihan ukuran huruf
export const FONT_SIZES = ["14px", "18px", "22px", "28px", "36px"];

const NAME_OK = /^[A-Za-z0-9 ]{1,40}$/;
const FORMAT_BY_EXT = { woff2: "woff2", woff: "woff", ttf: "truetype", otf: "opentype" };
const VARIANTS = [
    ["regular", "normal", "normal"],
    ["bold", "bold", "normal"],
    ["italic", "normal", "italic"],
    ["boldItalic", "bold", "italic"]
];


// Membaca daftar font di fonts/fonts.js, mendaftarkannya lewat @font-face,
// dan mengembalikan nama-nama font yang berhasil didaftarkan.
export async function loadCustomFonts() {

    let list = [];

    try {
        const mod = await import(new URL("./fonts/fonts.js", BASE).href);
        list = Array.isArray(mod.FONTS) ? mod.FONTS : [];
    } catch (e) {
        return []; // folder/berkas fonts belum ada: tidak apa-apa
    }

    const names = [];
    let css = "";

    for (const f of list) {

        if (!f || !NAME_OK.test(f.name || "")) continue;

        let any = false;

        for (const [key, weight, style] of VARIANTS) {
            const file = f[key];
            if (!file) continue;

            const ext = String(file).split(".").pop().toLowerCase();
            const fmt = FORMAT_BY_EXT[ext];
            if (!fmt) continue;

            const url = new URL("./fonts/" + encodeURI(file), BASE).href;

            css += `@font-face{font-family:"${f.name}";src:url("${url}") format("${fmt}");font-weight:${weight};font-style:${style};font-display:swap;}\n`;
            any = true;
        }

        if (any) names.push(f.name);
    }

    if (css) {
        const st = document.createElement("style");
        st.textContent = css;
        document.head.appendChild(st);
    }

    return names;
}


// ---------- Penyaringan HTML (DOMPurify) ----------

const COLOR_RE = /^(#[0-9a-f]{3,8}|rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*[\d.]+\s*)?\)|[a-z]{3,20})$/i;
const FAMILY_RE = /^[A-Za-z0-9 ,"'-]{1,80}$/;
const SIZE_RE = /^\d{1,3}(\.\d+)?(px|em|rem|%)$/;

// Hanya 4 properti CSS yang boleh lolos: warna, latar, font, ukuran
function cleanStyle(style) {
    const out = [];
    style.split(";").forEach(decl => {
        const i = decl.indexOf(":");
        if (i < 0) return;
        const prop = decl.slice(0, i).trim().toLowerCase();
        const val = decl.slice(i + 1).trim();
        if ((prop === "color" || prop === "background-color") && COLOR_RE.test(val)) out.push(`${prop}: ${val}`);
        else if (prop === "font-family" && FAMILY_RE.test(val)) out.push(`font-family: ${val}`);
        else if (prop === "font-size" && SIZE_RE.test(val)) out.push(`font-size: ${val}`);
    });
    return out.join("; ");
}

let hooked = false;

function ensureHook() {
    if (hooked || typeof DOMPurify === "undefined") return;
    hooked = true;

    DOMPurify.addHook("afterSanitizeAttributes", (node) => {

        if (!node.hasAttribute) return;

        if (node.hasAttribute("class")) {
            const keep = node.getAttribute("class").split(/\s+/)
                .filter(c => /^ql-align-(center|right|justify)$/.test(c));
            if (keep.length) node.setAttribute("class", keep.join(" "));
            else node.removeAttribute("class");
        }

        if (node.hasAttribute("style")) {
            const cleaned = cleanStyle(node.getAttribute("style"));
            if (cleaned) node.setAttribute("style", cleaned);
            else node.removeAttribute("style");
        }

        if (node.tagName === "A") {
            node.setAttribute("target", "_blank");
            node.setAttribute("rel", "noopener noreferrer");
        }
    });
}

// Mengembalikan HTML yang sudah disaring, atau null kalau DOMPurify tidak termuat.
export function sanitizeRich(html) {

    if (typeof DOMPurify === "undefined") return null;

    ensureHook();

    return DOMPurify.sanitize(String(html || ""), {
        ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "s", "span", "h2", "h3", "h4", "ul", "ol", "li", "blockquote", "a"],
        ALLOWED_ATTR: ["href", "target", "rel", "class", "style"]
    }).replace(/&nbsp;|\u00a0/g, " "); // spasi khusus dari editor jadi spasi biasa
}
