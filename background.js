// ============== Final Code: Using two separate menu items ==============

const MENU_ID_SET_RTL = "set-layout-rtl";
const MENU_ID_SET_LTR = "set-layout-ltr";

/**
 * Updates the visibility of the context menu items based on the current direction.
 * @param {string} currentDirection - The current direction ('rtl' or 'ltr').
 */
function updateMenuVisibility(currentDirection) {
    const isRtl = (currentDirection === 'rtl');

    // If the current direction is RTL, show the "Back to Default" menu and hide the "Right to Left" menu.
    browser.contextMenus.update(MENU_ID_SET_LTR, { visible: isRtl });
    browser.contextMenus.update(MENU_ID_SET_RTL, { visible: !isRtl });
}

// 1. On installation, create both menu items but keep one hidden.
browser.runtime.onInstalled.addListener(() => {
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
});

// 2. Handle clicks on either menu item.
browser.contextMenus.onClicked.addListener((info, tab) => {
    const domain = new URL(tab.url).hostname;
    if (!domain) return;

    // The new direction is determined by which menu item was clicked.
    const newDir = (info.menuItemId === MENU_ID_SET_RTL) ? 'rtl' : 'ltr';

    browser.storage.local.set({ [domain]: newDir });
    browser.tabs.sendMessage(tab.id, { command: "apply-direction", direction: newDir })
        .catch(e => console.error(e));

    // Update the menu visibility based on the new direction.
    updateMenuVisibility(newDir);
});

// 3. Handle tab loading and updates to apply saved settings.
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith("http")) {
        const domain = new URL(tab.url).hostname;

        browser.storage.local.get(domain).then(result => {
            const savedDir = result[domain] || 'ltr'; // Default to 'ltr' if nothing is saved.

            // Set the correct menu visibility based on the saved or default state.
            updateMenuVisibility(savedDir);

            // If the saved direction was 'rtl', apply it to the page.
            if (savedDir === 'rtl') {
                browser.tabs.sendMessage(tabId, { command: "apply-direction", direction: 'rtl' })
                    .catch(e => console.error(e));
            }
        });
    }
});