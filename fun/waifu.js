const waifuData = [

    {
        name: "omgari-hare",
        source: "Blue Archive",
        image: "../assets/waifu/omagari-hare.png"
    },

    {
        name: "Sanhua",
        source: "Wuthering Waves",
        image: "../assets/waifu/sanhua.jpg"
    },

    {
        name: "Evelyn",
        source: "Zenless Zone Zero",
        image: "../assets/waifu/evelyn.jpg"
    },

    {
        name: "Character Name 4",
        source: "Anime / Game / Manhwa",
        image: "../assets/waifu/placeholder.jpg"
    }

];


const waifuGallery = document.querySelector(".waifu-gallery");


waifuData.forEach(function (waifu) {

    const card = document.createElement("article");

    card.className = "waifu-card";

    card.innerHTML = `

        <div class="waifu-image">

            <img
                src="${waifu.image}"
                alt="${waifu.name}"
            >

        </div>


        <div class="waifu-info">

            <h3>
                ${waifu.name}
            </h3>

            <p>
                From: ${waifu.source}
            </p>

        </div>

    `;


    waifuGallery.appendChild(card);

});