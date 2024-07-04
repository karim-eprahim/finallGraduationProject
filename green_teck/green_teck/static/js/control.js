// Firebase imports and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const appSettings = {
  databaseURL: "https://test-a17dc-default-rtdb.firebaseio.com/",
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
let sensorData = {};
let controlData = {};

// Utility functions
function fetchData(path, callback) {
  const dataRef = ref(database, path);
  onValue(dataRef, (snapshot) => {
    callback(snapshot.val());
  });
}

function setElementContent(selector, content) {
  document.querySelector(selector).innerHTML = content;
}

function updateControlState(control, elementIds) {
  if (control["auto"]) {
    document.getElementById(elementIds.auto).classList.add("active");
    document.getElementById(elementIds.manual).classList.remove("active");
    document.getElementById(elementIds.autoBtn).classList.add("show");
    document.getElementById(elementIds.manualBtn).classList.remove("show");
  } else {
    document.getElementById(elementIds.manual).classList.add("active");
    document.getElementById(elementIds.auto).classList.remove("active");
    document.getElementById(elementIds.manualBtn).classList.add("show");
    document.getElementById(elementIds.autoBtn).classList.remove("show");
  }
}

function addClickListener(elementId, path, value, elementIds) {
  document
    .getElementById(elementId)
    .addEventListener("click", function (event) {
      event.preventDefault();
      set(ref(database, path), value);
      updateControlState({ auto: value }, elementIds);
    });
}

function addCheckboxListener(elementId, path) {
  document.getElementById(elementId).addEventListener("change", function () {
    set(ref(database, path), this.checked);
  });
}

function initializeSwitch(controlPath, elementId) {
  const element = document.getElementById(elementId);
  element.checked = controlData[controlPath.split("/")[1]]["manual-control"];
  if (elementId == "leftMoisture") {
    element.checked =
      controlData[controlPath.split("/")[1]]["soil-moisture-left"][
        "manual-control"
      ];
  }
}

function otherButtonListeners() {
  // fan button
  Array.from(document.querySelectorAll("#fan")).map((e) => {
    e.addEventListener("change", function () {
      set(
        ref(database, "controls/y-fan-hood-control/fan-manual"),
        this.checked
      );
    });
  });

  // Hood button
  Array.from(document.querySelectorAll("#hood")).map((e) => {
    e.addEventListener("change", function () {
      set(
        ref(database, "controls/y-fan-hood-control/hood-manual"),
        this.checked
      );
    });
  });

  // Irrigation buttons
  document
    .getElementById("rightMoisture")
    .addEventListener("change", function () {
      set(
        ref(
          database,
          "controls/soil-moisture/soil-moisture-right/manual-control"
        ),
        this.checked
      );
    });
}

function checkForOtherButtonListeners() {
  Array.from(document.querySelectorAll("#fan")).map((e) => {
    e.checked =
      controlData["controls/y-fan-hood-control/fan-manual".split("/")[1]][
        "fan-manual"
      ];
  });

  Array.from(document.querySelectorAll("#hood")).map((e) => {
    e.checked =
      controlData["controls/y-fan-hood-control/hood-manual".split("/")[1]][
        "hood-manual"
      ];
  });

  const waterDrain = document.getElementById("rightMoisture");
  waterDrain.checked =
    controlData[
      "controls/soil-moisture/soil-moisture-right/manual-control".split("/")[1]
    ]["soil-moisture-right"]["manual-control"];
}

function sendValueToFirebase(id, path) {
  const autoValue = document.getElementById(id).value;
  set(ref(database, path), autoValue);
}

function getValueFromFirebase(id, path) {
  fetchData(path, (data) => {
    document.getElementById(id).value = data;
  });
}

// Fetch and update readings
function getReading() {
  setElementContent(
    ".temperature",
    `${sensorData["temperature"]} <span class="fs-4">&#8451;</span>`
  );
  setElementContent(
    ".light",
    `${sensorData["light-intensity"]} <span class="fs-4">Lux</span>`
  );
  setElementContent(
    ".humidity",
    `${sensorData["humidity"]} <span class="fs-4">%</span>`
  );
}

// Fetch and update control states
function setDataControl() {
  const controls = [
    {
      control: controlData["temperature"],
      elements: {
        auto: "thermo-auto",
        manual: "thermo-manual",
        autoBtn: "auto-btn",
        manualBtn: "thermo-btn",
      },
      autoPath: "controls/temperature/auto",
      // manual btn
      manualControlId: "tempHeater",
      manualControlPath: "controls/temperature/manual-control",
      // auto value
      autoControlId: "autoTemperatureValue",
      autoControlPath: "controls/temperature/auto-value",
    },
    {
      control: controlData["light"],
      elements: {
        auto: "light-auto",
        manual: "light-manual",
        autoBtn: "auto-light-btn",
        manualBtn: "light-btn",
      },
      autoPath: "controls/light/auto",
      // manual btn
      manualControlId: "lightSwitch",
      manualControlPath: "controls/light/manual-control",
      // auto value
      autoControlId: "lightautovalue",
      autoControlPath: "controls/light/auto-value",
    },
    {
      control: controlData["soil-moisture"],
      elements: {
        auto: "irrigation-auto",
        manual: "irrigation-manual",
        autoBtn: "auto-irrigation-btn",
        manualBtn: "irrigation-btn",
      },
      autoPath: "controls/soil-moisture/auto",
      // manual btn
      manualControlId: "leftMoisture",
      manualControlPath:
        "controls/soil-moisture/soil-moisture-left/manual-control",
      // auto value
      autoControlId: "soilMoistureAutoValue",
      autoControlPath: "controls/soil-moisture/auto-value",
    },
    {
      control: controlData["humidity"],
      elements: {
        auto: "humidity-auto",
        manual: "humidity-manual",
        autoBtn: "auto-humidity-value",
        manualBtn: "humidity-manual-buttons",
      },
      autoPath: "controls/humidity/auto",
      // manual btn
      manualControlId: "humidifier",
      manualControlPath: "controls/humidity/manual-control",
      // auto value
      autoControlId: "humidityAutoValue",
      autoControlPath: "controls/humidity/auto-value",
    },
    {
      control: controlData["Air Quality"],
      elements: {
        auto: "airQuality-auto",
        manual: "airQuality-manual",
        autoBtn: "auto-airQuality-value",
        manualBtn: "airQuality-manual-buttons",
      },
      autoPath: "controls/Air Quality/auto",
      // manual btn
      manualControlId: "humidifier",
      manualControlPath: "controls/humidity/manual-control",
      // auto value
      autoControlId: "humidityAutoValue",
      autoControlPath: "controls/Air Quality/auto-value",
    },
  ];

  controls.forEach(
    ({
      control,
      elements,
      autoPath,
      manualControlId,
      manualControlPath,
      autoControlId,
      autoControlPath,
    }) => {
      updateControlState(control, elements);
      addClickListener(elements.auto, autoPath, true, elements);
      addClickListener(elements.manual, autoPath, false, elements);
      // manual btn
      addCheckboxListener(manualControlId, manualControlPath);
      initializeSwitch(manualControlPath, manualControlId);
      // Fetch and display auto value
      //getValueFromFirebase(autoControlId, autoControlPath);
      // Update Firebase on change of auto value
      //document
        //.getElementById(autoControlId)
        //.addEventListener("change", function () {
          //sendValueToFirebase(autoControlId, autoControlPath);
        //});
        sendValueToFirebase(autoControlId, autoControlPath);
    }
  );

  // other buttons
  otherButtonListeners();
  checkForOtherButtonListeners();
}

// Fetch data at intervals
function initializeDataFetching() {
  fetchData("sensors", (data) => {
    sensorData = data;
    getReading();
  });
  fetchData("controls", (data) => {
    controlData = data;
    setDataControl();
  });
  // datatable()
}

// Initialize
initializeDataFetching();
setInterval(initializeDataFetching, 3000);

// Get the data tabe Door
function datatable() {
  document.addEventListener("DOMContentLoaded", () => {
    fetch(
      "https://v1.nocodeapi.com/mosalah185/google_sheets/vimNoYBodazusiUd?tabId=SmartGreenHouse"
    )
      .then((response) => response.json())
      .then((data) => {
        const tableBody = document.getElementById("attendance-table");
        data.data.reverse().forEach((row) => {
          // console.log(row.Frist_Name.charAt(0))
          const tr = document.createElement("tr");

          tr.innerHTML = `
                    <td>${row.row_id}</td>
                    <td class="d-flex gap-2">
                    <div class="user-photo">${
                      row.Frist_Name ? row.Frist_Name.charAt(0) : "0"
                    }</div>
                    <div>
                      <h6 class="mb-0 font-13">factor</h6>
                      <p class="m-0 font-12">
                      ${row.Frist_Name + " " + row.Last_Name}
                      </p>
                    </div>
                    </td> 
                    <td>${row.Time_In}</td>
                    <td>${row.Time_Out || ""}</td>
                    <td>${row.Date}</td>
                    <td>
                       <div class="badget badge-outline col-red">Closed</div>
                     </td>              `;

          tableBody.appendChild(tr);
        });
        console.log(data.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  });
}

let addFactorInput = document.getElementById("addFactors");
let removeFactorInput = document.getElementById("removeFactors");


accessControl("addFactorId")
accessControl("removeFactorId")
// Access-control Door
function accessControl(elementId) {
  document.getElementById(elementId).addEventListener("click", function () {
    if (elementId == "addFactorId") {
      let cardId = addFactorInput.value;
      console.log(cardId);
      set(ref(database, `Door/Access_Control/${cardId}`), "allowed");
      document.getElementById("addnoti").classList.remove("invisible");
      setTimeout(() => {
        document.getElementById("closeAddFactorId").click();
        document.getElementById("addnoti").classList.add("invisible");
      }, 1000);
    }else{
      let cardId = removeFactorInput.value;
      console.log(cardId);
      set(ref(database, `Door/Access_Control/${cardId}`), "notallowed");
      document.getElementById("removenoti").classList.remove("invisible");
      setTimeout(() => {
        document.getElementById("closeRemoveFactorId").click();
        document.getElementById("removenoti").classList.add("invisible");
      }, 1000);
    }
  });
}
