// image classifier

// const puppeteer = require("puppeteer");
// var browser, page;
// (async () => {
//   browser = await puppeteer.launch({
//     args: ["--use-fake-ui-for-media-stream"]
//   });
//   page = await browser.newPage();
//   await page.goto("http://127.0.0.1:3000/");
//   page.on("console", message => {
//     let text = message.text();
//     if (text.indexOf("spouse") == 0) {
//       console.log(text);
//       // whatsapp("hey soumya!");
//     }
//   });
// })();


// speech to text

// const puppeteer = require("puppeteer");
// var browser, page;
// (async () => {
//   browser = await puppeteer.launch({
//     headless: false,
//     args: [
//       "--window-size=0,0",
//       "--window-position=0,0",
//       "--enable-speech-dispatcher",
//       "--use-fake-ui-for-media-stream"
//     ],
//     ignoreDefaultArgs: ["--mute-audio"]
//   });
//   page = await browser.newPage();
//   await page.goto("http://127.0.0.1:3000/voice.html");
//   page.on("console", message => {
//     let text = message.text();
//     console.log(text);
//   });
// })();


// serial communication

// const serial = require("serialport");
// const port = new serial("/dev/cu.usbmodem14301", {
//   baudRate: 9600
// });
// const reader = require("@serialport/parser-readline");
// const parser = port.pipe(new reader());



// twilio whatsapp messaging

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