document.getElementById("closeBtn").addEventListener("click", () => {
    window.close(); // closes the popup
  });

// Switch back to LockedIn tab
document.getElementById("lockedInBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openLockedIn" });
});

// Already on Friends tab, but keep it if needed
document.getElementById("friendsBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openFriends" });
});

document.getElementById("friendsBtn").addEventListener("click", () => {
  chrome.windows.create({
    url: chrome.runtime.getURL("friends/sidebar_friends.html"),
    type: "popup",
    width: 450,
    height: 600
  });
});

document.getElementById("lockedInBtn").addEventListener("click", () => {
  chrome.windows.create({
    url: chrome.runtime.getURL("main/sidebar_main.html"),
    type: "popup",
    width: 450,
    height: 600
  });
});