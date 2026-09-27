// app.js

// Données de base : bouquets + chaînes + URLs HLS
const data = {
  francais: {
    label: "Français",
    channels: [
      { name: "France 24", tag: "News", url: "https://static.france24.com/live/F24_FR_HLS/live_web.m3u8" },
      { name: "TV5 Monde Info", tag: "News", url: "https://example.com/tv5.m3u8" }
    ]
  },
  arabes: {
    label: "Arabes",
    channels: [
      { name: "Al Jazeera", tag: "News", url: "https://example.com/aljazeera.m3u8" }
    ]
  },
  usa: {
    label: "USA",
    channels: [
      { name: "Red Bull TV", tag: "Sport", url: "https://rbmn-live.akamaized.net/hls/live/590964/RedBullTV/master.m3u8" }
    ]
  }
};

const bouquetListEl   = document.getElementById('bouquet-list');
const channelListEl   = document.getElementById('channel-list');
const currentBouquetEl = document.getElementById('current-bouquet');
const currentChannelEl = document.getElementById('current-channel');
const videoEl         = document.getElementById('video');

let currentBouquetKey = null;
let hlsInstance       = null;

// Initialisation : afficher les bouquets
function renderBouquets() {
  bouquetListEl.innerHTML = '';
  Object.keys(data).forEach(key => {
    const li = document.createElement('li');
    li.textContent = data[key].label;
    li.dataset.key = key;
    li.addEventListener('click', () => selectBouquet(key));
    bouquetListEl.appendChild(li);
  });
}

// Sélection d’un bouquet
function selectBouquet(key) {
  currentBouquetKey = key;
  currentBouquetEl.textContent = data[key].label;

  // Active visuelle
  document.querySelectorAll('#bouquet-list li').forEach(li => {
    li.classList.toggle('active', li.dataset.key === key);
  });

  renderChannels(data[key].channels);
}

// Afficher les chaînes du bouquet
function renderChannels(channels) {
  channelListEl.innerHTML = '';
  channels.forEach((ch, index) => {
    const li = document.createElement('li');
    li.dataset.index = index;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'channel-name';
    nameSpan.textContent = ch.name;

    const tagSpan = document.createElement('span');
    tagSpan.className = 'channel-tag';
    tagSpan.textContent = ch.tag;

    li.appendChild(nameSpan);
    li.appendChild(tagSpan);

    li.addEventListener('click', () => selectChannel(index));
    channelListEl.appendChild(li);
  });
}

// Sélection d’une chaîne
function selectChannel(index) {
  if (!currentBouquetKey) return;
  const channel = data[currentBouquetKey].channels[index];

  currentChannelEl.textContent = channel.name;

  // Active visuelle
  document.querySelectorAll('#channel-list li').forEach(li => {
    li.classList.toggle('active', parseInt(li.dataset.index, 10) === index);
  });

  playStream(channel.url);
}

// Lecture du flux HLS
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
  } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
    videoEl.src = url;
    videoEl.play();
  } else {
    alert("HLS non supporté sur ce navigateur.");
  }
}

// Lancer
renderBouquets();
// Optionnel : sélectionner un bouquet par défaut
// selectBouquet('francais');
