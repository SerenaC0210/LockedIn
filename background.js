// background.js (optional)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openNewTab") {
    chrome.tabs.create({ url: message.url });
  }
});
