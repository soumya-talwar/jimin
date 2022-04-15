const { app, BrowserWindow, ipcMain } = require("electron");

const express = require("express");
const web = express();
const http = require("http");
const server = http.createServer(web);
const { Server } = require("socket.io");
const io = new Server(server);
web.get("/", (request, response) => response.sendFile(__dirname + "/speech/voice.html"));
server.listen(3000);

// const { dockStart } = require("@nlpjs/basic");
const fs = require("fs");
const { NlpManager } = require("node-nlp");
const data = fs.readFileSync("nlp/model.nlp", "utf8");
const manager = new NlpManager();
manager.import(data);

const serial = require("serialport");
const port = new serial("/dev/cu.usbmodem14301", {
  baudRate: 9600
});
const reader = require("@serialport/parser-readline");
const parser = port.pipe(new reader());

const say = require("say");

let active = false;

app.whenReady().then(() => {
  const main = new BrowserWindow({
    width: 600,
    height: 600,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  // main.maximize();
  // main.show();
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
      io.emit("activate", true);
      active = true;
    } else if (!(/^spouse/).test(reading) && active) {
      active = false;
      io.emit("activate", false);
    }
  });
  io.on("connection", socket => {
    socket.on("speech", text => {
      console.log("you spoke: " + text);
      // parser.on("data", data => console.log(data));
      manager
        .process(text)
        .then(result => {
          main.webContents.send("animate", true);
          say.speak(result.answer, "Daniel", 1.0, () => {
            main.webContents.send("animate", false);
            setTimeout(() => io.emit("activate", true), 500);
          });
        });
    });
  });
});

// (async () => {
//   const dock = await dockStart({
//     use: ["Basic"]
//   });
//   const nlp = dock.get("nlp");
//   await nlp.addCorpus("nlp/train.json");
//   await nlp.train();
// })();