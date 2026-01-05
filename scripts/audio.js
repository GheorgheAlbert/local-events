window.addEventListener("load", function () {
  let audioStream = null;
  let recorder = null;
  let chunks = [];

  const btnStart = document.getElementById("btnAudioStart");
  const btnStop = document.getElementById("btnAudioStop");
  const player = document.getElementById("audioPlayer");

  function reset() {
    btnStart.disabled = false;
    btnStop.disabled = true;
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
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        player.src = url;
      };

      recorder.start();
      btnStart.disabled = true;
      btnStop.disabled = false;
    } catch (e) {
      console.log(e);
    }
  });

  btnStop.addEventListener("click", function () {
    if (recorder && recorder.state !== "inactive") recorder.stop();

    if (audioStream) {
      audioStream.getTracks().forEach(t => t.stop());
      audioStream = null;
    }

    reset();
  });

  document.getElementById("eventModal").addEventListener("hidden.bs.modal", function () {
    if (recorder && recorder.state !== "inactive") recorder.stop();
    if (audioStream) {
      audioStream.getTracks().forEach(t => t.stop());
      audioStream = null;
    }
    reset();
  });

  reset();
});
