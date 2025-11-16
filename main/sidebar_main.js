// Close button sends message to parent page
document.getElementById("closeBtn").addEventListener("click", () => {
  window.parent.postMessage({ action: 'closeSidebar' }, '*');
});

// TAB SWITCHING
document.getElementById("lockedInBtn").addEventListener("click", () => {
  window.parent.postMessage({ action: 'switchTab', page: '../main/sidebar_main.html' }, '*');
});

document.getElementById("friendsBtn").addEventListener("click", () => {
  window.parent.postMessage({ action: 'switchTab', page: '../friends/sidebar_friends.html' }, '*');
});

// DROPDOWN TOGGLE
const whitelistHeader = document.getElementById("whitelistHeader");
const whitelistContent = document.getElementById("whitelistContent");

whitelistHeader.addEventListener("click", () => {
  whitelistContent.classList.toggle("hidden");
  let arrow = whitelistHeader.querySelector(".arrow");
  arrow.textContent = whitelistContent.classList.contains("hidden") ? "\u2193" : "\u2191";
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
  removeBtn.textContent = "x";
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
  removeBtn.textContent = "x";
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

// TODO LIST MANAGEMENT (same structure as whitelist)
const todoHeader = document.getElementById("todoHeader");
const todoContent = document.getElementById("todoContent");
const todoBox = todoContent.querySelector(".box");

todoHeader.addEventListener("click", () => {
  todoContent.classList.toggle("hidden");
  let arrow = todoHeader.querySelector(".arrow");
  arrow.textContent = todoContent.classList.contains("hidden") ? "\u2193" : "\u2191";
});

// Load saved todos
chrome.storage.local.get(["todos"], (result) => {
    const todos = result.todos || [];
    todos.forEach(text => addTodoToList(text));
    addTodoInputField();
});

function addTodoToList(text) {
    const item = createTodoItem(text);
    todoBox.insertBefore(item, todoBox.querySelector(".todo-input"));
}

function createTodoItem(text) {
    const itemDiv = document.createElement("div");
    itemDiv.className = "website-item"; // same styling

    const textSpan = document.createElement("span");
    textSpan.textContent = text;
    textSpan.className = "website-url";
    textSpan.contentEditable = true;
    textSpan.addEventListener("blur", saveTodos);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "x";
    removeBtn.className = "remove-btn";
    removeBtn.addEventListener("click", () => {
        itemDiv.remove();
        saveTodos();
    });

    itemDiv.appendChild(textSpan);
    itemDiv.appendChild(removeBtn);
    return itemDiv;
}

function addTodoInputField() {
    const inputDiv = document.createElement("div");
    inputDiv.className = "todo-input";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Add Task";
    input.className = "add-website-input"; // same styling

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && input.value.trim()) {
            const text = input.value.trim();
            todoBox.insertBefore(createTodoItem(text), inputDiv);
            input.value = "";
            saveTodos();
        }
    });

    inputDiv.appendChild(input);
    todoBox.appendChild(inputDiv);
}

function saveTodos() {
    const todos = [];
    todoBox.querySelectorAll(".website-item .website-url").forEach(span => {
        todos.push(span.textContent);
    });
    chrome.storage.local.set({ todos });
}


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