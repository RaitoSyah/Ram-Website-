// ========================================
// FETCH GAMES DARI FIRESTORE
// (games = library, game-sessions = riwayat main)
// ========================================

import { db } from "../firebase-config.js";

import {
    collection,
    query,
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";


function formatDate(timestamp) {
    if (!timestamp) return "";
    return timestamp.toDate().toLocaleTimeString("id-ID", {
        hour: "2-digit", minute: "2-digit"
    });
}


function mabarInfo(game) {
    if (!game.nickname && !game.gameId) return "";
    let html = `<p style="margin-top:8px; font-size:13px; color:var(--text-muted);">`;
    if (game.nickname) html += `IGN: <strong>${game.nickname}</strong>`;
    if (game.nickname && game.gameId) html += ` &middot; `;
    if (game.gameId) html += `ID: <strong>${game.gameId}</strong>`;
    html += `</p>`;
    return html;
}


async function loadGames() {

    const currentlyPlaying = document.getElementById("currently-playing");
    const recentlyPlayed = document.getElementById("recently-played");
    const gameLibrary = document.getElementById("game-library");

    try {

        // ---- AMBIL LIBRARY (kamus semua game) ----

        const librarySnapshot = await getDocs(collection(db, "games"));
        const libraryMap = {};

        librarySnapshot.forEach((docSnap) => {
            libraryMap[docSnap.id] = docSnap.data();
        });


        // ---- AMBIL RIWAYAT MAIN, URUT TERBARU ----

        const sessionsQuery = query(
            collection(db, "game-sessions"),
            orderBy("startedAt", "desc")
        );

        const sessionsSnapshot = await getDocs(sessionsQuery);

        const sessions = sessionsSnapshot.docs.map(docSnap => docSnap.data());


        // ========================================
        // CURRENTLY PLAYING = sesi paling baru
        // ========================================

        if (currentlyPlaying) {

            if (sessions.length === 0) {
                currentlyPlaying.innerHTML = `<p class="coming-soon">Belum ada yang lagi dimainkan.</p>`;
            } else {

                const latestSession = sessions[0];
                const game = libraryMap[latestSession.gameRef];

                if (game) {

                    const card = document.createElement("a");
                    card.className = "game-card";
                    card.href = game.link || "#";
                    card.target = "_blank";
                    card.rel = "noopener noreferrer";
                    card.style.textDecoration = "none";
                    card.style.color = "inherit";

                    card.innerHTML = `
                        <div class="game-image">
                            <img src="${game.image}" alt="${game.name}">
                        </div>
                        <div class="game-info">
                            <p class="writing-category">${game.category}</p>
                            <h3>${game.name}</h3>
                            <p>${game.description || ""}</p>
                            <p class="game-status">🟢 Currently Playing</p>
                            ${mabarInfo(game)}
                        </div>
                    `;

                    currentlyPlaying.appendChild(card);

                }

            }

        }


        // ========================================
        // RECENTLY PLAYED = 3 sesi setelah yang currently
        // ========================================

        if (recentlyPlayed) {

            const recentSessions = sessions.slice(1, 4);

            if (recentSessions.length === 0) {
                recentlyPlayed.innerHTML = `<p class="coming-soon">Belum ada riwayat sebelumnya.</p>`;
            }

            recentSessions.forEach((session) => {

                const game = libraryMap[session.gameRef];
                if (!game) return;

                const card = document.createElement("a");
                card.className = "other-game-card";
                card.href = game.link || "#";
                card.target = "_blank";
                card.rel = "noopener noreferrer";
                card.style.textDecoration = "none";
                card.style.color = "inherit";

                card.innerHTML = `
                    <div class="other-game-image">
                        <img src="${game.image}" alt="${game.name}">
                    </div>
                    <div class="other-game-info">
                        <h3>${game.name}</h3>
                        <p>Dimainkan pukul ${formatDate(session.startedAt)}</p>
                    </div>
                `;

                recentlyPlayed.appendChild(card);

            });

        }


        // ========================================
        // GAME LIBRARY = semua game, tanpa deskripsi
        // ========================================

        if (gameLibrary) {

            const allGames = Object.values(libraryMap);

            if (allGames.length === 0) {
                gameLibrary.innerHTML = `<p class="coming-soon">Belum ada game di library.</p>`;
            }

            allGames.forEach((game) => {

                const card = document.createElement("a");
                card.className = "library-game";
                card.href = game.link || "#";
                card.target = "_blank";
                card.rel = "noopener noreferrer";

                let idLine = "";
                if (game.nickname || game.gameId) {
                    idLine = `<p style="font-size:11px; color:var(--text-light); margin-top:2px;">`;
                    if (game.nickname) idLine += `${game.nickname}`;
                    if (game.nickname && game.gameId) idLine += ` &middot; `;
                    if (game.gameId) idLine += `${game.gameId}`;
                    idLine += `</p>`;
                }

                card.innerHTML = `
                    <img src="${game.image}" alt="${game.name}">
                    <p>${game.name}</p>
                    <p style="font-size:11px; color:var(--text-muted);">${game.category}</p>
                    ${idLine}
                `;

                gameLibrary.appendChild(card);

            });

        }

    } catch (error) {

        if (gameLibrary) {
            gameLibrary.innerHTML = `<p style="color:#e53e3e;">Gagal memuat game: ${error.message}</p>`;
        }

    }

}

loadGames();
