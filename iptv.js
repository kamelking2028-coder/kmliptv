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
function afficherChaines(code, data) {

    const channelsDiv = document.getElementById("channels");
    channelsDiv.innerHTML = "";

    data[code].forEach(ch => {

        const div = document.createElement("div");
        div.className = "channel";

        const img = document.createElement("img");
        img.className = "channel-logo";
        img.src = ch.logo;
        img.alt = ch.name;

        const titre = document.createElement("span");
        titre.textContent = ch.name;

        div.appendChild(img);
        div.appendChild(titre);

        div.addEventListener("click", () => {
            selectChannel(ch);
        });

        channelsDiv.appendChild(div);
    });
}



function selectChannel(ch) {

    if (Hls.isSupported()) {

        const hls = new Hls();

        hls.loadSource(ch.url);

        hls.attachMedia(video);

    } else {

        video.src = ch.url;

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
