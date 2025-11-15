let whitelist = [];

chrome.storage.sync.get(['whitelist'], function(result) {
  if (result.whitelist == null) {
    whitelist = [
      "https://learn.rochester.edu/",
      "https://www.gradescope.com/",
      "https://www.google.com"
    ];
  } else {
    whitelist = result.whitelist
  }
  
  const currentUrl = window.location.href;
  const isWhitelisted = whitelist.some(url => currentUrl.startsWith(url));
  
  if (isWhitelisted) {
    console.log("Whitelisted site - script won't run");
    return;
  }
  
  distraction(document.querySelector("html"));
});

function distraction(query) {
  if (!query) return;

  chrome.runtime.sendMessage({ 
    action: "switchToWhitelistedTab", 
    whitelist: whitelist 
  });

  // const popupUrl = chrome.runtime.getURL("scripts/popup.html");
  // chrome.runtime.sendMessage({ action: "openNewTab", url: popupUrl }); 
  const banner = document.createElement('div');
  banner.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #ff6b6b;
      color: white;
      padding: 15px;
      text-align: center;
      font-size: 18px;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <span style="flex: 1;">Get back to studying!</span>
      <button style="
        position: absolute;
        right: 15px;
        background: transparent;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        font-weight: bold;
        padding: 0;
        width: 30px;
        height: 30px;
        line-height: 1;
      " onclick="this.parentElement.parentElement.remove()">
        ×
      </button>
    </div>
  `;  
  document.body.insertAdjacentElement('afterbegin', banner);
  
  setTimeout(() => banner.remove(), 9000);

  const finalbanner = document.createElement('div');
  finalbanner.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #ff6b6b;
      color: white;
      padding: 15px;
      text-align: center;
      font-size: 18px;
      z-index: 999998;
    ">
      You are not locked in... :(
    </div>
  `;  
  document.body.insertAdjacentElement('afterbegin', finalbanner);
  
  setTimeout(() => finalbanner.remove(), 30000);
}

// distraction(document.querySelector("html"));