const input = document.getElementById("iptvUrl");
const btn = document.getElementById("playBtn");
const video = document.getElementById("player");

const channels = [
  {
    name: "Al Jazeera English",
    url: "https://live-hls-web-aja.getaj.net/AJA/index.m3u8",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Aljazeera_eng.svg"
  },
  {
    name: "DW News",
    url: "https://dwstream3-lh.akamaihd.net/i/dwstream3_live@124409/master.m3u8",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0f/DW_Logo.svg"
  }
];

/* Affiche la liste des chaines */
function displayChannels() {
  const list = document.getElementById("channelList");
  list.innerHTML = "";

  channels.forEach(ch => {
    const div = document.createElement("div");
    div.className = "channel-item";

    div.innerHTML = `
      <img src="${ch.logo}" class="logo">
      <span>${ch.name}</span>
    `;

    div.addEventListener("click", () => playChannel(ch.url));
    list.appendChild(div);
  });
}

displayChannels();

/* Fonction qui lit un flux IPTV */
function playChannel(url) {
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
  } else {
    video.src = url;
  }
}

/* Lire un URL collé dans le champ */
btn.addEventListener("click", () => {
  const url = input.value.trim();
  if (!url) return alert("Entre une URL IPTV .m3u8");
  playChannel(url);
});

