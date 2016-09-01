"use strict";

const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const https = require("https");

const IP = "10.0.0.3";
const PORT = 3010;

app.get(/\/(server|client).html/, (req, res) => {
	fs.readFile(path.resolve(__dirname, req._parsedUrl.pathname.replace(/^\//,"")), (err, file) => {
		if(err){
			return res.status(404).end();
		}
		file = file.toString().replace(/\<ip\>/g, IP);
		file = file.toString().replace(/\<port\>/g, PORT);
		res.end(file);
	});
});
app.use(express.static("."));


const server = https.createServer({
	key: fs.readFileSync("./cert/key.pem"),
	cert: fs.readFileSync("./cert/cert.pem")
}, app);
server.listen(PORT);

const io = require("socket.io")(server);

const socketListener = (function () {
	let clientSocket = null;
	let serverSocket = null;
	let started = false;
	function getOppositeSocket(socket) {
		return socket == clientSocket ? serverSocket : (socket == serverSocket ? clientSocket : null)
	}
	function prepareListeners(socket) {
		socket.on("candidate", (candidate) => {
			getOppositeSocket(socket).emit("candidate", candidate);
		});
		socket.on("sdp", (desc) => {
			getOppositeSocket(socket).emit("sdp", desc);
		});
	}
	function canStart() {
		if (clientSocket == null || serverSocket == null) {
			console.warn(`no starting as sockets are not ready yet. clientSocket: ${clientSocket != null}. serverSocket: ${serverSocket != null}`)
			return;
		}
		console.log("started")

		clientSocket.emit("start");
		serverSocket.emit("start");
	}
	return function (socket) {
		socket.emit("role");
		socket.on("role", (role) => {
			if (role == "client") {
				clientSocket = socket;
				prepareListeners(clientSocket);
				canStart();
			}
			else if (role == "server") {
				serverSocket = socket;
				prepareListeners(serverSocket);
				canStart();
			}
		});

	};
})();
io.on("connection", socketListener);