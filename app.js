const input = document.getElementById("iptvUrl");
const btn = document.getElementById("playBtn");
const video = document.getElementById("video"); // player principal

/* Lire un URL collé dans le champ */
btn.addEventListener("click", () => {
  const url = input.value.trim();
  if (!url) return alert("Entre une URL IPTV .m3u8");
  playStream(url);
});

/* Player HLS.js */
function playStream(url) {
  if (window.hlsInstance) {
    window.hlsInstance.destroy();
  }

  if (Hls.isSupported()) {
    window.hlsInstance = new Hls();
    window.hlsInstance.loadSource(url);
    window.hlsInstance.attachMedia(video);
  } else {
    video.src = url;
  }
}
