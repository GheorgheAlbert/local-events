window.addEventListener("load", function () {
  let stream = null;
  let recorder = null;
  let chunks = [];

  const live = document.getElementById("videoLive");
  const recorded = document.getElementById("videoRecorded");

  const btnOn = document.getElementById("btnCamOn");
  const btnOff = document.getElementById("btnCamOff");
  const btnStart = document.getElementById("btnVidStart");
  const btnStop = document.getElementById("btnVidStop");

  function setUI(on) {
    btnOn.disabled = on;
    btnOff.disabled = !on;
    btnStart.disabled = !on;
    btnStop.disabled = true;
  }

  btnOn.addEventListener("click", async function () {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      live.srcObject = stream;
      recorded.src = "";
      setUI(true);
    } catch (e) {
      console.log(e);
    }
  });

  btnOff.addEventListener("click", function () {
    stopEverything();
  });

  btnStart.addEventListener("click", function () {
    if (!stream) return;

    chunks = [];
    recorder = new MediaRecorder(stream);

    recorder.ondataavailable = function (e) {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = function () {
      const blob = new Blob(chunks, { type: "video/webm" });
      recorded.src = URL.createObjectURL(blob);
    };

    recorder.start();
    btnStart.disabled = true;
    btnStop.disabled = false;
  });

  btnStop.addEventListener("click", function () {
    if (recorder && recorder.state !== "inactive") recorder.stop();
    btnStart.disabled = false;
    btnStop.disabled = true;
  });

  function stopEverything() {
    if (recorder && recorder.state !== "inactive") recorder.stop();

    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }

    live.srcObject = null;
    setUI(false);
  }

  document.getElementById("eventModal").addEventListener("hidden.bs.modal", function () {
    stopEverything();
  });

  setUI(false);
});
