// mirror.js
// Antarmuka Personality Mirror. Logika hitungan ada di engine.js,
// data skenario di scenarios.js, dan semua teks di content.js.
//
// Privasi: tidak ada localStorage, cookie, atau permintaan jaringan untuk jawaban.
// Semua keadaan hidup di memori halaman. Kode hasil juga sengaja TIDAK dimasukkan ke URL,
// supaya tidak ikut tercatat oleh alat statistik kunjungan.

import { SCENARIOS, SCENARIOS_VERSION, IS_PLACEHOLDER } from "./scenarios.js";
import { CONTENT, TRAITS, TRAIT_ORDER } from "./content.js";
import {
    validateScenarios,
    playOrder,
    shuffled,
    scoreAnswers,
    encodeCode,
    formatCode,
    decodeCode
} from "./engine.js";


const $ = (id) => document.getElementById(id);

const esc = (t) => String(t ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));

const VIEWS = {
    error: $("view-error"),
    intro: $("view-intro"),
    play: $("view-play"),
    result: $("view-result"),
    edu: $("view-edu"),
    code: $("view-code")
};

// Pengaturan hasil (boleh disesuaikan)
const CFG = {
    varySd: 1.2,        // simpangan baku jawaban dalam satu dimensi yang dianggap "bervariasi"
    minForVary: 3       // minimal jawaban dalam dimensi itu agar catatan variasi dipakai
};

const state = {
    order: [],
    pos: 0,
    answers: [],
    optOrder: {},
    result: null,
    code: "",
    fromCode: false
};


// ---------- Tampilan ----------

function showView(name, push = true, focusHeading = true) {

    Object.entries(VIEWS).forEach(([key, el]) => { el.hidden = key !== name; });

    if (push) history.pushState({ v: name }, "");

    window.scrollTo(0, 0);

    if (!focusHeading) return;

    const heading = VIEWS[name].querySelector("h2");
    if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
    }
}


function renderIntro() {

    VIEWS.intro.innerHTML = `
        <p class="writing-category">${esc(CONTENT.introLabel)}</p>
        <h2>${esc(CONTENT.title)} 🪞</h2>
        <p class="pm-tagline">${esc(CONTENT.tagline)}</p>
        ${CONTENT.intro.map(p => `<p>${esc(p)}</p>`).join("")}
        <div class="pm-note">
            <h3>${esc(CONTENT.disclaimerTitle)}</h3>
            ${CONTENT.disclaimer.map(p => `<p>${esc(p)}</p>`).join("")}
        </div>
        <div class="pm-actions">
            <button type="button" class="pm-btn" data-go="start">${esc(CONTENT.startLabel)}</button>
            <button type="button" class="pm-btn pm-btn-ghost" data-go="code">${esc(CONTENT.codeLabel)}</button>
            <button type="button" class="pm-btn pm-btn-ghost" data-go="edu">${esc(CONTENT.learnLabel)}</button>
        </div>
    `;
}


function startPlay() {
    state.order = playOrder(SCENARIOS);
    state.pos = 0;
    state.answers = new Array(SCENARIOS.length).fill(null);
    state.optOrder = {};
    state.result = null;
    renderPlay();
    showView("play");
}


function renderPlay() {

    const idx = state.order[state.pos];
    const s = SCENARIOS[idx];
    const total = state.order.length;
    const isLast = state.pos === total - 1;

    // Urutan pilihan diacak sekali per skenario dan dipertahankan kalau pengunjung kembali
    if (!state.optOrder[idx]) state.optOrder[idx] = shuffled([0, 1, 2, 3]);

    const chosen = state.answers[idx];

    VIEWS.play.innerHTML = `
        <div class="pm-progress" role="progressbar" aria-label="Kemajuan"
             aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${state.pos + 1}">
            <div class="pm-progress-bar" style="width:${((state.pos + 1) / total) * 100}%"></div>
        </div>
        <p class="pm-count" aria-live="polite">Situasi ${state.pos + 1} dari ${total}</p>
        <h2>${esc(s.title)}</h2>
        <p class="pm-situation">${esc(s.situation)}</p>
        <fieldset class="pm-options">
            <legend class="pm-sr">${esc(CONTENT.playHint)}</legend>
            ${state.optOrder[idx].map(oi => `
                <label class="pm-option${chosen === oi ? " selected" : ""}">
                    <input type="radio" name="pm-opt" value="${oi}"${chosen === oi ? " checked" : ""}>
                    <span>${esc(s.options[oi].text)}</span>
                </label>
            `).join("")}
        </fieldset>
        <p class="pm-hint">${esc(CONTENT.playHint)}</p>
        <div class="pm-nav">
            <button type="button" class="pm-btn pm-btn-ghost" data-go="prev"${state.pos === 0 ? " disabled" : ""}>Kembali</button>
            <button type="button" class="pm-btn" data-go="next"${chosen === null ? " disabled" : ""}>${isLast ? "Lihat hasil" : "Lanjut"}</button>
        </div>
    `;

    const heading = VIEWS.play.querySelector("h2");
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
}


function bandLabel(p, t) {
    if (p < 20) return `Cenderung kuat ke “${t.low}”`;
    if (p < 40) return `Agak ke “${t.low}”`;
    if (p <= 60) return "Seimbang, di sekitar tengah";
    if (p <= 80) return `Agak ke “${t.high}”`;
    return `Cenderung kuat ke “${t.high}”`;
}

function levelOf(p) {
    if (p < 40) return "low";
    if (p > 60) return "high";
    return "mid";
}


function renderResult() {

    const r = state.result;

    const traitsHtml = TRAIT_ORDER.map(k => {
        const t = TRAITS[k];
        const x = r[k];
        const label = `${t.name} (${t.gloss})`;
        const varied = x.n >= CFG.minForVary && x.sd >= CFG.varySd;

        return `
            <div class="pm-trait">
                <div class="pm-trait-head">
                    <span class="pm-letter" aria-hidden="true">${k}</span>
                    <strong>${esc(label)}</strong>
                </div>
                <p class="pm-caption">${esc(t.about)}</p>
                <div class="pm-track" role="img"
                     aria-label="${esc(label)}: posisi ${x.position} dari 100, antara ${esc(t.low)} dan ${esc(t.high)}">
                    <div class="pm-marker" data-pos="${x.position}"></div>
                </div>
                <div class="pm-poles"><span>${esc(t.low)}</span><span>${esc(t.high)}</span></div>
                <p class="pm-band">${esc(bandLabel(x.position, t))}</p>
                <p>${esc(t.text[levelOf(x.position)])}</p>
                ${varied ? `<p class="pm-vary">${esc(CONTENT.varyNote)}</p>` : ""}
            </div>
        `;
    }).join("");

    const rowsHtml = TRAIT_ORDER.map(k => {
        const t = TRAITS[k];
        const x = r[k];
        return `
            <tr>
                <td>${k} · ${esc(t.name)} (${esc(t.gloss)})</td>
                <td>${x.position}</td>
                <td>${esc(bandLabel(x.position, t))}</td>
            </tr>
        `;
    }).join("");

    VIEWS.result.innerHTML = `
        <p class="writing-category">HASIL EKSPLORASI</p>
        <h2>${esc(CONTENT.resultTitle)}</h2>
        <p>${esc(CONTENT.resultIntro)}</p>
        ${state.fromCode ? `<p class="pm-caption">${esc(CONTENT.resultFromCode)}</p>` : ""}

        ${traitsHtml}

        <h3>Ringkasan dalam tabel</h3>
        <div class="pm-tablewrap">
            <table class="pm-table">
                <thead><tr><th>Dimensi</th><th>Posisi</th><th>Kecenderungan</th></tr></thead>
                <tbody>${rowsHtml}</tbody>
            </table>
        </div>
        <p class="pm-caption">${esc(CONTENT.tableCaption)}</p>

        <h3>${esc(CONTENT.codeTitle)}</h3>
        <p>${esc(CONTENT.codeHelp)}</p>
        <code class="pm-codebox" id="pm-code-text">${esc(state.code)}</code>
        <div class="pm-actions" style="margin-top:0;">
            <button type="button" class="pm-btn pm-btn-ghost" data-go="copy">Salin kode</button>
            <span class="pm-caption" id="pm-copy-status" role="status" style="align-self:center;"></span>
        </div>
        <p class="pm-warn">${esc(CONTENT.codeWarning)}</p>

        <div class="pm-note">
            <p>${esc(CONTENT.closingNote)}</p>
        </div>

        <div class="pm-actions">
            <button type="button" class="pm-btn" data-go="restart">${esc(CONTENT.retryLabel)}</button>
            <button type="button" class="pm-btn pm-btn-ghost" data-go="edu">${esc(CONTENT.eduLabel)}</button>
        </div>
    `;

    // Penanda bergeser dari tengah ke posisinya (tanpa animasi jika pengguna meminta gerak dikurangi)
    requestAnimationFrame(() => requestAnimationFrame(() => {
        VIEWS.result.querySelectorAll(".pm-marker").forEach(m => {
            m.style.left = m.dataset.pos + "%";
        });
    }));
}


function renderEdu() {

    VIEWS.edu.innerHTML = `
        <p class="writing-category">PENJELASAN</p>
        <h2>Mengenal Big Five</h2>
        ${CONTENT.education.map((item, i) => `
            <details class="pm-details"${i === 0 ? " open" : ""}>
                <summary>${esc(item.q)}</summary>
                <div>${item.a.map(p => `<p>${esc(p)}</p>`).join("")}</div>
            </details>
        `).join("")}
        <div class="pm-actions">
            <button type="button" class="pm-btn" data-go="start">${esc(CONTENT.startLabel)}</button>
            <button type="button" class="pm-btn pm-btn-ghost" data-go="intro">Kembali ke awal</button>
        </div>
    `;
}


function renderCodeEntry() {

    VIEWS.code.innerHTML = `
        <p class="writing-category">KODE HASIL</p>
        <h2>${esc(CONTENT.codeEntryTitle)}</h2>
        <p>${esc(CONTENT.codeEntryHelp)}</p>
        <label class="pm-sr" for="pm-code-input">Kode hasil</label>
        <input type="text" id="pm-code-input" class="pm-input"
               placeholder="${esc(CONTENT.codeEntryPlaceholder)}"
               autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="40">
        <p class="pm-error" id="pm-code-error" role="alert"></p>
        <div class="pm-actions">
            <button type="button" class="pm-btn" data-go="decode">${esc(CONTENT.codeEntryButton)}</button>
            <button type="button" class="pm-btn pm-btn-ghost" data-go="intro">Kembali</button>
        </div>
    `;
}


// ---------- Aksi ----------

function finish() {

    state.result = scoreAnswers(SCENARIOS, state.answers);
    state.code = formatCode(encodeCode(state.answers, SCENARIOS_VERSION));
    state.fromCode = false;

    renderResult();
    showView("result");
}


function decodeEntered() {

    const input = $("pm-code-input");
    const errorEl = $("pm-code-error");

    const res = decodeCode(input.value, SCENARIOS_VERSION, SCENARIOS.length);

    if (!res.ok) {
        errorEl.textContent = CONTENT.codeErrors[res.reason] || CONTENT.codeErrors.checksum;
        return;
    }

    state.answers = res.answers;
    state.result = scoreAnswers(SCENARIOS, state.answers);
    state.code = formatCode(encodeCode(state.answers, SCENARIOS_VERSION));
    state.fromCode = true;

    renderResult();
    showView("result");
}


async function copyCode() {

    const status = $("pm-copy-status");
    const text = state.code;

    try {
        await navigator.clipboard.writeText(text);
        status.textContent = "Kode tersalin.";
    } catch (e) {
        // Cadangan: blok teksnya supaya bisa disalin manual
        const node = $("pm-code-text");
        const range = document.createRange();
        range.selectNodeContents(node);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        status.textContent = "Kode sudah diblok, salin secara manual.";
    }

    setTimeout(() => { status.textContent = ""; }, 3000);
}


document.addEventListener("click", (e) => {

    const btn = e.target.closest("[data-go]");
    if (!btn || btn.disabled) return;

    const go = btn.dataset.go;

    if (go === "start" || go === "restart") startPlay();
    else if (go === "intro") showView("intro");
    else if (go === "edu") { renderEdu(); showView("edu"); }
    else if (go === "code") { renderCodeEntry(); showView("code"); $("pm-code-input").focus(); }
    else if (go === "decode") decodeEntered();
    else if (go === "copy") copyCode();
    else if (go === "prev") {
        if (state.pos > 0) { state.pos--; renderPlay(); }
    } else if (go === "next") {
        if (state.pos < state.order.length - 1) { state.pos++; renderPlay(); }
        else finish();
    }
});

VIEWS.play.addEventListener("change", (e) => {

    if (e.target.name !== "pm-opt") return;

    const idx = state.order[state.pos];
    state.answers[idx] = Number(e.target.value);

    VIEWS.play.querySelectorAll(".pm-option").forEach(l => {
        l.classList.toggle("selected", l.contains(e.target));
    });

    VIEWS.play.querySelector('[data-go="next"]').disabled = false;
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.id === "pm-code-input") {
        e.preventDefault();
        decodeEntered();
    }
});

// Tombol kembali browser mengikuti tampilan yang sudah dikunjungi
window.addEventListener("popstate", (e) => {

    let v = e.state && e.state.v;

    if (!v || !VIEWS[v]) v = "intro";
    if (v === "result" && !state.result) v = "intro";
    if (v === "play" && !state.order.length) v = "intro";
    if (v === "code" && !VIEWS.code.innerHTML.trim()) renderCodeEntry();
    if (v === "edu" && !VIEWS.edu.innerHTML.trim()) renderEdu();

    showView(v, false);
});


// ---------- Mulai ----------

function init() {

    const check = validateScenarios(SCENARIOS);

    if (check.errors.length) {
        VIEWS.error.innerHTML = `
            <h2>Data skenario belum valid</h2>
            <p>Periksa <code>scenarios.js</code> (atau buka <code>check.html</code>) lalu perbaiki hal berikut:</p>
            <ul>${check.errors.slice(0, 12).map(x => `<li>${esc(x)}</li>`).join("")}</ul>
        `;
        showView("error", false, false);
        return;
    }

    if (IS_PLACEHOLDER) {
        const banner = $("pm-banner");
        banner.textContent = CONTENT.placeholderBanner;
        banner.hidden = false;
    }

    renderIntro();
    history.replaceState({ v: "intro" }, "");
    showView("intro", false, false);
}

init();
