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

                url: "https://live-hls-web-aja.getaj.net/AJA/index.m3u8"
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

        const name = document.createElement("span");
        name.classList.add("channel-name");
        name.textContent = channel.name;

        const tag = document.createElement("small");
        tag.classList.add("channel-tag");
        tag.textContent = channel.tag || "";

        information.appendChild(name);

        if (channel.tag) {
            information.appendChild(tag);
        }

        channelItem.appendChild(logo);
        channelItem.appendChild(information);
        li.appendChild(channelItem);

        li.addEventListener("click", () => {
            document
                .querySelectorAll("#channel-list li")
                .forEach((item) => item.classList.remove("active"));

            li.classList.add("active");

            selectChannel(channel);
        });

        channelListEl.appendChild(li);
    });
}

/* ---------------------------------------------------------
   Sélection d'une chaîne
--------------------------------------------------------- */

function selectChannel(channel) {
    if (!channel || !channel.url) {
        console.error("Chaîne ou URL invalide.");
        return;
    }

    if (currentChannelEl) {
        currentChannelEl.textContent = channel.name;
    }

    playStream(channel.url);
}

/* ---------------------------------------------------------
   Lecture du flux HLS
--------------------------------------------------------- */

function playStream(url) {
    if (!url || !videoEl) return;

    if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
    }

    videoEl.pause();
    videoEl.removeAttribute("src");
    videoEl.load();

    if (typeof Hls !== "undefined" && Hls.isSupported()) {
        hlsInstance = new Hls();

        hlsInstance.loadSource(url);
        hlsInstance.attachMedia(videoEl);

        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            videoEl.play().catch((error) => {
                console.warn("Lecture automatique bloquée :", error);
            });
        });

        hlsInstance.on(Hls.Events.ERROR, (event, data) => {
            console.error("Erreur HLS :", data);

            if (!data.fatal) return;

            switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                    hlsInstance.startLoad();
                    break;

                case Hls.ErrorTypes.MEDIA_ERROR:
                    hlsInstance.recoverMediaError();
                    break;

                default:
                    hlsInstance.destroy();
                    hlsInstance = null;
                    break;
            }
        });
    } else if (videoEl.canPlayType("application/vnd.apple.mpegurl")) {
        videoEl.src = url;

        videoEl.addEventListener(
            "loadedmetadata",
            () => {
                videoEl.play().catch((error) => {
                    console.warn("Lecture automatique bloquée :", error);
                });
            },
            { once: true }
        );
    } else {
        alert("La lecture HLS n'est pas prise en charge par ce navigateur.");
    }
}

/* ---------------------------------------------------------
   Lecteur manuel par URL
--------------------------------------------------------- */

if (playBtn) {
    playBtn.addEventListener("click", () => {
        const input = document.getElementById("iptvUrl");

        if (!input) return;

        const url = input.value.trim();

        if (!url) {
            alert("Veuillez saisir une URL IPTV.");
            return;
        }

        if (currentChannelEl) {
            currentChannelEl.textContent = "Chaîne personnalisée";
        }

        playStream(url);
    });
}

/* ---------------------------------------------------------
   Initialisation
--------------------------------------------------------- */

function initializeApp() {
    renderBouquets();

    const firstBouquetKey = Object.keys(data)[0];

    if (!firstBouquetKey) return;

    const firstBouquetElement = document.querySelector(
        `#bouquet-list li[data-bouquet="${firstBouquetKey}"]`
    );

    if (firstBouquetElement) {
        firstBouquetElement.classList.add("active");
    }

    selectBouquet(firstBouquetKey);

    const firstChannel = data[firstBouquetKey]?.channels?.[0];

    if (firstChannel) {
        selectChannel(firstChannel);

        const firstChannelElement =
            document.querySelector("#channel-list li");

        if (firstChannelElement) {
            firstChannelElement.classList.add("active");
        }
    }
}

initializeApp();
