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
            logo: "logos/AL Jazeera.png",
            /*logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/20/Aljazeera_logo.png",*/
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
            logo: "logos/AL Jazeera.png",
            /*logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/France_24_logo.svg/512px-France_24_logo.svg.png",*/
            url: "https://static.france24.com/live/F24_FR_LO_HLS/live_web.m3u8"
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
                <img class="channel-logo"
                     src="${ch.logo}"
                     ss="channel-name">${ch.name}</div>
                <div class="channel-tag">${ch.tag || ""}</div>
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
function parseM3U(content) {

  channels = [];

  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {

    if (lines[i].startsWith("#EXTINF")) {

      const info = lines[i];

      const url = lines[i + 1]?.trim();

      const name = info.split(",").pop();

      const logoMatch = info.match(/tvg-logo="([^"]+)"/);

      const logo = logoMatch ? logoMatch[1] : "";

      channels.push({
        name,
        url,
        logo
      });
    }
  }

 /* displayChannels();*/
}
renderBouquets();
