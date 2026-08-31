// ========================================
// AUTH WIDGET
// Avatar/tombol login di pojok kanan atas + popup panel.
// Include file ini di halaman mana pun dengan:
// <script type="module" src="PATH/auth-widget.js"></script>
// (sesuaikan PATH relatif ke lokasi firebase-config.js)
// ========================================

import { auth } from "./firebase-config.js";

import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";


const ADMIN_EMAIL = "im.raito.id@gmail.com";


// ---- CSS WIDGET (disuntik otomatis, tidak perlu tambahan di file lain) ----

const style = document.createElement("style");
style.textContent = `

    .auth-widget-trigger {
        position: fixed;
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
        bottom: 0;
        width: min(85vw, 340px);

        background: var(--bg, #fff);
        box-shadow: -4px 0 20px rgba(0,0,0,0.15);

        padding: 24px 20px;
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
        float: right;
    }

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
        color: #fff;
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
        color: #fff;
        border: none;
    }

    .auth-widget-intro {
        text-align: center;
        margin-top: 40px;
        color: var(--text-light, #888);
        font-size: 14px;
    }

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

trigger.addEventListener("click", () => overlay.classList.add("open"));
overlay.querySelector(".auth-widget-close").addEventListener("click", () => overlay.classList.remove("open"));
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("open");
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

    trigger.innerHTML = `<img src="${user.photoURL || ''}" alt="${user.displayName || ''}">`;

    const isAdmin = user.email === ADMIN_EMAIL;

    contentEl.innerHTML = `
        <div class="auth-widget-profile">
            <img src="${user.photoURL || ''}" alt="${user.displayName || ''}">
            <p class="auth-widget-name">${user.displayName || 'Tanpa nama'}</p>
            <p class="auth-widget-email">${user.email}</p>
            ${isAdmin ? `<span class="auth-widget-badge">ADMIN</span>` : ""}
        </div>

        ${isAdmin ? `<a href="account.html" style="text-decoration:none;"><button class="auth-widget-btn">Buka Panel Admin</button></a>` : ""}

        <button class="auth-widget-btn" id="auth-widget-logout-btn">
            Logout
        </button>
    `;

    document.getElementById("auth-widget-logout-btn").addEventListener("click", () => signOut(auth));

}


onAuthStateChanged(auth, (user) => {
    if (user) {
        renderLoggedIn(user);
    } else {
        renderLoggedOut();
    }
});
