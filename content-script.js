// ============== Final Code: For changing the entire page layout ==============

console.log("[CONTENT] Layout-changing content script successfully injected.");

/**
 * Changes the direction of the entire page by setting the 'dir' attribute on the <html> tag.
 * @param {string} direction - Can be 'rtl', 'ltr', or 'auto'.
 */
function changePageDirection(direction) {
    console.log(`[CONTENT] Changing entire page direction to: ${direction}`);

    if (direction === 'rtl') {
        // If the direction is RTL, we need to add our stylesheet.
        // But only if it doesn't already exist.
        if (!existingStyleElement) {
            const linkElement = document.createElement('link');
            linkElement.id = styleId;
            linkElement.rel = 'stylesheet';
            linkElement.type = 'text/css';
            linkElement.href = browser.runtime.getURL('rtl-styler.css');
            
            document.head.appendChild(linkElement);
            console.log('[CONTENT] RTL font styler has been added.');
        }
    } else {
        // If the direction is NOT RTL ('ltr'), we should remove our stylesheet.
        // But only if it exists.
        if (existingStyleElement) {
            existingStyleElement.remove();
            console.log('[CONTENT] RTL font styler has been removed.');
        }
    }
}


// Listen for messages from the background script.
browser.runtime.onMessage.addListener((message) => {
    console.log("[CONTENT] Message received from background:", message);
    if (message.command === "apply-direction") {
        changePageDirection(message.direction);
    }
});