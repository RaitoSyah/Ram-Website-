const music = [

    {
        title: "Cya Later",
        artist: "Loveli Lori",
        image: "../assets/music/cya-later.png",
        link: "https://open.spotify.com/track/20iW93q4nGXbLsJQsMXS23",
        status: "liked"
    },

    {
        title: "Love For You",
        artist: "Loveli Lori",
        image: "../assets/music/love-for-you.jpeg",
        link: "https://open.spotify.com/track/2DkKddV2e952EAteyuV0wP",
        status: "liked"
    },

    {
        title: "Strategy Remix",
        artist: "TWICE · Zachz Winner",
        image: "../assets/music/strategy-remix.jpeg",
        link: "https://youtu.be/5jdxHcXwEgM",
        status: "liked"
    },

    {
        title: "Astaga Bercanda",
        artist: "Akbar Chalay",
        image: "../assets/music/astaga-bercanda.jpeg",
        link: "https://open.spotify.com/track/03fkIoNyruY4N2Pa5CqTvv",
        status: "liked"
    },

    {
        title: "Not In Love",
        artist: "Loveli Lori",
        image: "../assets/music/not-in-love.jpeg",
        link: "https://open.spotify.com/track/0FGxXZICMxT7x9S4Dm0Evl",
        status: "liked"
    },

    {
        title: 'ABC 5 DASAR From "Indo Camp"',
        artist: "Shinji Sho, Krindon & Raven",
        image: "../assets/music/abc-5-dasar.jpeg",
        link: "https://open.spotify.com/track/01cPJl6YS8qnaAK3cJLDsi",
        status: "liked"
    },

    {
        title: "About You",
        artist: "The 1975",
        image: "../assets/music/about-you.jpeg",
        link: "https://open.spotify.com/track/3hEfpBHxgieRLz4t3kLNEg",
        status: "liked"
    }

];


// ========================================
// CURRENTLY LISTENING
// ========================================

const currentMusic = {

    title: "Thank u, next",
    artist: "Ariana Grande",
    image: "../assets/music/thank u next.jpg",
    description:
        "Lagu yang lagi sering aku dengarkan belakangan ini.",
    link: "https://open.spotify.com/"

};


const currentContainer =
    document.getElementById("currently-listening");


if (currentContainer) {

    currentContainer.innerHTML = `

        <a
            class="currently-playing"
            href="${currentMusic.link}"
            target="_blank"
            rel="noopener noreferrer"
        >

            <img
                src="${currentMusic.image}"
                alt="${currentMusic.title}"
            >

            <div class="currently-info">

                <p class="writing-category">
                    CURRENTLY PLAYING
                </p>

                <h3>
                    ${currentMusic.title}
                </h3>

                <p>
                    ${currentMusic.artist}
                </p>

                <p>
                    ${currentMusic.description}
                </p>

            </div>

        </a>

    `;

}


// ========================================
// MUSIC LIBRARY
// ========================================

const musicLibrary =
    document.getElementById("music-library");


if (musicLibrary) {

    music.forEach(song => {

        const item = document.createElement("a");

        item.className = "music-item";

        item.href = song.link;

        item.target = "_blank";

        item.rel = "noopener noreferrer";

        item.innerHTML = `

            <img
                src="${song.image}"
                alt="${song.title}"
            >

            <div class="music-info">

                <h3>
                    ${song.title}
                </h3>

                <p>
                    ${song.artist}
                </p>

            </div>

        `;

        musicLibrary.appendChild(item);

    });

}