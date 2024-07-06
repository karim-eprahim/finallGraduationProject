// sidebar responsive
let sidebtn = document.querySelector(".sidebtn");
let sidebar = document.querySelector(".sidebar");
sidebtn.addEventListener("click", () => {
  sidebar.classList.toggle("sidactive");
});

// Display the Date
var currentDate = new Date();
var dayOfWeek = currentDate.getDay();
var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var dayName = daysOfWeek[dayOfWeek];
var dayOfMonth = currentDate.getDate();
var month = currentDate.getMonth();
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var monthName = monthNames[month];
var year = currentDate.getFullYear();
let datenow = document.querySelector(".datex");
datenow.innerHTML = `${dayName}, ${dayOfMonth} ${monthName} ${year}`;

// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const appSettings = {
  // databaseURL: "https://test-a17dc-default-rtdb.firebaseio.com/",
  databaseURL: "https://newmotor-esp-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
let value = 0
let counter = 0;
let myarray =[]
let sensorData = {};
let temperatureGraph = [];
let airQualityGraph = [];
let soilMoistureGraph = [];
let humidityGraph = [];

function getValuesByName(data, name) {
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === name) {
      return Object.values(data[i][1]);
    }
  }
}

function fetchData() {
  let sensorsRef = ref(database, "sensors");
  let graphRef = ref(database, "graph");

  onValue(sensorsRef, (snapshot) => {
    sensorData = snapshot.val();
    // console.log(sensorData);
    myarray = Object.values(sensorData);
    // console.log(myarray);
    // Trigger the updates
    intervals.forEach(({ target, circle, property }) => {
      updateReading(target, circle, property);
    });
  });

  onValue(graphRef, (snapshot) => {
    let graphData = snapshot.val();
    let graphsValue = Object.entries(graphData);
    temperatureGraph = getValuesByName(graphsValue, 'Temperature');
    airQualityGraph = getValuesByName(graphsValue, 'AirQuality');
    soilMoistureGraph = getValuesByName(graphsValue, 'soilMoisture');
    humidityGraph = getValuesByName(graphsValue, 'humidity');

    // Update graphs
    chart.updateSeries([
      { name: "Temperature", data: temperatureGraph },
      { name: "AirQuality", data: airQualityGraph },
    ]);

    graph.updateSeries([
      { name: "Humidity", data: humidityGraph },
      { name: "SoilMoisture", data: soilMoistureGraph },
    ]);
  });
}

fetchData();
setInterval(fetchData, 5000);

// sensor reading
const sensorsReadingNumber = document.querySelectorAll("#number");
let circles = document.querySelectorAll("circle");

const intervals = [
  { target: sensorsReadingNumber[0], circle: circles[0], property: "temperature" },
  { target: sensorsReadingNumber[1], circle: circles[1], property: "light-intensity" },
  { target: sensorsReadingNumber[2], circle: circles[2], property: "humidity" },
  { target: sensorsReadingNumber[3], circle: circles[3], property: "airquality" },
  { target: sensorsReadingNumber[4], circle: circles[4], property: "soil-moisture" },
];

function updateReading(target, circle, property) {
  let maxRange = 0
  value = sensorData[property];
  if (value === undefined) {
    console.error(`Property ${property} not found in sensor data`);
    return;
  }

  if(property=="temperature"){
    maxRange = 100
  }else if(property=="light-intensity"){
    maxRange = 3000
  }else if(property=="humidity"){
    maxRange = 100
  }else if(property=="airquality"){
    maxRange = 500
  }else if(property=="soil-moisture"){
    maxRange = 100
  }


  let calculatedDashOffset = 377 - (value / maxRange) * 377;
  circle.style.cssText = `animation: sensreading 2s forwards; --dash-offset: ${calculatedDashOffset}px;`;

  target.innerHTML = value;
}
const interval = setInterval(() => {
  if (counter >= value) {
    clearInterval(interval);
  } else {
    counter++;
    target.innerHTML = counter;
  }
}, 20);

// Graph options
let primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim();
let labelColor = getComputedStyle(document.documentElement).getPropertyValue("--color-label").trim();
let fontFamily = getComputedStyle(document.documentElement).getPropertyValue("--font-family").trim();

let defaultOptions = {
  chart: {
    tollbar: { show: false },
    zoom: { enabled: false },
    width: "100%",
    height: 180,
    offsetY: 18,
  },
  dataLabels: { enabled: false },
};

let barOptions = {
  ...defaultOptions,
  chart: { ...defaultOptions.chart, type: "area" },
  tooltip: {
    enabled: true,
    style: { fontFamily: fontFamily },
    y: { formatter: (value) => `${value}` },
  },
  series: [
    { name: "Temperature", data: temperatureGraph },
    { name: "AirQuality", data: airQualityGraph },
  ],
  colors: [primaryColor, labelColor],
  fill: {
    type: "gradient",
    gradient: {
      type: "vertical",
      opacityFrom: 1,
      opacityTo: 0,
      stops: [0, 100],
      colorStops: [
        { offset: 0, opacity: 0.2, color: "#ffffff" },
        { offset: 100, opacity: 0, color: "#ffffff" },
      ],
    },
  },
  stroke: { colors: [primaryColor, labelColor], lineCap: "round" },
  grid: {
    borderColor: "rgba(0, 0, 0, 0)",
    padding: { top: -30, right: 0, bottom: -8, left: 12 },
  },
  markers: { strokeColors: primaryColor },
  yaxis: { show: false },
  xaxis: {
    labels: {
      show: true,
      floating: true,
      style: { colors: labelColor, fontFamily: fontFamily },
    },
    axisBorder: { show: false },
    crosshairs: { show: false },
    categories: [],
  },
};

let chart = new ApexCharts(document.querySelector(".chart-area"), barOptions);
chart.render();

let graphTwoOptions = {
  ...defaultOptions,
  chart: { ...defaultOptions.chart, type: "area" },
  tooltip: {
    enabled: true,
    style: { fontFamily: fontFamily },
    y: { formatter: (value) => `${value}` },
  },
  series: [
    { name: "Humidity", data: humidityGraph },
    { name: "SoilMoisture", data: soilMoistureGraph },
  ],
  colors: [primaryColor, labelColor],
  fill: {
    type: "gradient",
    gradient: {
      type: "vertical",
      opacityFrom: 1,
      opacityTo: 0,
      stops: [0, 100],
      colorStops: [
        { offset: 0, opacity: 0.2, color: "#ffffff" },
        { offset: 100, opacity: 0, color: "#ffffff" },
      ],
    },
  },
  stroke: { colors: [primaryColor, labelColor], lineCap: "round" },
  grid: {
    borderColor: "rgba(0, 0, 0, 0)",
    padding: { top: -30, right: 0, bottom: -8, left: 12 },
  },
  markers: { strokeColors: primaryColor },
  yaxis: { show: false },
  xaxis: {
    labels: {
      show: true,
      floating: true,
      style: { colors: labelColor, fontFamily: fontFamily },
    },
    axisBorder: { show: false },
    crosshairs: { show: false },
    categories: [],
  },
};

let graph = new ApexCharts(document.querySelector(".graphtwo"), graphTwoOptions);
graph.render();
