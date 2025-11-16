// Filter function to check if URL is accessible
function isAccessibleUrl(url) {
  return url &&
    !url.startsWith('chrome://') &&
    !url.startsWith('chrome-extension://') &&
    !url.startsWith('edge://') &&
    !url.startsWith('about:') &&
    (url.startsWith('http://') || url.startsWith('https://'));
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