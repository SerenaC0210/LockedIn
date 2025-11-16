// inject_sidebar.js

let sidebarInjected = false;

// Function to create or update sidebar
function openSidebar(page = 'main/sidebar_main.html') {
    const iframe = document.getElementById('lockedInSidebarFrame');

    if (iframe) {
        // Sidebar already exists — just switch the page
        iframe.src = chrome.runtime.getURL(page);
    } else {
        // Create sidebar iframe
        const newIframe = document.createElement('iframe');
        newIframe.id = 'lockedInSidebarFrame';
        newIframe.src = chrome.runtime.getURL(page);

        newIframe.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            width: 490px;
            height: 100vh;
            border: none;
            z-index: 2147483647;
        `;

        document.body.appendChild(newIframe);
        document.body.style.marginRight = '490px';
        document.body.style.transition = 'margin-right 0.3s ease';

        sidebarInjected = true;
    }
}

// Function to remove sidebar
function removeSidebar() {
    const iframe = document.getElementById('lockedInSidebarFrame');
    if (iframe) {
        iframe.remove();
        document.body.style.marginRight = '0';
        sidebarInjected = false;
    }
}

// Listen for messages from iframe
window.addEventListener('message', (event) => {
    if (event.data.action === 'closeSidebar') {
        removeSidebar();
    } else if (event.data.action === 'switchTab') {
        // removeSidebar();
        openSidebar(event.data.page);
    }
});

// Listen for toggle message from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggleSidebar') {
        if (sidebarInjected) {
            removeSidebar();
        } else {
            openSidebar(); // default page
        }
        sendResponse({ success: true });
    }
});
