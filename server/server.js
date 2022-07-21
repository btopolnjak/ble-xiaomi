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
    try {
      if (
        !device.advertisement.localName ||
        device.advertisement.localName.slice(0, 4) != "ATC_"
      )
        return;
      let time = Date.now();
      let buffer = device.advertisement.serviceData[0].data;
      let temperature = buffer.readIntBE(6, 2) / 10.0;
      let humidity = buffer.readUInt8(8);
      let foundSensor = {
        sensor: device.advertisement.localName,
        temperature: temperature,
        humidity: humidity,
        time: time,
      };
      socket.emit("message", foundSensor);
    } catch (error) {
      console.log(error);
    }
  });

  noble.startScanning([], true);
});
