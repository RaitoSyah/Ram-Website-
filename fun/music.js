// ========================================
// FETCH MUSIC DARI FIRESTORE
// ========================================

import { db } from "../firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";


async function loadMusic() {

    const currentContainer = document.getElementById("currently-listening");
    const musicLibrary = document.getElementById("music-library");

    try {

        const snapshot = await getDocs(collection(db, "music"));
        const allMusic = snapshot.docs.map(doc => doc.data());


        // ========================================
        // CURRENTLY LISTENING
        // ========================================

        if (currentContainer) {

            const currentSong = allMusic.find(song => song.status === "currently");

            if (!currentSong) {
                currentContainer.innerHTML = `<p class="coming-soon">Belum ada yang lagi didengarkan.</p>`;
            } else {

                currentContainer.innerHTML = `
                    <a
                        class="currently-playing"
                        href="${currentSong.link || '#'}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src="${currentSong.image}" alt="${currentSong.title}">

                        <div class="currently-info">
                            <p class="writing-category">CURRENTLY PLAYING</p>
                            <h3>${currentSong.title}</h3>
                            <p>${currentSong.artist}</p>
                        </div>
                    </a>
                `;

            }

        }


        // ========================================
        // MUSIC LIBRARY (semua lagu, termasuk currently)
        // ========================================

        if (musicLibrary) {

            if (allMusic.length === 0) {
                musicLibrary.innerHTML = `<p class="coming-soon">Belum ada musik di library.</p>`;
            }

            allMusic.forEach((song) => {

                const item = document.createElement("a");
                item.className = "music-item";
                item.href = song.link || "#";
                item.target = "_blank";
                item.rel = "noopener noreferrer";

                item.innerHTML = `
                    <img src="${song.image}" alt="${song.title}">
                    <div class="music-info">
                        <h3>${song.title}</h3>
                        <p>${song.artist}</p>
                    </div>
                `;

                musicLibrary.appendChild(item);

            });

        }

    } catch (error) {

        if (musicLibrary) {
            musicLibrary.innerHTML = `<p style="color:#e53e3e;">Gagal memuat musik: ${error.message}</p>`;
        }

    }

}

loadMusic();
