// ========================================
// FETCH GAMES DARI FIRESTORE
// ========================================

import { db } from "../firebase-config.js";

import {
    collection,
    query,
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";


async function loadGames() {

    const currentlyPlaying = document.getElementById("currently-playing");
    const recentlyPlayed = document.getElementById("recently-played");
    const gameLibrary = document.getElementById("game-library");

    try {

        const q = query(
            collection(db, "games"),
            orderBy("lastPlayed", "desc")
        );

        const snapshot = await getDocs(q);
        const games = snapshot.docs.map(doc => doc.data());


        // ========================================
        // CURRENTLY PLAYING
        // ========================================

        if (currentlyPlaying) {

            const activeGames = games.filter(
                game => game.status === "currently"
            );

            if (activeGames.length === 0) {
                currentlyPlaying.innerHTML = `<p class="coming-soon">Belum ada yang lagi dimainkan.</p>`;
            }

            activeGames.forEach(game => {

                const card = document.createElement("a");
                card.className = "game-card";
                card.href = game.link || "#";
                card.target = "_blank";
                card.rel = "noopener noreferrer";
                card.style.textDecoration = "none";
                card.style.color = "inherit";

                let mabarInfo = "";
                if (game.nickname || game.gameId) {
                    mabarInfo = `<p style="margin-top:8px; font-size:13px; color:var(--text-muted);">`;
                    if (game.nickname) mabarInfo += `IGN: <strong>${game.nickname}</strong>`;
                    if (game.nickname && game.gameId) mabarInfo += ` &middot; `;
                    if (game.gameId) mabarInfo += `ID: <strong>${game.gameId}</strong>`;
                    mabarInfo += `</p>`;
                }

                card.innerHTML = `
                    <div class="game-image">
                        <img src="${game.image}" alt="${game.name}">
                    </div>
                    <div class="game-info">
                        <p class="writing-category">${game.category}</p>
                        <h3>${game.name}</h3>
                        <p>${game.description}</p>
                        <p class="game-status">${game.statusText || "🟢 Currently Playing"}</p>
                        ${mabarInfo}
                    </div>
                `;

                currentlyPlaying.appendChild(card);

            });

        }


        // ========================================
        // RECENTLY PLAYED
        // ========================================

        if (recentlyPlayed) {

            const recentGames = games
                .filter(game => game.status !== "currently")
                .sort((a, b) => new Date(b.lastPlayed) - new Date(a.lastPlayed))
                .slice(0, 3);

            recentGames.forEach(game => {

                const card = document.createElement("a");
                card.className = "other-game-card";
                card.href = game.link || "#";
                card.target = "_blank";
                card.rel = "noopener noreferrer";
                card.style.textDecoration = "none";
                card.style.color = "inherit";

                const date = new Date(game.lastPlayed);
                const formattedDate = date.toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric"
                });

                card.innerHTML = `
                    <div class="other-game-image">
                        <img src="${game.image}" alt="${game.name}">
                    </div>
                    <div class="other-game-info">
                        <h3>${game.name}</h3>
                        <p>Last played: ${formattedDate}</p>
                    </div>
                `;

                recentlyPlayed.appendChild(card);

            });

        }


        // ========================================
        // GAME LIBRARY
        // ========================================

        if (gameLibrary) {

            games.forEach(game => {

                const gameCard = document.createElement("a");
                gameCard.className = "library-game";
                gameCard.href = game.link;
                gameCard.target = "_blank";
                gameCard.rel = "noopener noreferrer";

                gameCard.innerHTML = `
                    <img src="${game.image}" alt="${game.name}">
                    <p>${game.name}</p>
                `;

                gameLibrary.appendChild(gameCard);

            });

        }

    } catch (error) {

        if (gameLibrary) {
            gameLibrary.innerHTML = `<p style="color:#e53e3e;">Gagal memuat game: ${error.message}</p>`;
        }

    }

}

loadGames();
