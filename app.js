var http = require("http");
var fs = require("fs");
var SerialPort = require("serialport");
const path = require("path");
const express = require("express");
const parsers = SerialPort.parsers;
const parser = new parsers.Readline({
  delimiter: "\r\n",
});



var port = new SerialPort("COM4", {
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});



port.pipe(parser);

// var app = http.createServer(function(req, res){
//     res.writeHead(200, {'Content-Type':'text/html'});
//     res.end(index);
// });

const app = express();
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/livecam", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "livecam.html"));
});

app.get("/streetlights", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "lights.html"));
});

app.get("/parking", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "parking.html"));
});

const server = app.listen(3000);

var io = require("socket.io").listen(server);
io.on("connection", function (data) {
  console.log("Node.js is listening");
});


parser.on("data", function (data) {
  console.log(data);
  io.emit("data", data);
});
