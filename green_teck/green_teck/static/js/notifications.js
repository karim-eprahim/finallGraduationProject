// Display and hide the Notifications
let notificationsBtn = document.querySelector(".notificationbtn");
let notificationBadge = document.querySelector(".notificationbtn .badge");
notificationsBtn.addEventListener('click', () => {
  document.querySelector(".notification").classList.toggle("d-none");
});

// Get the reading from Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const appSettings = {
  // databaseURL: "https://test-a17dc-default-rtdb.firebaseio.com/",
  databaseURL: "https://newmotor-esp-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);

let Notifications = {};
let myarray = [];

function fetchData() {
  const sensorsRef = ref(database, "Notifications");

  onValue(sensorsRef, (snapshot) => {
    Notifications = snapshot.val();
    if(Notifications != null){
      myarray = Object.entries(Notifications);
      notificationBadge.innerHTML = myarray.length;
      displayNotifications(myarray);
    }
  });
}
fetchData();
setInterval(fetchData, 5000);

// Function to display notifications
function displayNotifications(notifications) {
  const notificationList = document.querySelector(".list-group");
  notificationList.innerHTML = ''; // Clear existing notifications

  notifications.forEach(notification => {
    const notificationElement = document.createElement('a');
    notificationElement.href = "#";
    notificationElement.classList.add('list-group-item', 'list-group-item-action');

    notificationElement.innerHTML = `
      <div class="d-flex w-100 justify-content-between">
        <h5 class="mb-1">${notification[1].heading}</h5>
        <small>${notification[1].time}</small>
      </div>
      <p class="mb-1">${notification[1].description}</p>
    `;
    
    // Delete individual notification on click
    notificationElement.addEventListener('click', () => {
      deleteNotification(notification[0]);
    });

    notificationList.appendChild(notificationElement);
  });
}

// Function to delete a single notification from Firebase
function deleteNotification(notificationId) {
  let exactLocation = ref(database, `Notifications/${notificationId}`);
  remove(exactLocation);
}

// Event listener for delete all button
const deleteAllButton = document.querySelector(".deleteAllNotifications");
deleteAllButton.addEventListener('click', () => {
  const notificationsRef = ref(database, "Notifications");

  onValue(notificationsRef, (snapshot) => {
    const notifications = snapshot.val();
    if (notifications) {
      Object.keys(notifications).forEach((key) => {
        remove(ref(database, `Notifications/${key}`));
      });
      console.log("All notifications deleted");
    }
  });
});
