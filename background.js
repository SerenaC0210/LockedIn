chrome.action.onClicked.addListener((tab) => {
    chrome.sidePanel.open({ tabId: tab.id });
});


chrome.runtime.onMessage.addListener((msg, sender) => {

    if (msg.action === "openFriends") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const id = tabs[0].id;
  
        chrome.sidePanel.open({ tabId: id }).then(() => {
          chrome.sidePanel.setOptions({
            tabId: id,
            path: "friends/sidebar_friends.html",
          });
        });
      });
    }
  
    if (msg.action === "openLockedIn") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const id = tabs[0].id;
  
        chrome.sidePanel.open({ tabId: id }).then(() => {
          chrome.sidePanel.setOptions({
            tabId: id,
            path: "main/sidebar_main.html",
          });
        });
      });
    }
  });
  