
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
data.arabes = {
  label: "Arabes",
  channels: [

    // --- AL JAZEERA ---
    {
      name: "Al Jazeera Arabic",
      tag: "News",
      url: "https://live-hls-web-aja.getaj.net/AJA/index.m3u8"
    },
    {
      name: "Al Jazeera English",
      tag: "News",
      url: "https://live-hls-web-ajd.getaj.net/AJD/index.m3u8"
    },
    {
      name: "Al Jazeera Mubasher",
      tag: "Live",
      url: "https://live-hls-web-ajm.getaj.net/AJM/index.m3u8"
    },

    // --- AL ARABIYA ---
    {
      name: "Al Arabiya",
      tag: "News",
      url: "https://live.alarabiya.net/alarabiya/alarabiya.m3u8"
    },

    // --- SKY NEWS ARABIA ---
    {
      name: "Sky News Arabia",
      tag: "News",
      url: "https://stream.skynewsarabia.com/hls/sna_720.m3u8"
    },

    // --- ASHARQ NEWS ---
    {
      name: "Asharq News",
      tag: "News",
      url: "https://asharqtv-live.akamaized.net/hls/live/2034712/asharqtv/master.m3u8"
    },

    // --- AL MAYADEEN ---
    {
      name: "Al Mayadeen",
      tag: "News",
      url: "https://mdnlive-lh.akamaihd.net/i/mdnlive_1@320275/master.m3u8"
    },

    // --- DW ARABIA ---
    {
      name: "DW Arabia",
      tag: "News",
      url: "https://dwstream3-lh.akamaihd.net/i/dwstream3_live@124409/master.m3u8"
    },

    // --- FRANCE 24 ARABIC ---
    {
      name: "France 24 Arabic",
      tag: "News",
      url: "https://static.france24.com/live/F24_AR_HLS/live_web.m3u8"
    },

    // --- BBC ARABIC ---
    {
      name: "BBC Arabic",
      tag: "News",
      url: "https://vs-hls-ww.live.cf.md.bbci.co.uk/pool_6/live/ww/bbc_arabic/bbc_arabic.isml/bbc_arabic.m3u8"
    },

    // --- TRT ARABIC ---
    {
      name: "TRT Arabic",
      tag: "News",
      url: "https://tv-trtarabi.live.trt.com.tr/master.m3u8"
    },

    // --- AL HIWAR ---
    {
      name: "Al Hiwar",
      tag: "Talk",
      url: "https://mn-nl.mncdn.com/alhiwar_live/smil:alhiwar_live.smil/master.m3u8"
    },

    // --- SAUDI TV ---
    {
      name: "Saudi TV",
      tag: "National",
      url: "https://edge-1192-ch-gv.filmon.com/live/1192.high.stream/playlist.m3u8"
    },

    // --- KUWAIT TV ---
    {
      name: "Kuwait TV",
      tag: "National",
      url: "https://kwmedia-live.akamaized.net/hls/live/2003124/KTV1/master.m3u8"
    },

    // --- BAHRAIN TV ---
    {
      name: "Bahrain TV",
      tag: "National",
      url: "https://5c7e3f27a8f9f.streamlock.net/live/smil:bahraintv.smil/master.m3u8"
    }

  ]
};



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
