document.getElementById("closeBtn").addEventListener("click", () => {
    chrome.sidePanel.setOptions({ enabled: false });
});

// Switch back to LockedIn tab
document.getElementById("lockedInBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openLockedIn" });
});

// Already on Friends tab, but keep it if needed
document.getElementById("friendsBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openFriends" });
});

