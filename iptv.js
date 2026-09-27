
/* ---------------------------------------------------------
   KML IPTV — Import M3U + Bouquets + Player HLS.js
   --------------------------------------------------------- */


/* TEST IPTV COMPLET */

const bouquetListEl   = document.getElementById('bouquet-list');
const channelListEl   = document.getElementById('channel-list');
const currentChannelEl = document.getElementById('current-channel');
const videoEl         = document.getElementById('video');

let hlsInstance = null;

/* --- Données de test --- */
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

/* --- Afficher les bouquets --- */
function renderBouquets() {
  bouquetListEl.innerHTML = "";

  Object.keys(data).forEach(key => {
    const li = document.createElement("li");
    li.textContent = data[key].label;
    li.dataset.key = key;

    li.addEventListener("click", () => selectBouquet(key));

    bouquetListEl.appendChild(li);
  });
}

/* --- Sélection d’un bouquet --- */
function selectBouquet(key) {
  const channels = data[key].channels;
  renderChannels(channels);
}

/* --- Afficher les chaînes --- */
function renderChannels(channels) {
  channelListEl.innerHTML = "";

  channels.forEach((ch, index) => {
    const li = document.createElement("li");
    li.dataset.index = index;

    li.innerHTML = `
      <img src="${ch.logo}" class="channel-logo">
      <span>${ch.name}</span>
    `;

    li.addEventListener("click", () => selectChannel(ch));

    channelListEl.appendChild(li);
  });
}

/* --- Sélection d’une chaîne --- */
function selectChannel(channel) {
  currentChannelEl.textContent = channel.name;
  playStream(channel.url);
}

/* --- Lecture du flux --- */
function playStream(url) {
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }

  if (Hls.isSupported()) {
    hlsInstance = new Hls();
    hlsInstance.loadSource(url);
    hlsInstance.attachMedia(videoEl);
  } else {
    videoEl.src = url;
  }
}

/* --- Lancer le test --- */
renderBouquets();



/* ---------------------------------------------------------
   10. Bouton pour lire une URL simple (ton ancien lecteur)
   --------------------------------------------------------- */
document.getElementById("playBtn").addEventListener("click", () => {
  const url = document.getElementById("iptvUrl").value.trim();
  if (url) playStream(url);
});
