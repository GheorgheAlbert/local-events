const canvas = document.getElementById("eventsCanvas");

if (canvas) {
  const ctx = canvas.getContext("2d");

  const labels = ["Rock", "Run", "Food", "Jazz", "DJ", "Volunteer"];
  const values = [4, 3, 5, 2, 4, 3];

  const width = canvas.width;
  const height = canvas.height;

  const originX = 50;
  const originY = height - 40;
  const barWidth = 60;
  const gap = 20;
  const maxBarHeight = 180;
  const maxValue = Math.max(...values);

  ctx.fillStyle = "#f8f9fa";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#212529";
  ctx.font = "14px Arial";
  ctx.fillText("Events per category", 10, 20);

  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(width - 20, originY);
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX, 40);
  ctx.strokeStyle = "#6c757d";
  ctx.lineWidth = 1;
  ctx.stroke();

  for (let i = 0; i < values.length; i++) {
    const x = originX + gap + i * (barWidth + gap);
    const barHeight = (values[i] / maxValue) * maxBarHeight;
    const y = originY - barHeight;

    ctx.fillStyle = "#0d6efd";
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = "#212529";
    ctx.font = "12px Arial";
    ctx.fillText(labels[i], x, originY + 15);
    ctx.fillText(values[i].toString(), x + barWidth / 2 - 5, y - 5);
  }
}
