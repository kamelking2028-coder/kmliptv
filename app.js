const input = document.getElementById("iptvUrl");
const btn = document.getElementById("playBtn");
const fileInput = document.getElementById("m3uFile");

let channels = [];

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(event) {
    parseM3U(event.target.result);
  };

  reader.readAsText(file);
});
if (btn) {

    btn.addEventListener("click", () => {

        const url = input.value.trim();

        if (!url) {
            alert("Entre une URL IPTV .m3u8");
            return;
        }

        currentChannelEl.textContent = "Chaîne personnalisée";

        playStream(url);

    });

}
