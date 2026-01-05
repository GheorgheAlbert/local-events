window.onload = function () {
  let audioStream = null;
  let recorder = null;
  let chunks = [];

  let btnStart = document.getElementById("btnAudioStart");
  let btnStop = document.getElementById("btnAudioStop");
  let player = document.getElementById("audioPlayer");
  let status = document.getElementById("audioStatus");
  let download = document.getElementById("audioDownload");

  function setStatus(text) {
    status.textContent = "Status: " + text;
  }

  btnStart.addEventListener("click", async function () {
    try {
      audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];

      recorder = new MediaRecorder(audioStream);

      recorder.ondataavailable = function (e) {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = function () {
        let blob = new Blob(chunks, { type: "audio/webm" });
        let url = URL.createObjectURL(blob);

        player.src = url;
        download.href = url;
        download.classList.remove("disabled");

        setStatus("recorded");
      };

      recorder.start();

      btnStart.disabled = true;
      btnStop.disabled = false;
      download.classList.add("disabled");
      setStatus("recording...");
    } catch (err) {
      console.log(err);
      setStatus("microphone blocked / error");
    }
  });

  btnStop.addEventListener("click", function () {
    if (recorder && recorder.state !== "inactive") recorder.stop();

    if (audioStream) {
      audioStream.getTracks().forEach(function (t) { t.stop(); });
      audioStream = null;
    }

    btnStart.disabled = false;
    btnStop.disabled = true;
  });
};
