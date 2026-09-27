
/* ---------------------------------------------------------
   KML IPTV — Import M3U + Bouquets + Player HLS.js
   --------------------------------------------------------- */

// Elements HTML
const bouquetListEl   = document.getElementById('bouquet-list');
const channelListEl   = document.getElementById('channel-list');
const currentChannelEl = document.getElementById('current-channel');
const videoEl         = document.getElementById('video');

let bouquets = {};       // Bouquets générés automatiquement
let hlsInstance = null;  // Player HLS.js
let currentBouquet = null;

/* ---------------------------------------------------------
   1. Importer un fichier M3U (URL)
   --------------------------------------------------------- */
async function importM3UfromURL(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    parseM3U(text);
  } catch (err) {
    alert("Impossible de charger le fichier M3U.");
  }
}

/* ---------------------------------------------------------
   2. Importer un fichier M3U (fichier local)
   --------------------------------------------------------- */
function importM3UfromFile(file) {
  const reader = new FileReader();
  reader.onload = () => parseM3U(reader.result);
  reader.readAsText(file);
}

/* ---------------------------------------------------------
   3. Parser le M3U
   --------------------------------------------------------- */
function parseM3U(text) {
  const lines = text.split("\n");
  const channels = [];
  let current = {};

  lines.forEach(line => {

    // Ligne EXTINF
    if (line.startsWith("#EXTINF")) {

      const name = line.split(",")[1]?.trim() || "Sans nom";

      const groupMatch = line.match(/group-title="(.*?)"/);
      const group = groupMatch ? groupMatch[1] : "Autres";

      const logoMatch = line.match(/tvg-logo="(.*?)"/);
      const logo = logoMatch ? logoMatch[1] : "";

      current = { name, group, logo };
    }

    // Ligne URL
    else if (line.startsWith("http")) {
      current.url = line.trim();
      channels.push(current);
    }

  });

  generateBouquets(channels);
}

/* ---------------------------------------------------------
   4. Générer les bouquets automatiquement
   --------------------------------------------------------- */
function generateBouquets(channels) {
  bouquets = {};

  channels.forEach(ch => {
    if (!bouquets[ch.group]) bouquets[ch.group] = [];
    bouquets[ch.group].push(ch);
  });

  renderBouquets();
}

/* ---------------------------------------------------------
   5. Afficher les bouquets
   --------------------------------------------------------- */
function renderBouquets() {
  bouquetListEl.innerHTML = "";

  Object.keys(bouquets).forEach(group => {
    const li = document.createElement("li");
    li.textContent = group;
    li.dataset.group = group;

    li.addEventListener("click", () => selectBouquet(group));

    bouquetListEl.appendChild(li);
  });
}

/* ---------------------------------------------------------
   6. Sélection d’un bouquet
   --------------------------------------------------------- */
function selectBouquet(group) {
  currentBouquet = group;

  document.querySelectorAll("#bouquet-list li").forEach(li => {
    li.classList.toggle("active", li.dataset.group === group);
  });

  renderChannels(bouquets[group]);
}

/* ---------------------------------------------------------
   7. Afficher les chaînes
   --------------------------------------------------------- */
function renderChannels(channels) {
  channelListEl.innerHTML = "";

  channels.forEach((ch, index) => {
    const li = document.createElement("li");
    li.dataset.index = index;

    const nameSpan = document.createElement("span");
    nameSpan.className = "channel-name";
    nameSpan.textContent = ch.name;

    const tagSpan = document.createElement("span");
    tagSpan.className = "channel-tag";
    tagSpan.textContent = ch.group;

    li.appendChild(nameSpan);
    li.appendChild(tagSpan);

    li.addEventListener("click", () => selectChannel(index));

    channelListEl.appendChild(li);
  });
}

/* ---------------------------------------------------------
   8. Sélection d’une chaîne
   --------------------------------------------------------- */
function selectChannel(index) {
  const channel = bouquets[currentBouquet][index];

  currentChannelEl.textContent = channel.name;

  document.querySelectorAll("#channel-list li").forEach(li => {
    li.classList.toggle("active", parseInt(li.dataset.index) === index);
  });

  playStream(channel.url);
}

/* ---------------------------------------------------------
   9. Lecture du flux HLS/m3u8
   --------------------------------------------------------- */
function playStream(url) {
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }

  if (Hls.isSupported()) {
    hlsInstance = new Hls();
    hlsInstance.loadSource(url);
    hlsInstance.attachMedia(videoEl);
    hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
      videoEl.play();
    });
  } else {
    videoEl.src = url;
    videoEl.play();
  }
}

/* ---------------------------------------------------------
   10. Bouton pour lire une URL simple (ton ancien lecteur)
   --------------------------------------------------------- */
document.getElementById("playBtn").addEventListener("click", () => {
  const url = document.getElementById("iptvUrl").value.trim();
  if (url) playStream(url);
});
