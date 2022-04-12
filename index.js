// const express = require("express");
// const app = express();
// const http = require("http");
// const server = http.createServer(app);
// const {
//   Server
// } = require("socket.io");
// const io = new Server(server);

// app.get("/", (request, response) => response.sendFile(__dirname + "/voice.html"));
// app.get("/capture", (request, response) => response.sendFile(__dirname + "/capture.html"));
//
// server.listen(3000, () => console.log("listening on :3000"));
//
// io.on("connection", socket => {
//   socket.on("recording", async text => {
//     console.log("you spoke: " + text);
//     let response = await nlp.process("en", text);
//     console.log(response);
//     io.emit("respond", response.answer);
//   });
//   socket.on("response", text => {
//     console.log("jimin says: " + text);
//   });
// });

const say = require("say");
say.speak("Hello Sawmiya, my name is Jimin. How are you doing?", "Daniel", 1.0);

// const {
//   dockStart
// } = require("@nlpjs/basic");
//
// (async () => {
//   const dock = await dockStart({
//     use: ["Basic"]
//   });
//   const nlp = dock.get("nlp");
//   await nlp.addCorpus("./train.json");
//   await nlp.train();
// })();
//
// const fs = require("fs");
// const {
//   NlpManager
// } = require("node-nlp");
//
// const data = fs.readFileSync("model.nlp", "utf8");
// const manager = new NlpManager();
// manager.import(data);
//
// manager
//   .process("hi")
//   .then(result => console.log(result));

// const puppeteer = require("puppeteer");
// var browser, page;
// (async () => {
//   browser = await puppeteer.launch({
//     args: ["--use-fake-ui-for-media-stream"]
//   });
//   page = await browser.newPage();
//   await page.goto("http://localhost:3000/capture");
//   page.on("console", message => {
//     let text = message.text();
//     console.log(text);
//     if ((/^spouse/).test(text))
//       io.emit("listening", true);
//     else if ((/^not spouse/).test(text))
//       io.emit("listening", false);
//   });
// })();

// const serial = require("serialport");
// const port = new serial("/dev/cu.usbmodem14301", {
//   baudRate: 9600
// });
// const reader = require("@serialport/parser-readline");
// const parser = port.pipe(new reader());
//
//
// require("dotenv").config();
// const id = process.env.ACCOUNT_SID;
// const token = process.env.AUTH_TOKEN;
// const twilio = require("twilio")(id, token);
//
// parser.on("data", data => console.log(data));
//
// function whatsapp(content) {
//   twilio.messages.create({
//       from: "whatsapp:+14155238886",
//       body: content,
//       to: "whatsapp:+917982821106"
//     })
//     .then(message => console.log(message));
// }