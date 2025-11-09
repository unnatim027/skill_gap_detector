const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let stars = [];
let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * w
    });
  }
}
window.addEventListener("resize", resize);
resize();

function draw() {
  ctx.fillStyle = "rgba(10,10,30,0.4)";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < stars.length; i++) {
    let star = stars[i];
    star.z -= 2;
    if (star.z <= 0) star.z = w;

    let k = 128.0 / star.z;
    let px = star.x * k + w / 2;
    let py = star.y * k + h / 2;

    if (px >= 0 && px <= w && py >= 0 && py <= h) {
      let size = (1 - star.z / w) * 2;
      ctx.fillRect(px, py, size, size);
    }
  }
  requestAnimationFrame(draw);
}
draw();

function enterProject() {
  document.querySelector(".welcome-container").style.opacity = 0;
  setTimeout(() => {
    window.location.href = "skill.html";
  }, 1000);
}
