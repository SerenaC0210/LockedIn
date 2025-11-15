// Close side panel
document.getElementById("closeBtn").addEventListener("click", () => {
  chrome.sidePanel.setOptions({ enabled: false });
});

// Switch to Friends
document.getElementById("friendsBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "openFriends" });
});

// Switch to LockedIn
document.getElementById("lockedInBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "openLockedIn" });
});

// DROPDOWN TOGGLE
const whitelistHeader = document.getElementById("whitelistHeader");
const whitelistContent = document.getElementById("whitelistContent");

whitelistHeader.addEventListener("click", () => {
  whitelistContent.classList.toggle("hidden");

  let arrow = whitelistHeader.querySelector(".arrow");
  arrow.textContent = whitelistContent.classList.contains("hidden") ? "▼" : "▲";
});

// TODO EDIT MODE
const editButton = document.getElementById("edit");
const todoList = document.getElementById("todoList");

editButton.addEventListener("click", () => {
  const li = document.createElement("li");
  li.contentEditable = true;
  li.textContent = "New Task";
  todoList.appendChild(li);
  li.focus();
});

// TIMER FUNCTIONALITY
let timerRunning = false;
let timerInterval = null;

const timeDisplay = document.getElementById("timeDisplay");

function parseTime() {
  let parts = timeDisplay.textContent.split(":").map(n => parseInt(n));
  if (parts.length !== 3) return [0, 0, 0];
  return parts;
}

function updateTimer() {
  let [h, m, s] = parseTime();
  s++;
  if (s >= 60) { s = 0; m++; }
  if (m >= 60) { m = 0; h++; }

  timeDisplay.textContent =
      `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

document.getElementById("lockIn").addEventListener("click", () => {
  if (!timerRunning) {
      timerRunning = true;
      timerInterval = setInterval(updateTimer, 1000);
  }
});
