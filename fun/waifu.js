// ========================================
// FETCH WAIFU DARI FIRESTORE
// ========================================

import { db } from "../firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";


async function loadWaifu() {

    const gridEl = document.getElementById("waifu-grid");

    if (!gridEl) return;

    try {

        const snapshot = await getDocs(collection(db, "waifu"));

        if (snapshot.empty) {
            gridEl.innerHTML = `<p class="coming-soon">Belum ada waifu di sini.</p>`;
            return;
        }

        snapshot.forEach((docSnap) => {

            const data = docSnap.data();

            const card = document.createElement("a");
            card.className = "waifu-card";
            card.href = `waifu-detail.html?id=${docSnap.id}`;

            card.innerHTML = `
                <img src="${data.icon || ''}" alt="${data.name}">
                <div class="waifu-card-info">
                    <h3>${data.name}</h3>
                    <p>${data.source}</p>
                </div>
            `;

            gridEl.appendChild(card);

        });

    } catch (error) {
        gridEl.innerHTML = `<p style="color:#e53e3e;">Gagal memuat: ${error.message}</p>`;
    }

}

loadWaifu();
