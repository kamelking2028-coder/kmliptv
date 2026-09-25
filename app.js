const input = document.getElementById("iptvUrl");
const btn = document.getElementById("playBtn");
const video = document.getElementById("player");

/*Lire un URL*/
btn.addEventListener("click", () => {
  const url = input.value.trim();
  if (!url) return alert("Entre une URL IPTV .m3u8");

  if (Hls.isSupported()) {     /*vérifie si ton navigateur sait lire les flux HLS*/
    const hls = new Hls();
    hls.loadSource(url);       /*telecharge la source*/
    hls.attachMedia(video);    /*relie le flux à la balise <video> dans le HTML.*/
  } else {
    video.src = url;
  }
});
