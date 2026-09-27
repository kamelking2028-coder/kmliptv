const input = document.getElementById("iptvUrl");
const btn = document.getElementById("playBtn");

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
