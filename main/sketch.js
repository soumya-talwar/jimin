const { ipcRenderer } = require("electron");
let speak;

function setup() {
  update();
  setInterval(update, 1000 * 20);
  ipcRenderer.on("activate", (event, status) => {
    $("#jimin").html(`jimin (${status ? "active" : "idle"})`);
    $("#jimin").css({
      "background-color": `${status ? "#2222FF" : "#9F9F9F"}`
    });
    $("h4").html("");
    $("h1").html(status ? "" : "sorry, i only speak to my wife");
    let blink = setInterval(() => {
      let src = $("#avatar").attr("src");
      let frame = parseInt(src.match(/\d/)[0]);
      $("#avatar").attr("src", `assets/jimin ${frame == 1 ? 3 : 1}.png`);
    }, 400);
    setTimeout(() => {
      clearInterval(blink);
      $("#avatar").attr("src", `assets/jimin ${status ? 1 : 4}.png`);
    }, 400 * 5);
  });
  ipcRenderer.on("listen", (event, status) => {
    $("#voice").css({
      "background-color": `${status ? "#FFFFFF" : "transparent"}`,
      "box-shadow": `0 0 11px ${status ? "#2222FF" : "transparent"}`
    });
  });
  $("#voice").click(() => ipcRenderer.send("mic", true));
  ipcRenderer.on("read", (event, status) => {
    $("#type").css({
      "background-color": `${status ? "#FFFFFF" : "transparent"}`,
      "box-shadow": `0 0 11px ${status ? "#2222FF" : "transparent"}`
    });
  });
  $("#type").click(() => ipcRenderer.send("keyboard", true));
  ipcRenderer.on("converse", (event, data) => {
    if (data.length > 0) {
      speak = setInterval(() => {
        let src = $("#avatar").attr("src");
        let frame = parseInt(src.match(/\d/)[0]);
        $("#avatar").attr("src", `assets/jimin ${frame == 1 ? 2 : 1}.png`);
      }, 200);
      $("h4").html("soumya: " + data[0].toLowerCase());
      data[1] = data[1].replace("sawmiya", "soumya").toLowerCase();
      let index = 1;
      let type = setInterval(() => {
        $("h1").html(data[1].substring(0, index++));
        if ($("h1").height() >= $("h1").parent().height() - 200)
          resize();
        if (index > data[1].length)
          clearInterval(type);
      }, 100);
    } else {
      clearInterval(speak);
      $("#avatar").attr("src", "assets/jimin 1.png");
    }
  });
  // ipcRenderer.on("moisture", (event, reading) => $("#soil").html(reading));
}

function resize() {
  $("h1").css({
    "font-size": ($("h1").css("font-size").match(/[\d.]+/)[0] - 2) + "px",
    "line-height": ($("h1").css("line-height").match(/[\d.]+/)[0] - 1.5) + "px"
  });
  if ($("h1").height() >= $("h1").parent().height() - 200)
    resize();
}

async function update() {
  let date = new Date();
  let day = date.getDate();
  if (day > 3 && day < 21)
    day += "th";
  else {
    switch (day % 10) {
      case 1:
        day += "st";
        break;
      case 2:
        day += "nd";
        break;
      case 3:
        day += "rd";
        break;
      default:
        day += "th";
    }
  }
  let month = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"][date.getMonth()];
  let year = date.getFullYear();
  let hours = date.getHours();
  let pm = false;
  if (hours > 12) {
    hours %= 12;
    pm = true;
  }
  if (hours < 10)
    hours = "0" + hours;
  let minutes = date.getMinutes();
  if (minutes < 10)
    minutes = "0" + minutes;
  $(".label").eq(0).html(day + " " + month + ", " + year);
  $("#time").html(hours + ":" + minutes + (pm ? "PM" : "AM"));
  await fetch("https://api.openweathermap.org/data/2.5/weather?lat=13.101556425270013&lon=77.57196329497141&units=metric&appid=3d410dbee551d99b36d71387bbe879ec")
    .then(response => response.json())
    .then(data => {
      $("#weather").html(data.weather[0].description);
      $("#temp").html(data.main.temp + "°C");
      $("#humid").html(data.main.humidity + "%");
      $("#wind").html(round(data.wind.speed * 3.6, 2) + "km/h");
    });
}