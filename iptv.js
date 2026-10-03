/* ==========================
   KML IPTV
========================== */

const bouquetListEl = document.getElementById("bouquet-list");
const channelListEl = document.getElementById("channel-list");
const currentChannelEl = document.getElementById("current-channel");
const videoEl = document.getElementById("video");

const m3uFile = document.getElementById("m3uFile");

const btnBouquets = document.getElementById("btnBouquets");
const btnCanaux = document.getElementById("btnCanaux");
const searchInput = document.getElementById("searchInput");

let hlsInstance = null;
let importedChannels = [];
let bouquetsM3U = {};


/* ==========================
   PLAYER
========================== */

function selectChannel(channel) {

    if (!channel) return;

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

/* ==========================
   AFFICHAGE CHAINES
========================== */

function renderChannels(channels) {

    channelListEl.innerHTML = "";

    channels.forEach(channel => {

        const li = document.createElement("li");

        const div = document.createElement("div");
        div.className = "channel-item";

        const img = document.createElement("img");
        img.className = "channel-logo";
        img.src = channel.logo || "logos/default.png";
        img.alt = channel.name;

        img.onerror = () => {
            img.src = "logos/default.png";
        };

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
                .forEach(item =>
                    item.classList.remove("active")
                );

            li.classList.add("active");

            selectChannel(channel);

        });

        channelListEl.appendChild(li);

    });
}

/* ==========================
   CREATION DES BOUQUETS
========================== */

function buildBouquetsFromM3U() {

    bouquetListEl.innerHTML = "";

    Object.keys(bouquetsM3U)
        .sort()
        .forEach(country => {

            const li = document.createElement("li");

            li.textContent =
                `${country} (${bouquetsM3U[country].length})`;

            li.addEventListener("click", () => {

                renderChannels(
                    bouquetsM3U[country]
                );

            });

            bouquetListEl.appendChild(li);

        });

    const firstCountry =
        Object.keys(bouquetsM3U)[0];

    if (firstCountry) {

        renderChannels(
            bouquetsM3U[firstCountry]
        );

        selectChannel(
            bouquetsM3U[firstCountry][0]
        );
    }
}

/* ==========================
   PARSEUR M3U
========================== */

function parseM3U(content) {

    importedChannels = [];
    bouquetsM3U = {};

    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {

        const line = lines[i].trim();

        if (!line.startsWith("#EXTINF"))
            continue;

        const url = lines[i + 1]?.trim();

        if (!url || !url.startsWith("http"))
            continue;

        const name =
            line.split(",").pop()?.trim()
            || "Chaîne inconnue";

        const logoMatch =
            line.match(/tvg-logo="([^"]+)"/);

        const groupMatch =
            line.match(/group-title="([^"]+)"/);

        const idMatch =
            line.match(/tvg-id="([^"]+)"/);

        const logo =
            logoMatch?.[1] ||
            "logos/default.png";

        const group =
            groupMatch?.[1] ||
            "Divers";

        const tvgId =
            idMatch?.[1] ||
            "";

        let country = "AUTRES";

        if (tvgId.includes(".")) {

            country =
                tvgId
                .split(".")
                .pop()
                .toUpperCase();
        }

        const channel = {

            name,
            logo,
            url,
            tag: group,
            country

        };

        importedChannels.push(channel);

        if (!bouquetsM3U[country]) {

            bouquetsM3U[country] = [];

        }

        bouquetsM3U[country].push(channel);
    }

    buildBouquetsFromM3U();
}

/* ==========================
   IMPORT M3U
========================== */

if (m3uFile) {

    m3uFile.addEventListener("change", e => {

        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = evt => {

            parseM3U(evt.target.result);

        };

        reader.readAsText(file);

    });
}

/* ==========================
   BOUTON BOUQUETS
========================== */

if (btnBouquets) {

    btnBouquets.addEventListener("click", () => {

        bouquetListEl.classList.toggle("hidden");

    });

}

/* ==========================
   BOUTON CANAUX
========================== */

if (btnCanaux) {

    btnCanaux.addEventListener("click", () => {

        renderChannels(importedChannels);

    });

}

/* ==========================
   RECHERCHE
========================== */

if (searchInput) {

    searchInput.addEventListener("input", () => {

        const txt =
            searchInput.value.toLowerCase();

        const result =
            importedChannels.filter(ch =>

                ch.name
                    .toLowerCase()
                    .includes(txt)

                ||

                ch.tag
                    .toLowerCase()
                    .includes(txt)

            );

        renderChannels(result);

    });

}
