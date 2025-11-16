// Close button sends message to parent page
document.getElementById("closeBtn").addEventListener("click", () => {
  window.parent.postMessage({ action: 'closeSidebar' }, '*');
});

// Remove the window.create calls for friendsBtn and lockedInBtn
// These tabs will work within the same sidebar

// DROPDOWN TOGGLE
const whitelistHeader = document.getElementById("whitelistHeader");
const whitelistContent = document.getElementById("whitelistContent");

whitelistHeader.addEventListener("click", () => {
  whitelistContent.classList.toggle("hidden");
  let arrow = whitelistHeader.querySelector(".arrow");
  arrow.textContent = whitelistContent.classList.contains("hidden") ? "▼" : "▲";
});

// WHITELIST MANAGEMENT
const whitelistBox = whitelistContent.querySelector(".box");

chrome.storage.local.get(["whitelistedSites"], (result) => {
  const sites = result.whitelistedSites || [];
  sites.forEach(site => addWebsiteToList(site));
  addInputField();
});

function addWebsiteToList(url) {
  const siteDiv = document.createElement("div");
  siteDiv.className = "website-item";
  
  const urlText = document.createElement("span");
  urlText.textContent = url;
  urlText.className = "website-url";
  
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "×";
  removeBtn.className = "remove-btn";
  removeBtn.addEventListener("click", () => {
    siteDiv.remove();
    saveWhitelist();
  });
  
  siteDiv.appendChild(urlText);
  siteDiv.appendChild(removeBtn);
  whitelistBox.appendChild(siteDiv);
}

function addInputField() {
  const inputDiv = document.createElement("div");
  inputDiv.className = "website-input";
  
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Add Website";
  input.className = "add-website-input";
  
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      const url = input.value.trim();
      const inputDiv = input.parentElement;
      whitelistBox.insertBefore(createWebsiteItem(url), inputDiv);
      input.value = "";
      saveWhitelist();
    }
  });
  
  inputDiv.appendChild(input);
  whitelistBox.appendChild(inputDiv);
}

function createWebsiteItem(url) {
  const siteDiv = document.createElement("div");
  siteDiv.className = "website-item";
  
  const urlText = document.createElement("span");
  urlText.textContent = url;
  urlText.className = "website-url";
  
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "×";
  removeBtn.className = "remove-btn";
  removeBtn.addEventListener("click", () => {
    siteDiv.remove();
    saveWhitelist();
  });
  
  siteDiv.appendChild(urlText);
  siteDiv.appendChild(removeBtn);
  
  return siteDiv;
}

function saveWhitelist() {
  const sites = [];
  whitelistBox.querySelectorAll(".website-item .website-url").forEach(span => {
    sites.push(span.textContent);
  });
  chrome.storage.local.set({ whitelistedSites: sites });
}

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
  s--;
  if (s < 0) { s = 59; m--; } 
  if (m < 0) { m = 59; h--; }
  if (h < 0) {
    clearInterval(timerInterval);
    timerRunning = false;
    return;
  }
  timeDisplay.textContent =
      `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

document.getElementById("lockIn").addEventListener("click", () => {
  if (!timerRunning) {
      timerRunning = true;
      timerInterval = setInterval(updateTimer, 1000);
  }
});