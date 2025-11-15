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