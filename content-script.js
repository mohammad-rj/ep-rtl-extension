// ============== Final Code: For changing the entire page layout ==============

console.log("[CONTENT] Layout-changing content script successfully injected.");

/**
 * Changes the direction of the entire page by setting the 'dir' attribute on the <html> tag.
 * @param {string} direction - Can be 'rtl', 'ltr', or 'auto'.
 */
function changePageDirection(direction) {
    console.log(`[CONTENT] Changing entire page direction to: ${direction}`);

    // document.documentElement refers to the <html> tag.
    const rootElement = document.documentElement;

    if (direction === 'rtl' || direction === 'ltr') {
        // Set the 'dir' attribute for the entire document.
        rootElement.setAttribute('dir', direction);
    } else { // This handles 'auto' or any other value.
        // Remove the 'dir' attribute to revert the page to its default state.
        rootElement.removeAttribute('dir');
    }
}

// Listen for messages from the background script.
browser.runtime.onMessage.addListener((message) => {
    console.log("[CONTENT] Message received from background:", message);
    if (message.command === "apply-direction") {
        changePageDirection(message.direction);
    }
});