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
    function prepareBuffer(buffer) {
      let bufferArray = buffer.toString("hex").match(/.{1,2}/g);
      let time = Date.now();
      if (bufferArray[0] === "a4") {
        let foundSensor = {
          sensor: device.advertisement.localName,
          temperature: parseInt(bufferArray.slice(6, 8).join(""), 16) / 10,
          humidity: parseInt(bufferArray.slice(8), 16),
          time: time,
        };
        return foundSensor;
      }
      let foundSensor = {
        sensor: device.advertisement.localName,
        macAddress: bufferArray
          .slice(0, 6)
          .reverse()
          .join(":")
          .toString()
          .toUpperCase(),
        temperature:
          parseInt(bufferArray.slice(6, 8).reverse().join(""), 16) / 100,
        humidity:
          parseInt(bufferArray.slice(8, 10).reverse().join(""), 16) / 100,
        time: time,
      };
      return foundSensor;
    }

    try {
      if (
        !device.advertisement.localName ||
        device.advertisement.localName.slice(0, 4) != "ATC_"
      )
        return;
      let buffer = device.advertisement.serviceData[0].data;
      let foundSensor = prepareBuffer(buffer);
      socket.emit("message", foundSensor);
      console.log(foundSensor);
    } catch (error) {
      console.log(error);
    }
  });

  noble.startScanning([], true);
});
