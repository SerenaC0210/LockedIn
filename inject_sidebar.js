// inject_sidebar.js

let sidebarInjected = false;

function createSidebar() {
    if (sidebarInjected) return;
    
    const iframe = document.createElement('iframe');
    iframe.id = 'lockedInSidebarFrame';
    iframe.src = chrome.runtime.getURL('main/sidebar_main.html');
    
    iframe.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        width: 490px;
        height: 100vh;
        border: none;
        z-index: 2147483647;
        box-shadow: -2px 0 10px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(iframe);
    document.body.style.marginRight = '490px';
    document.body.style.transition = 'margin-right 0.3s ease';
    
    sidebarInjected = true;
}

function removeSidebar() {
    const iframe = document.getElementById('lockedInSidebarFrame');
    if (iframe) {
        iframe.remove();
        document.body.style.marginRight = '0';
        sidebarInjected = false;
    }
}

// Listen for close message from iframe
window.addEventListener('message', (event) => {
    if (event.data.action === 'closeSidebar') {
        removeSidebar();
    }
});

// Listen for toggle message from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggleSidebar') {
        if (sidebarInjected) {
            removeSidebar();
        } else {
            createSidebar();
        }
        sendResponse({ success: true });
    }
});