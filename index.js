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
// (async () => {
//   const dock = await dockStart({
//     use: ["Basic"]
//   });
//   const nlp = dock.get("nlp");
//   await nlp.addCorpus("nlp/train.json");
//   await nlp.train();
// })();

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
let jokes = [
  "What flowers kiss the best? Tulips!",
  "What tree can you hold hands with? A palm tree!",
  "Did you know I once cut down a tree just by looking at it? It's true, I saw it with my own eyes!",
  "You know I am really good at algebra? I can always find the root of the equation.",
  "My friend has a lot of friends. He's always branching out.",
  "How do trees get on the internet? They log on!",
  "I got fired by the florist. Apparently I took too many leaves.",
  "What did the young plant say to the old plant? Okay, bloomer.",
  "My neighbour was afraid to plant a mango tree. I told him to 'grow a pear'.",
  "Why did the tomato blush? Because he saw the salad dressing!"
];
let knock = ["Knock. Knock", "Leaf", "Leaf me alone"];

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
        main.webContents.send("converse", [text, result.answer]);
        setTimeout(() => {
          say.speak(result.answer, "Daniel", 1.0, () => {
            speaking = false;
            main.webContents.send("converse", []);
            setTimeout(() => {
              main.webContents.send(voice ? "listen" : "read", true);
              if (voice)
                io.emit("activate", true);
            }, 500);
          });
        }, 1000);
        main.webContents.send(voice ? "listen" : "read", false);
      });
  }
  // parser.on("data", reading => {
  //   let readings = reading.split(" ");
  //   main.webContents.send("sensors", readings);
  // });
});