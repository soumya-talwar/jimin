// const {
//   ipcRenderer
// } = require("electron");
// let speak;

// function setup() {
// ipcRenderer.on("animate", (event, status) => {
//   if (status) {
// speak = setInterval(() => {
//   let src = $("#image").attr("src");
//   let frame = parseInt(src.match(/\d/)[0]);
//   $("#image").attr("src", `assets/jimin ${frame == 1 ? 2 : 1}.png`);
// }, 200);
//   } else
//     clearInterval(speak);
// });
// }