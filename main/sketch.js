const { ipcRenderer } = require("electron");
let speak;
let husband;

function setup() {
  ipcRenderer.on("husband", (event, member) => {
    husband = member;
    let src = $("#avatar").attr("src");
    if (src) {
      let frame = parseInt(src.match(/\d/)[0]);
      $("#avatar").attr("src", `assets/${husband} ${frame}.png`);
      $(`#${husband}`).html(`${husband} (active)`);
      $(`#${husband}`).css({
        "background-image": "linear-gradient(45deg, #B540FF, #2222FF)",
        "color": "#FFFFFF",
        "border-color": "transparent",
        "box-shadow": "0 3px 6px #DBDBDB"
      });
      let nothusband = husband == "jimin" ? "seokjin" : "jimin";
      $(`#${nothusband}`).css({
        "background-image": "linear-gradient(45deg, transparent, transparent)",
        "color": "#707070",
        "border-color": "#707070",
        "box-shadow": "0 3px 6px transparent"
      });
      $(`#${nothusband}`).html(`${nothusband} (idle)`);
    } else {
      $("#avatar").attr("src", `assets/${husband} 4.png`);
    }
  });
  $("#jimin, #seokjin").click(event => ipcRenderer.send("husband", event.target.id));
  ipcRenderer.on("activate", (event, status) => {
    $(`#${husband}`).html(`${husband} (${status ? "active" : "idle"})`);
    $(`#${husband}`).css({
      "background-image": `linear-gradient(45deg, ${status ? "#B540FF, #2222FF" : "transparent, transparent"})`,
      "color": status ? "#FFFFFF" : "#707070",
      "border-color": status ? "transparent" : "#707070",
      "box-shadow": `0 3px 6px ${status ? "#DBDBDB": "transparent"}`
    });
    $("h4").html("");
    $("h1").css({
      "font-size": "4rem",
      "line-height": "6rem"
    });
    $("h1").html(status ? "" : "sorry, i only speak to my wife");
    $("#mic, #keyboard").css({
      "opacity": status ? 1 : 0.25
    });
    let blink = setInterval(() => {
      let src = $("#avatar").attr("src");
      let frame = parseInt(src.match(/\d/)[0]);
      $("#avatar").attr("src", `assets/${husband} ${frame == 1 ? 3 : 1}.png`);
    }, 200);
    setTimeout(() => {
      clearInterval(blink);
      $("#avatar").attr("src", `assets/${husband} ${status ? 1 : 4}.png`);
    }, 200 * 5);
  });
  ipcRenderer.on("listen", (event, status) => {
    $("#mic").css({
      "background-color": status ? "#FFFFFF" : "transparent",
      "box-shadow": `0 0 11px ${status ? "#B540FF" : "transparent"}`
    });
  });
  $("#mic").click(() => ipcRenderer.send("mic", true));
  ipcRenderer.on("read", (event, status) => {
    $("input").css({
      "opacity": status ? 1 : 0
    });
    $("#keyboard").css({
      "background-color": status ? "#FFFFFF" : "transparent",
      "box-shadow": `0 0 11px ${status ? "#B540FF" : "transparent"}`
    });
  });
  $("#keyboard").click(() => ipcRenderer.send("keyboard", true));
  ipcRenderer.on("converse", (event, data) => {
    if (data.length > 0) {
      $("h4").html("soumya: " + data[0].toLowerCase());
      $("h1").html("");
      $("h1").css({
        "font-size": "4rem",
        "line-height": "6rem"
      });
      data[1] = data[1].toLowerCase().replace("sawmiya", "soumya");
      setTimeout(() => {
        $("h1").html(data[1]);
        resize();
        speak = setInterval(() => {
          let src = $("#avatar").attr("src");
          let frame = parseInt(src.match(/\d/)[0]);
          $("#avatar").attr("src", `assets/${husband} ${frame == 1 ? 2 : 1}.png`);
        }, 200);
      }, 1000);
    } else {
      clearInterval(speak);
      $("#avatar").attr("src", `assets/${husband} 1.png`);
    }
  });
  $("input").keyup(event => {
    if (event.key == "Enter")
      ipcRenderer.send("chat", $("input").val())
  });
  ipcRenderer.on("sensors", (event, readings) => {
    $("#temp").html(readings[0]);
    $("#humid").html(readings[1]);
    $("#light").html(readings[2]);
    $("#soil").html(readings[3]);
  });
}

function resize() {
  $("h1").css({
    "font-size": ($("h1").css("font-size").match(/[\d.]+/)[0] - 1) + "px",
    "line-height": ($("h1").css("line-height").match(/[\d.]+/)[0] - 1) + "px"
  });
  if ($("h1").height() >= $("h1").parent().height() - $("h4").height() - $("input").height())
    resize();
}