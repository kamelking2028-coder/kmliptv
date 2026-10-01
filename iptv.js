/* ---------------------------------------------------------
   KML IPTV
   Bouquets + Chaînes + Lecteur HLS
--------------------------------------------------------- */

const bouquetListEl = document.getElementById("bouquet-list");
const channelListEl = document.getElementById("channel-list");
const currentChannelEl = document.getElementById("current-channel");
const videoEl = document.getElementById("video");
const m3uFile = document.getElementById("m3uFile");
const btnBouquets = document.getElementById("btnBouquets");
const btnCanaux = document.getElementById("btnCanaux");
const searchInput = document.getElementById("searchInput");
/* Bouton bouquet*/ 
btnBouquets.addEventListener("click", () => {

    if (bouquetListEl.style.display === "none") {
        bouquetListEl.style.display = "block";
    } else {
        bouquetListEl.style.display = "none";
    }

});


/*-- Bouton Canaux--*/
let hlsInstance = null;
let importedChannels = [];

btnBouquets.addEventListener("click", () => {

    if (bouquetListEl.style.display === "none") {
        bouquetListEl.style.display = "block";
    } else {
        bouquetListEl.style.display = "none";
    }

});

/* Bouton Recherche */ 
searchInput.addEventListener("input", () => {

    const texte = searchInput.value.toLowerCase();

    let resultat = [];

    bouquets.forEach(bouquet => {

        bouquet.channels.forEach(channel => {

            if (
                channel.name.toLowerCase().includes(texte) ||
                (channel.tag || "").toLowerCase().includes(texte)
            ) {
                resultat.push(channel);
            }

        });

    });

    renderChannels(resultat);

});


/* ---------------------------------------------------------
   BOUQUETS
--------------------------------------------------------- */
/*
const bouquets = [
{
    name: "Arabes",
    channels: [
        {
            name: "Al Jazeera Arabic",
            tag: "News",
            logo: "logos/AL Jazeera.png",
            url: "https://live-hls-web-aja.getaj.net/AJA/index.m3u8"
        }
    ]
},
{
    name: "Français",
    channels: [
        {
            name: "France 24 Français",
            tag: "News",
            logo: "logos/france24.png",
            url: "https://static.france24.com/live/F24_FR_LO_HLS/live_web.m3u8"
        }
    ]
}
];
/*
/* ---------------------------------------------------------
   LECTEUR
--------------------------------------------------------- */

function selectChannel(channel) {

    currentChannelEl.textContent = channel.name;

    if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
    }

    if (Hls.isSupported()) {

        hlsInstance = new Hls();

        hlsInstance.loadSource(channel.url);

        hlsInstance.attachMedia(videoEl);

    } else {

        videoEl.src = channel.url;
    }
}

/* ---------------------------------------------------------
   AFFICHAGE CHAINES
--------------------------------------------------------- */

function renderChannels(channels) {

    channelListEl.innerHTML = "";

    channels.forEach(channel => {

        const li = document.createElement("li");

        const div = document.createElement("div");
        div.className = "channel-item";

        const img = document.createElement("img");
        img.className = "channel-logo";
        img.src = channel.logo;
        img.alt = channel.name;

        const info = document.createElement("div");
        info.className = "channel-info";

        const name = document.createElement("div");
        name.className = "channel-name";
        name.textContent = channel.name;

        const tag = document.createElement("div");
        tag.className = "channel-tag";
        tag.textContent = channel.tag || "";

        info.appendChild(name);
        info.appendChild(tag);

        div.appendChild(img);
        div.appendChild(info);

        li.appendChild(div);

        li.addEventListener("click", () => {

            document
                .querySelectorAll("#channel-list li")
                .forEach(item => item.classList.remove("active"));

            li.classList.add("active");

            selectChannel(channel);

        });

        channelListEl.appendChild(li);
    });
}

/* ---------------------------------------------------------
   AFFICHAGE BOUQUETS
--------------------------------------------------------- */

function renderBouquets() {

    bouquetListEl.innerHTML = "";

    bouquets.forEach((bouquet, index) => {

        const li = document.createElement("li");

        li.textContent = bouquet.name;

        li.addEventListener("click", () => {

            document
                .querySelectorAll("#bouquet-list li")
                .forEach(item => item.classList.remove("active"));

            li.classList.add("active");

            renderChannels(bouquet.channels);

            if (bouquet.channels.length > 0) {
                selectChannel(bouquet.channels[0]);
            }
        });

        bouquetListEl.appendChild(li);

        if (index === 0) {

            li.classList.add("active");

            renderChannels(bouquet.channels);

            if (bouquet.channels.length > 0) {
                selectChannel(bouquet.channels[0]);
            }
        }
    });
}

/* ---------------------------------------------------------
   IMPORT M3U
--------------------------------------------------------- */

function parseM3U(content) {

    importedChannels = [];

    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {

        if (lines[i].startsWith("#EXTINF")) {

            const info = lines[i];

            const url = lines[i + 1]?.trim();

            const name = info.split(",").pop();

            const logoMatch = info.match(/tvg-logo="([^"]+)"/);

            const logo = logoMatch
                ? logoMatch[1]
                : "logos/default.png";

            importedChannels.push({
                name,
                tag: "M3U",
                logo,
                url
            });
        }
    }

    renderChannels(importedChannels);

    if (importedChannels.length > 0) {
        selectChannel(importedChannels[0]);
    }
}

/* ---------------------------------------------------------
   FICHIER M3U
--------------------------------------------------------- */

if (m3uFile) {

    m3uFile.addEventListener("change", event => {

        const file = event.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = e => {

            parseM3U(e.target.result);

        };

        reader.readAsText(file);
    });
}

/* ---------------------------------------------------------
   DEMARRAGE
--------------------------------------------------------- */

renderBouquets();
