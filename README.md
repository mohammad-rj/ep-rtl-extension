# RTL/LTR Layout Toggle

A lightweight and privacy-focused Firefox add-on that lets you instantly switch any webpage's layout between Left-to-Right (LTR) and Right-to-Left (RTL) with a single right-click.

## Features

- **Instant Layout Switching:** Toggles the entire page direction with one click, perfect for reading RTL content on LTR-designed sites.
- **Smart Context Menu:** The right-click menu option intelligently changes from "Right to Left" to "Back to Default" based on the current page state.
- **Per-Site Memory:** The add-on remembers your preference for each website. If you set a page to RTL, it will automatically be in RTL the next time you visit.
- **100% Private:** Your data is yours. This add-on does not track, collect, or transmit any user data or browsing history.
- **Fully Open Source:** The code is simple, clean, and available for anyone to review and verify.

## How to Use

1.  Right-click anywhere on a webpage.
2.  Select "Right to Left" to switch the layout.
3.  The page will instantly change. If you right-click again, the option will now be "Back to Default" to revert the change.

## Privacy Policy

This add-on is built with your privacy as the top priority.

-   **No Data Collection:** We do not collect, store, or transmit any personal information, browsing history, or user activity.
-   **Local Storage Only:** The *only* data this add-on saves is your layout preference (RTL or LTR) for specific websites. This data is stored **locally on your own computer** using the browser's standard storage API and is never sent over the network.
-   **Minimal Permissions:** The add-on requests only the minimum permissions required to function:
    -   `contextMenus`: To add the option to the right-click menu.
    -   `storage`: To save your per-site preferences locally.
    -   `tabs` & `<all_urls>`: To apply the changes to the webpage.

## License

This project is open source and available under the [MIT License](LICENSE).