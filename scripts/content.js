let whitelist = [];

chrome.storage.sync.get(['whitelist'], function(result) {
  if (result.whitelist == null) {
    whitelist = [
      "https://learn.rochester.edu/",
      "https://www.gradescope.com/",
      "https://www.google.com",
      "https://ia800303.us.archive.org/24/items/youtube-xvFZjo5PgG0/xvFZjo5PgG0.mp4"
    ];
  } else {
    whitelist = result.whitelist;
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

// Pick a random URL from the whitelist
const randomUrl = whitelist[Math.floor(Math.random() * whitelist.length)];

chrome.runtime.sendMessage({ 
  action: "switchToWhitelistedTab", 
  url: randomUrl 
});



  // FULL PAGE PERMANENT BLOCKER

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      body { 
        margin: 0 !important; 
        overflow: hidden !important; 
      }
    </style>

    <div id="study-blocker" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #ff6b6b;
      color: white;
      z-index: 999999999;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-family: sans-serif;
    ">
      <div style="
        font-size: 40px;
        font-weight: bold;
        text-align: center;
      ">
        Get back to studying!
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
}
