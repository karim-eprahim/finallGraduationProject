// sidebar responsive
let sidebtn = document.querySelector(".sidebtn");
let sidebar = document.querySelector(".sidebar");
sidebtn.addEventListener("click", () => {
  console.log(sidebtn);
  sidebar.classList.toggle("sidactive");
});

// Create a new Date object
var currentDate = new Date();
var dayOfWeek = currentDate.getDay();
var daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
var dayName = daysOfWeek[dayOfWeek];
var dayOfMonth = currentDate.getDate();
var month = currentDate.getMonth();
var monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
var monthName = monthNames[month];
var year = currentDate.getFullYear();

// Display the Date
console.log(dayName + ", " + dayOfMonth + " " + monthName + " " + year);
let datenow = document.querySelector(".datex");
let dayDate = " " + dayName + ", " + dayOfMonth + " " + monthName + " " + year;
datenow.innerHTML = dayDate;

// get the reading from firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const appSettings = {
  databaseURL: "https://test-a17dc-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);

let sensorData = {};
let myarray = [];

function fetchData() {
  const sensorsRef = ref(database, "sensors");

  onValue(sensorsRef, (snapshot) => {
    sensorData = snapshot.val();
    console.log(sensorData);
    myarray = Object.values(sensorData);

    // Trigger the updates
    intervals.forEach(({ target, circle, property }) => {
      updateReading(target, circle, property);
    });
  });
}

fetchData();
setInterval(fetchData, 5000);

// sensor reading

const sensorsReadingNumber = document.querySelectorAll("#number");
let circles = document.querySelectorAll("circle");

const intervals = [
  {
    target: sensorsReadingNumber[0],
    circle: circles[0],
    property: "temperature",
  },
  {
    target: sensorsReadingNumber[1],
    circle: circles[1],
    property: "light-intensity",
  },
  { target: sensorsReadingNumber[2], circle: circles[2], property: "humidity" },
  {
    target: sensorsReadingNumber[3],
    circle: circles[3],
    property: "airquality",
  },
];

function updateReading(target, circle, property) {
  let value = sensorData[property];
  if (value === undefined) {
    console.error(`Property ${property} not found in sensor data`);
    return;
  }

  let calculatedDashOffset = 377 - (value / 100) * 377;
  circle.style.cssText = `animation: sensreading 2s forwards; --dash-offset: ${calculatedDashOffset}px;`;

  let counter = 0;
  const interval = setInterval(() => {
    if (counter >= value) {
      clearInterval(interval);
    } else {
      counter++;
      target.innerHTML = counter + "%";
    }
  }, 20);
}
// graph
/* Created by Tivotal */

let primaryColor = getComputedStyle(document.documentElement)
  .getPropertyValue("--color-primary")
  .trim();

let labelColor = getComputedStyle(document.documentElement)
  .getPropertyValue("--color-label")
  .trim();

let fontFamily = getComputedStyle(document.documentElement)
  .getPropertyValue("--font-family")
  .trim();

let defaultOptions = {
  chart: {
    tollbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    width: "100%",
    height: 180,
    offsetY: 18,
  },

  dataLabels: {
    enabled: false,
  },
};

let barOptions = {
  ...defaultOptions,

  chart: {
    ...defaultOptions.chart,
    type: "area",
  },

  tooltip: {
    enabled: true,
    style: {
      fontFamily: fontFamily,
    },
    y: {
      formatter: (value) => `${value}k`,
    },
  },

  series: [
    {
      name: "series1",
      data: [31, 78, 28, 51, 42, 12, 100],
    },
    {
      name: "series2",
      data: [99, 32, 45, 22, 34, 52, 56],
    },
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
        {
          offset: 0,
          opacity: 0.2,
          color: "#ffffff",
        },
        {
          offset: 100,
          opacity: 0,
          color: "#ffffff",
        },
      ],
    },
  },

  stroke: {
    colors: [primaryColor, labelColor],
    lineCap: "round",
  },

  grid: {
    borderColor: "rgba(0, 0, 0, 0)",
    padding: {
      top: -30,
      right: 0,
      bottom: -8,
      left: 12,
    },
  },

  markers: {
    strokeColors: primaryColor,
  },

  yaxis: {
    show: false,
  },

  xaxis: {
    labels: {
      show: true,
      floating: true,
      style: {
        colors: labelColor,
        fontFamily: fontFamily,
      },
    },

    axisBorder: {
      show: false,
    },

    crosshairs: {
      show: false,
    },

    categories: ["Jan", "Mar", "May", "July", "Sept", "Nov"],
  },
};

let chart = new ApexCharts(document.querySelector(".chart-area"), barOptions);

chart.render();

// graph two
// let primaryColor = getComputedStyle(document.documentElement)
//   .getPropertyValue("--color-primary")
//   .trim();

// let labelColor = getComputedStyle(document.documentElement)
//   .getPropertyValue("--color-label")
//   .trim();

// let fontFamily = getComputedStyle(document.documentElement)
//   .getPropertyValue("--font-family")
//   .trim();

// let defaultOptions = {
//   chart: {
//     tollbar: {
//       show: false,
//     },
//     zoom: {
//       enabled: false,
//     },
//     width: "100%",
//     height: 180,
//     offsetY: 18,
//   },

//   dataLabels: {
//     enabled: false,
//   },
// };

let graphTwoOptions = {
  ...defaultOptions,

  chart: {
    ...defaultOptions.chart,
    type: "area",
  },

  tooltip: {
    enabled: true,
    style: {
      fontFamily: fontFamily,
    },
    y: {
      formatter: (value) => `${value}k`,
    },
  },

  series: [
    {
      name: "series1",
      data: [31, 40, 15, 51, 22, 109, 89],
    },
    {
      name: "series2",
      data: [42, 32, 45, 23, 34, 67, 97],
    },
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
        {
          offset: 0,
          opacity: 0.2,
          color: "#ffffff",
        },
        {
          offset: 100,
          opacity: 0,
          color: "#ffffff",
        },
      ],
    },
  },

  stroke: {
    colors: [primaryColor, labelColor],
    lineCap: "round",
  },

  grid: {
    borderColor: "rgba(0, 0, 0, 0)",
    padding: {
      top: -30,
      right: 0,
      bottom: -8,
      left: 12,
    },
  },

  markers: {
    strokeColors: primaryColor,
  },

  yaxis: {
    show: false,
  },

  xaxis: {
    labels: {
      show: true,
      floating: true,
      style: {
        colors: labelColor,
        fontFamily: fontFamily,
      },
    },

    axisBorder: {
      show: false,
    },

    crosshairs: {
      show: false,
    },

    categories: ["Jan", "Mar", "May", "July", "Sept", "Nov"],
  },
};

let graph = new ApexCharts(
  document.querySelector(".graphtwo"),
  graphTwoOptions
);

graph.render();
