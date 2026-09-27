/* ---------------------------------------------------------
   KML IPTV
   Bouquets + Chaînes + Lecteur HLS
--------------------------------------------------------- */

const bouquetListEl = document.getElementById("bouquet-list");
const channelListEl = document.getElementById("channel-list");
const currentChannelEl = document.getElementById("current-channel");
const videoEl = document.getElementById("video");
const playBtn = document.getElementById("playBtn");

let hlsInstance = null;

/* ---------------------------------------------------------
   Données IPTV
--------------------------------------------------------- */

const data = {
    arabes: {
        label: "Arabes",

        channels: [
            {
                name: "Al Jazeera Arabic",
                tag: "News",

                logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Aljazeera_logo.png",

                url  :"https://live-hls-web-aja.getaj.net/AJA/index.m3u8"
            }
        ]
    }
};

/* ---------------------------------------------------------
   Affichage des bouquets
--------------------------------------------------------- */

function renderBouquets() {
    if (!bouquetListEl) return;

    bouquetListEl.innerHTML = "";

    Object.keys(data).forEach((key) => {
        const bouquet = data[key];
        const li = document.createElement("li");

        li.textContent = bouquet.label;
        li.dataset.bouquet = key;

        li.addEventListener("click", () => {
            document
                .querySelectorAll("#bouquet-list li")
                .forEach((item) => item.classList.remove("active"));

            li.classList.add("active");

            selectBouquet(key);
        });

        bouquetListEl.appendChild(li);
    });
}

/* ---------------------------------------------------------
   Sélection d'un bouquet
--------------------------------------------------------- */

function selectBouquet(key) {
    const bouquet = data[key];

    if (!bouquet || !Array.isArray(bouquet.channels)) {
        console.error("Bouquet introuvable :", key);
        return;
    }

    renderChannels(bouquet.channels);
}

/* ---------------------------------------------------------
   Affichage des chaînes
--------------------------------------------------------- */

function renderChannels(channels) {
    if (!channelListEl) return;

    channelListEl.innerHTML = "";

    channels.forEach((channel) => {
        const li = document.createElement("li");

        li.classList.add("channel-list-item");

        const channelItem = document.createElement("div");
        channelItem.classList.add("channel-item");

        const logo = document.createElement("img");
        logo.classList.add("channel-logo");
        logo.src = channel.logo;
        logo.alt = `Logo ${channel.name}`;
        logo.loading = "lazy";

        logo.addEventListener("error", () => {
            logo.style.display = "none";
        });

        const information = document.createElement("div");
        information.classList.add("channel-info");

        const
