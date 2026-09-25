
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
function displayChannels() {
  const list = document.getElementById("channelList");
  list.innerHTML = "";
/* Affiche la liste des chaines*/
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
function playChannel(url) {
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
  } else {
    video.src = url;
  }
}


/*Lire un URL*/
btn.addEventListener("click", () => {
  const url = input.value.trim();
  if (!url) return alert("Entre une URL IPTV .m3u8");
  playChannel(url);
});

  if (Hls.isSupported()) {     /*vérifie si ton navigateur sait lire les flux HLS*/
    const hls = new Hls();
    hls.loadSource(url);       /*telecharge la source*/
    hls.attachMedia(video);    /*relie le flux à la balise <video> dans le HTML.*/
  } else {
    video.src = url;
  }
});
