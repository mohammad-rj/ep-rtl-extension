const MENU_ID_SET_RTL = "set-layout-rtl";
const MENU_ID_SET_LTR = "set-layout-ltr";

/**
 * Creates the context menu items for the extension.
 * This function is called on startup.
 */
function setupContextMenus() {
    // Remove all existing menus for this extension to avoid duplicates on reload.
    browser.contextMenus.removeAll(() => {
        // Main menu item to switch to RTL mode.
        browser.contextMenus.create({
            id: MENU_ID_SET_RTL,
            title: "Right to Left",
            contexts: ["page"],
            visible: true // This one is visible by default.
        });

        // Second menu item to switch back to default (LTR) mode.
        browser.contextMenus.create({
            id: MENU_ID_SET_LTR,
            title: "Back to Default",
            contexts: ["page"],
            visible: false // This one is hidden by default.
        });
        console.log("Context menus created successfully.");
    });
}

/**
 * Updates the visibility of the context menu items based on the current direction.
 * @param {string} currentDirection - The current direction ('rtl' or 'ltr').
 */
function updateMenuVisibility(currentDirection) {
    const isRtl = (currentDirection === 'rtl');
    browser.contextMenus.update(MENU_ID_SET_LTR, { visible: isRtl });
    browser.contextMenus.update(MENU_ID_SET_RTL, { visible: !isRtl });
    browser.contextMenus.refresh(); // Important to apply visibility changes immediately.
}

/**
 * Injects the content script logic into a tab to change its direction.
 * @param {number} tabId - The ID of the target tab.
 * @param {string} direction - The direction to apply ('rtl' or 'ltr').
 */
function applyDirectionToTab(tabId, direction) {
    browser.scripting.executeScript({
        target: { tabId: tabId },
        func: (dir) => {
            // This function is executed in the content page context.
            if (dir === 'rtl' || dir === 'ltr') {
                document.documentElement.setAttribute('dir', dir);
            } else {
                document.documentElement.removeAttribute('dir');
            }
        },
        args: [direction]
    }).catch(e => console.error(`Failed to execute script: ${e}`));
}


// --- Event Listeners ---

// 1. Setup the context menus when the extension is first installed or the browser starts.
// The `onInstalled` listener is still good for one-time setup.
browser.runtime.onInstalled.addListener(() => {
    setupContextMenus();
});

// For Manifest V3, background scripts (service workers) can be terminated.
// We need to ensure menus are set up every time it starts.
// The `onInstalled` listener handles the first time, but we call it here too
// for subsequent browser startups where the extension is already installed.
setupContextMenus();


// 2. Handle clicks on either menu item.
browser.contextMenus.onClicked.addListener((info, tab) => {
    // Ignore clicks on pages where scripts can't run, like about: pages.
    if (!tab.url || !tab.url.startsWith("http")) {
        return;
    }

    const domain = new URL(tab.url).hostname;
    const newDir = (info.menuItemId === MENU_ID_SET_RTL) ? 'rtl' : 'ltr';

    // Save the preference for this domain.
    browser.storage.local.set({ [domain]: newDir });

    // Apply the change to the current tab.
    applyDirectionToTab(tab.id, newDir);

    // Update the menu visibility to reflect the new state.
    updateMenuVisibility(newDir);
});

// 3. Handle tab loading and updates to apply saved settings.
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Apply settings only when the tab has finished loading and has a valid URL.
    if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith("http")) {
        const domain = new URL(tab.url).hostname;

        browser.storage.local.get(domain).then(result => {
            const savedDir = result[domain] || 'ltr'; // Default to 'ltr' if nothing is saved.

            // Set the correct menu visibility for the current tab's state.
            updateMenuVisibility(savedDir);

            // If the saved direction was 'rtl', apply it to the page.
            if (savedDir === 'rtl') {
                applyDirectionToTab(tabId, 'rtl');
            }
        }).catch(e => console.error(`Error getting storage: ${e}`));
    }
});