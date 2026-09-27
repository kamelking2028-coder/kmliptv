/* ---------------------------------------------------------
   KML IPTV
   Bouquets + Chaînes + Lecteur HLS
--------------------------------------------------------- */

const bouquetListEl = document.getElementById("bouquet-list");
const channelListEl = document.getElementById("channel-list");
const currentChannelEl = document.getElementById("current-channel");
const videoEl = document.getElementById("video");

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
                url: "https://live-hls-web-aja.getaj.net/AJA/index.m3u8"
            }
        ]
    }
};

/* ---------------------------------------------------------
   Affichage des bouquets
--------------------------------------------------------- */

function renderBouquets() {

    bouquetListEl.innerHTML = "";

    Object.keys(data).forEach(key => {

        const li = document.createElement("li");

        li.textContent = data[key].label;

        li.addEventListener("click", () => {

            document
                .querySelectorAll("#bouquet-list li")
                .forEach(item => item.classList.remove("active"));

            li.classList.add("active");

            selectBouquet(key);
        });

        bouquetListEl.appendChild(li);

    });

}

/* ---------------------------------------------------------
   Sélection bouquet
--------------------------------------------------------- */

function selectBouquet(key) {

    const bouquet = data[key];

    if (!bouquet) return;

    renderChannels(bouquet.channels);

}

/* ---------------------------------------------------------
   Affichage chaînes
--------------------------------------------------------- */

function renderChannels(channels) {

    channelListEl.innerHTML = "";

    channels.forEach(channel => {

        const li = document.createElement("li");

        li.innerHTML = `
            <div class="channel-item">
                ${channel.logo}
                <span>${channel.name}</span>
            </div>
        `;

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
   Sélection chaîne
--------------------------------------------------------- */

function selectChannel(channel) {

    currentChannelEl.textContent = channel.name;

    playStream(channel.url);

}

/* ---------------------------------------------------------
   Lecture HLS
--------------------------------------------------------- */

function playStream(url) {

    if (!url) return;

    if (hlsInstance) {

        hlsInstance.destroy();
        hlsInstance = null;

    }

    if (Hls.isSupported()) {

        hlsInstance = new Hls();

        hlsInstance.loadSource(url);

        hlsInstance.attachMedia(videoEl);

        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            videoEl.play().catch(() => {});
        });

    }
    else if (
        videoEl.canPlayType("application/vnd.apple.mpegurl")
    ) {

        videoEl.src = url;

        videoEl.addEventListener(
            "loadedmetadata",
            () => {
                videoEl.play().catch(() => {});
            },
            { once: true }
        );

    }
    else {

        alert("HLS non supporté sur ce navigateur.");

    }

}

/* ---------------------------------------------------------
   Player manuel URL
--------------------------------------------------------- */

const playBtn = document.getElementById("playBtn");

if (playBtn) {

    playBtn.addEventListener("click", () => {

        const input = document.getElementById("iptvUrl");

        if (!input) return;

        const url = input.value.trim();

        if (url) {

            currentChannelEl.textContent = "Chaîne personnalisée";

            playStream(url);

        }

    });

}

/* ---------------------------------------------------------
   Initialisation
--------------------------------------------------------- */

renderBouquets();

const firstBouquet = Object.keys(data)[0];

if (firstBouquet) {

    selectBouquet(firstBouquet);

    const firstChannel =
        data[firstBouquet].channels[0];

    if (firstChannel) {

        selectChannel(firstChannel);

    }

}
