const socket = io();
const text = document.getElementById("info");

socket.on("message", (data) => {
  const root = document.getElementById("root");
  const sensorDiv = document.getElementById(`${data.sensor}`);
  const sensorMac = document.getElementById("mac-text");
  const sensorTemp = document.getElementById("temperature-text");
  const sensorHumid = document.getElementById("humidity-text");
  const sensorTime = document.getElementById("time-text");
  const unformattedTime = new Date(data.time);
  const formattedTime = `${unformattedTime.getHours()}:${unformattedTime.getMinutes()}`;
  if (sensorDiv) {
    console.log(sensorDiv);
    sensorMac.innerText = data.macAddress;
    sensorTemp.innerText = data.temperature.toFixed(1);
    sensorHumid.innerText = `${data.humidity.toFixed(0)} %`;
    sensorTime.innerText = formattedTime;
  } else {
    const placeholder = `
    <div id="${data.sensor}" class="sensor">
      <div class="header-div"><p id="name-text">${
        data.sensor
      }</p><p id="mac-text">${data.macAddress}</p></div>
      <div class="temperature-div"><i class="bi bi-thermometer-half"></i><span id="temperature-text">${data.temperature.toFixed(
        1
      )}</span></div>
      <div class="humidity-div"><p class="small-header">HUMIDITY</p><span id="humidity-text">${data.humidity.toFixed(
        0
      )} %</span></div>
      <div class="time-div"><p class="small-header">UPDATED</p><span id="time-text">${formattedTime}</span></div>
    </div>`;
    root.insertAdjacentHTML("beforeend", placeholder);
  }
});
