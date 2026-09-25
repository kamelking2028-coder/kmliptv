const input = document.getElementById("iptvUrl");
const btn = document.getElementById("playBtn");
const video = document.getElementById("player");

btn.addEventListener("click", () => {
  const url = input.value.trim();
  if (!url) return alert("Entre une URL IPTV .m3u8");

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
  } else {
    video.src = url;
  }
});
