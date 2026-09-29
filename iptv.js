/* ---------------------------------------------------------
   KML IPTV
   Bouquets + Chaînes + Lecteur HLS
--------------------------------------------------------- */
const bouquetListEl = document.getElementById("bouquet-list");
const channelListEl = document.getElementById("channel-list");
const currentChannelEl = document.getElementById("current-channel");
const videoEl = document.getElementById("video");

let hlsInstance = null;

const bouquets = [
{
    name: "Arabes",
    channels: [
        {
            name: "Al Jazeera Arabic",
            tag: "News",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/20/Aljazeera_logo.png",
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
           logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/France_24_logo.svg/512px-France_24_logo.svg.png"
          /*-- "logo": "https://upload.wikimedia.org/wikipedia/commons/8/8a/France24.png",*/ 
            url: "https://live.france24.com/hls/live/2037218/F24_FR_HI_HLS/master_5000.m3u8"
        }
    ]
}
];

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
        });

        bouquetListEl.appendChild(li);

        if (index === 0) {
            li.classList.add("active");
            renderChannels(bouquet.channels);
        }
    });
}

function renderChannels(channels) {

    channelListEl.innerHTML = "";

    channels.forEach(channel => {

        const li = document.createElement("li");

        li.innerHTML = `
            <div class="channel-item">
                ${channel.logoUrl}
                <div class="channel-info">
                    <div class="channel-name">${channel.name}</div>
                    <div class="channel-tag">${channel.tag}</div>
                </div>
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

function selectChannel(channel) {

    currentChannelEl.textContent = channel.name;

    if (hlsInstance) {
        hlsInstance.destroy();
    }

    if (Hls.isSupported()) {

        hlsInstance = new Hls();

        hlsInstance.loadSource(channel.url);
        hlsInstance.attachMedia(videoEl);

        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            videoEl.play();
        });

    } else {

        videoEl.src = channel.url;
        videoEl.play();
    }
}

renderBouquets();
