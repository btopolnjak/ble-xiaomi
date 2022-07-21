const noble = require("@abandonware/noble");
const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "../public")));
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

io.on("connection", (socket) => {
  noble.on("discover", (device) => {
    if (device.advertisement.serviceData) {
      if (device.advertisement.serviceData[0].uuid === "181a") {
        let time = new Date().toLocaleString("en-GB", { timeZone: "CET" });
        let buffer = device.advertisement.serviceData[0].data;
        let temperature =
          parseInt(buffer.toString("hex").slice(12, 16), 16) / 10;
        let humidity = parseInt(buffer.toString("hex").slice(16, 18), 16);
        let foundSensor = {
          sensor: device.advertisement.localName,
          temperature: temperature,
          humidity: humidity,
          time: time,
        };
        socket.emit("message", foundSensor);
      }
    }
  });

  noble.startScanning([], true);
});
