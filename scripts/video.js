window.onload = function () {
  let camStream = null;

  let videoRecorder = null;
  let videoChunks = [];

  let live = document.getElementById("videoLive");
  let recorded = document.getElementById("videoRecorded");

  let btnCamOn = document.getElementById("btnCamOn");
  let btnCamOff = document.getElementById("btnCamOff");
  let btnSnap = document.getElementById("btnSnap");

  let btnVidStart = document.getElementById("btnVidStart");
  let btnVidStop = document.getElementById("btnVidStop");
  let videoDownload = document.getElementById("videoDownload");

  let canvas = document.getElementById("snapshotCanvas");
  let ctx = canvas.getContext("2d");

  function setCameraUI(on) {
    btnCamOn.disabled = on;
    btnCamOff.disabled = !on;
    btnSnap.disabled = !on;
    btnVidStart.disabled = !on;
    btnVidStop.disabled = true;
  }

  btnCamOn.addEventListener("click", async function () {
    try {
      camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      live.srcObject = camStream;
      setCameraUI(true);
    } catch (err) {
      console.log(err);
    }
  });

  btnCamOff.addEventListener("click", function () {
    if (camStream) {
      camStream.getTracks().forEach(function (t) { t.stop(); });
      camStream = null;
    }
    live.srcObject = null;
    setCameraUI(false);
  });

  btnSnap.addEventListener("click", function () {
    if (!camStream) return;

    let w = live.videoWidth || 640;
    let h = live.videoHeight || 360;

    canvas.width = w;
    canvas.height = h;

    ctx.drawImage(live, 0, 0, w, h);
  });

  btnVidStart.addEventListener("click", function () {
    if (!camStream) return;

    videoChunks = [];
    videoDownload.classList.add("disabled");

    videoRecorder = new MediaRecorder(camStream);

    videoRecorder.ondataavailable = function (e) {
      if (e.data && e.data.size > 0) videoChunks.push(e.data);
    };

    videoRecorder.onstop = function () {
      let blob = new Blob(videoChunks, { type: "video/webm" });
      let url = URL.createObjectURL(blob);

      recorded.src = url;
      videoDownload.href = url;
      videoDownload.classList.remove("disabled");
    };

    videoRecorder.start();

    btnVidStart.disabled = true;
    btnVidStop.disabled = false;
  });

  btnVidStop.addEventListener("click", function () {
    if (videoRecorder && videoRecorder.state !== "inactive") videoRecorder.stop();

    btnVidStart.disabled = false;
    btnVidStop.disabled = true;
  });

  setCameraUI(false);
};
