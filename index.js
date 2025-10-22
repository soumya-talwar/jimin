const { app, BrowserWindow, ipcMain } = require("electron");

require("dotenv").config();
const OpenAI = require("openai");
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});
const express = require("express");
const web = express();
const http = require("http");
const server = http.createServer(web);
const { Server } = require("socket.io");
const io = new Server(server);
web.get("/", (request, response) =>
	response.sendFile(__dirname + "/mic/mic.html")
);
server.listen(3000);
const fs = require("fs");
const path = require("path");
const say = require("say");

const { SerialPort } = require("serialport");
const port = new SerialPort({
	path: "/dev/cu.usbmodem3101",
	baudRate: 9600,
});
const { ReadlineParser } = require("@serialport/parser-readline");
const parser = port.pipe(
	new ReadlineParser({
		delimiter: "\r\n",
	})
);

let husband = "seokjin";
let readings;
let active = false;
let mic = false;
let speaking = false;

app.whenReady().then(() => {
	const main = new BrowserWindow({
		fullscreen: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});
	main.loadFile("main/index.html");

	const camera = new BrowserWindow({
		width: 800,
		height: 600,
		show: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});
	camera.loadFile("camera/camera.html");

	ipcMain.on("webcam", (event, reading) => {
		if (/^spouse/.test(reading) && !active) {
			main.webContents.send("husband", husband);
			main.webContents.send("activate", true);
			main.webContents.send(mic ? "listen" : "read", true);
			if (mic) io.emit("activate", true);
			active = true;
		} else if (!/^spouse/.test(reading) && active) {
			say.stop();
			main.webContents.send("husband", husband);
			main.webContents.send("activate", false);
			main.webContents.send(mic ? "listen" : "read", false);
			if (mic) io.emit("activate", false);
			active = false;
		}
	});

	parser.on("data", (reading) => {
		readings = reading.split(" ");
		main.webContents.send("sensors", readings);
	});

	ipcMain.on("husband", (event, member) => {
		husband = member;
		main.webContents.send("husband", husband);
	});

	ipcMain.on("mic", (event, status) => {
		if (active && !speaking) {
			mic = true;
			io.emit("activate", true);
			main.webContents.send("listen", true);
			main.webContents.send("read", false);
		}
	});

	ipcMain.on("keyboard", (event, status) => {
		if (active && !speaking) {
			mic = false;
			io.emit("activate", false);
			main.webContents.send("read", true);
			main.webContents.send("listen", false);
		}
	});

	io.on("connection", (socket) => {
		socket.on("speech", (text) => converse(text));
	});

	ipcMain.on("chat", (event, message) => {
		converse(message);
	});

	function converse(text) {
		const SYSTEM_PROMPT = fs.readFileSync(
			path.join(__dirname, "prompts", `${husband}.txt`),
			"utf8"
		);
		let [temp, humid, light, soil] = readings;
		const USER_INPUT = `Sensor readings: Soil Moisture=${soil}, Temperature=${temp}, Humidity=${humid}, Light=${light} User said: "${text}"`;
		const messages = [
			{ role: "system", content: SYSTEM_PROMPT },
			{ role: "user", content: USER_INPUT },
		];
		openai.chat.completions
			.create({
				model: "gpt-4o-mini",
				messages,
			})
			.then(async (output) => {
				speaking = true;
				let reply = output.choices[0].message.content;
				main.webContents.send("converse", [text, reply]);
				setTimeout(() => {
					say.speak(
						reply,
						husband == "jimin" ? "Oliver" : "Daniel",
						1.0,
						() => {
							speaking = false;
							main.webContents.send("converse", []);
							setTimeout(() => {
								main.webContents.send(mic ? "listen" : "read", true);
								if (mic) io.emit("activate", true);
							}, 500);
						}
					);
				}, 1000);
				main.webContents.send(mic ? "listen" : "read", false);
			});
	}
});
