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
  noble.on("discover", function (peripheral) {
    console.log(peripheral);
    try {
      if (peripheral.advertisement.localName) {
        for (let sData of peripheral.advertisement.serviceData) {
          let sensorIndex = sensors.indexOf(peripheral.advertisement.localName);
          if (sData.uuid === uuid && sensorIndex != -1) {
            sensors[sensorIndex] = "";
            let temperature = sData.data.readIntBE(6, 2) / 10.0;
            let humidity = sData.data.readUInt8(8);
            let battery = sData.data.readUInt8(9);
            let now = new Date().toString();
            console.log(
              `${now} ${peripheral.advertisement.localName} T=${temperature}, H=${humidity}% Batt=${battery}%`
            );
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  noble.startScanning([], true);
});
