function distraction(query) {
  if (!query) return;

  const popupUrl = chrome.runtime.getURL("scripts/popup.html");
  chrome.runtime.sendMessage({ action: "openNewTab", url: popupUrl }); 
}

distraction(document.querySelector("html"));