// background.js (optional)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openNewTab") {
    chrome.tabs.create({ url: message.url });
  } else if (message.action === "switchToWhitelistedTab") {
    findTabByUrl(message.whitelist);
  }
});

function findTabByUrl(matches) {
  chrome.tabs.query({}, function(tabs) {
    let foundTab = null;
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].url) {
        for (let j = 0; j < matches.length; j++) {
          if (tabs[i].url.includes(matches[j])) {
            foundTab = tabs[i];
            break;
          }
        }
      }
    }

    if (foundTab) {
      console.log("Tab with URL found: ", foundTab);
      chrome.tabs.update(foundTab.id, { active: true });
    } else {
      console.log("Tab with URL not found.");
      chrome.tabs.create({ url: matches[0] });
    }
  });
}

// Filter function to check if URL is accessible
function isAccessibleUrl(url) {
  return url &&
    !url.startsWith('chrome://') &&
    !url.startsWith('chrome-extension://') &&
    !url.startsWith('edge://') &&
    !url.startsWith('about:')
}

// Listen for icon clicks
chrome.action.onClicked.addListener((tab) => {
  // Check if the tab URL is accessible
  if (!isAccessibleUrl(tab.url)) {
    console.log('Cannot inject sidebar on this page');
    return;
  }

  // Send message to toggle sidebar
  chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' })
    .catch(err => {
      console.log('Content script not loaded yet');
    });
});


console.log("🔥 background.js loaded");

chrome.runtime.onMessage.addListener((msg, sender) => {
  console.log("📥 Background received:", msg);

  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (!tabs.length) return;

    chrome.tabs.sendMessage(tabs[0].id, msg);
  });
});
