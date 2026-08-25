const games = [

{
    name: "Minecraft",
    category: "SANDBOX · SURVIVAL",
    image: "../assets/games/minecraft.png",
    description:
        "A game I can play for hours building things, exploring, or doing absolutely nothing.",
    status: "currently",
    lastPlayed: "2026-08-01",
    statusText: "🟢 Currently Playing",
    link: "https://www.minecraft.net/"
},

{
    name: "Growtopia",
    category: "MMO · SANDBOX",
    image: "../assets/games/growtopia.jpg",
    description:
        "Trading, building, messing around, and collecting random stuff.",
    status: "inactive",
    lastPlayed: "2026-07-31",
    link: "https://www.growtopiagame.com/"
},

    {
        name: "Arena Breakout",
        category: "FPS · EXTRACTION",
        image: "../assets/games/arena breakout.png",
        description:
            "A tactical shooter that I played for a while.",
        status: "inactive",
        lastPlayed: "2026-07-28",
        link: "https://arenabreakout.com/"
    },

    {
        name: "Clash of Clans",
        category: "STRATEGY · SIMULATION",
        image: "../assets/games/clash of clans.jpeg",
        description:
            "Building a village, upgrading things, and occasionally attacking other people.",
        status: "inactive",
        lastPlayed: "2026-07-25",
        link: "https://supercell.com/en/games/clashofclans/"
    },

    {
        name: "Free Fire",
        category: "BATTLE ROYALE · SHOOTER",
        image: "../assets/games/free fire.jpg",
        description:
            "A battle royale game I've played before.",
        status: "inactive",
        lastPlayed: "2026-07-20",
        link: "https://ff.garena.com/"
    },

    {
        name: "Hay Day",
        category: "FARMING · SIMULATION",
        image: "../assets/games/Hay Day.webp",
        description:
            "A farming game that I played for a while.",
        status: "inactive",
        lastPlayed: "2026-07-15",
        link: "https://play.google.com/store/apps/details?id=com.supercell.hayday"
    },

    {
        name: "King Choice",
        category: "SIMULATION · RPG",
        image: "../assets/games/king choice.jpeg",
        description:
            "A game I have played before.",
        status: "inactive",
        lastPlayed: "2026-07-10",
        link: "https://play.google.com/store/apps/details?id=com.onemt.and.kc.sea"
    }

];


// ========================================
// CURRENTLY PLAYING
// ========================================

const currentlyPlaying = document.getElementById("currently-playing");

if (currentlyPlaying) {

    const activeGames = games.filter(
        game => game.status === "currently"
    );

    activeGames.forEach(game => {

        const card = document.createElement("article");

        card.className = "game-card";

        card.innerHTML = `

            <div class="game-image">

                <img
                    src="${game.image}"
                    alt="${game.name}"
                >

            </div>

            <div class="game-info">

                <p class="writing-category">
                    ${game.category}
                </p>

                <h3>
                    ${game.name}
                </h3>

                <p>
                    ${game.description}
                </p>

                <p class="game-status">
                    ${game.statusText}
                </p>

            </div>

        `;

        currentlyPlaying.appendChild(card);

    });

}


// ========================================
// RECENTLY PLAYED
// ========================================

const recentlyPlayed = document.getElementById("recently-played");

if (recentlyPlayed) {

    const recentGames = games
        .filter(game => game.status !== "currently")
        .sort(
            (a, b) =>
                new Date(b.lastPlayed) - new Date(a.lastPlayed)
        )
        .slice(0, 3);


recentGames.forEach(game => {

    const card = document.createElement("article");

    card.className = "other-game-card";

    const date = new Date(game.lastPlayed);

    const formattedDate = date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    card.innerHTML = `

        <div class="other-game-image">

            <img
                src="${game.image}"
                alt="${game.name}"
            >

        </div>

        <div class="other-game-info">

            <h3>
                ${game.name}
            </h3>

            <p>
                Last played: ${formattedDate}
            </p>

        </div>

    `;

    recentlyPlayed.appendChild(card);

});

}


// ========================================
// GAME LIBRARY
// ========================================

const gameLibrary = document.getElementById("game-library");

if (gameLibrary) {

    games.forEach(game => {

        const gameCard = document.createElement("a");

        gameCard.className = "library-game";

        gameCard.href = game.link;

        gameCard.target = "_blank";

        gameCard.rel = "noopener noreferrer";

        gameCard.innerHTML = `

            <img
                src="${game.image}"
                alt="${game.name}"
            >

            <p>
                ${game.name}
            </p>

        `;

        gameLibrary.appendChild(gameCard);

    });

}