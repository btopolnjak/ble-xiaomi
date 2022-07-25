const socket = io();
const text = document.getElementById("info");

socket.on("message", (data) => {
  console.log(data);
  const root = document.getElementById("root");
  const sensorDiv = document.getElementById(`${data.sensor}`);
  const sensorTemp = document.getElementById("temp");
  const sensorHumid = document.getElementById("humid");
  const sensorTime = document.getElementById("time");
  if (sensorDiv) {
    sensorTemp.innerText = `Temperatura: ${data.temperature} \u00B0C`;
    sensorHumid.innerText = `Vlaga: ${data.humidity} %`;
    sensorTime.innerText = `Vrijeme: ${data.time}`;
  } else {
    console.log("Adding", data.sensor);
    const placeholder = `<div id="${data.sensor}"><h1 id="name">Senzor: ${data.sensor}</h1><h3 id="temp">Temperatura: ${data.temperature} \u00B0C</h3><h3 id="humid">Vlaga: ${data.humidity} %</h3><h5 id="time">Vrijeme: ${data.time}</h5></div>`;
    root.insertAdjacentHTML("beforeend", placeholder);
  }
});
