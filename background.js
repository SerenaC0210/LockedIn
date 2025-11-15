// background.js (optional)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    sendResponse({ result: "ok" });
  });
  

// i don't need to use this anymore - serena