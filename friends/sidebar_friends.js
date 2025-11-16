document.getElementById("closeBtn").addEventListener("click", () => {
  window.parent.postMessage({ action: 'closeSidebar' }, '*');
});

// Tab switching - these should stay within the sidebar iframe
document.getElementById("lockedInBtn").addEventListener("click", () => {
  window.location.href = chrome.runtime.getURL("main/sidebar_main.html");
});

document.getElementById("friendsBtn").addEventListener("click", () => {
  console.log("Already on Friends tab");
});