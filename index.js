const { app, BrowserWindow, ipcMain } = require("electron");

const express = require("express");
const web = express();
const http = require("http");
const server = http.createServer(web);
const { Server } = require("socket.io");
const io = new Server(server);
web.get("/", (request, response) => response.sendFile(__dirname + "/speech/voice.html"));
server.listen(3000);
const say = require("say");

// const { dockStart } = require("@nlpjs/basic");
const fs = require("fs");
const { NlpManager } = require("node-nlp");
const data = fs.readFileSync("nlp/model.nlp", "utf8");
const manager = new NlpManager();
manager.import(data);

// const { SerialPort } = require("serialport");
// const port = new SerialPort({
//   path: "/dev/cu.usbmodem14301",
//   baudRate: 9600
// });
// const { ReadlineParser } = require("@serialport/parser-readline");
// const parser = port.pipe(new ReadlineParser({
//   delimiter: "\r\n"
// }));

let active = false;
let voice = true;
let speaking = false;

app.whenReady().then(() => {
  const main = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  main.loadFile("main/index.html");

  const camera = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  camera.loadFile("webcam/camera.html");
  ipcMain.on("webcam", (event, reading) => {
    if ((/^spouse/).test(reading) && !active) {
      main.webContents.send("activate", true);
      main.webContents.send(voice ? "listen" : "read", true);
      if (voice)
        io.emit("activate", true);
      active = true;
    } else if (!(/^spouse/).test(reading) && active) {
      say.stop();
      main.webContents.send("activate", false);
      main.webContents.send(voice ? "listen" : "read", false);
      if (voice)
        io.emit("activate", false);
      active = false;
    }
  });
  ipcMain.on("mic", (event, status) => {
    if (active && !speaking) {
      voice = true;
      io.emit("activate", true);
      main.webContents.send("listen", true);
      main.webContents.send("read", false);
    }
  });
  ipcMain.on("keyboard", (event, status) => {
    if (active && !speaking) {
      voice = false;
      io.emit("activate", false);
      main.webContents.send("read", true);
      main.webContents.send("listen", false);
    }
  });
  io.on("connection", socket => {
    socket.on("speech", text => converse(text));
  });
  ipcMain.on("chat", (event, message) => {
    converse(message);
  });

  function converse(text) {
    manager
      .process(text)
      .then(result => {
        speaking = true;
        main.webContents.send(voice ? "listen" : "read", false);
        main.webContents.send("converse", [text, result.answer]);
        say.speak(result.answer, "Daniel", 1.0, () => {
          setTimeout(() => {
            speaking = false;
            main.webContents.send("converse", []);
            main.webContents.send(voice ? "listen" : "read", true);
            io.emit("activate", true);
          }, 500);
        });
      });
  }
  // parser.on("data", reading => main.webContents.send("moisture", reading));
});

// (async () => {
//   const dock = await dockStart({
//     use: ["Basic"]
//   });
//   const nlp = dock.get("nlp");
//   await nlp.addCorpus("nlp/train.json");
//   await nlp.train();
// })();