# LIFE-BUDDY — GitHub Pages / Browser App

This package keeps the supplied LIFE-BUDDY app and adds the two files needed for a basic
installable Progressive Web App (PWA): `manifest.json` and `service-worker.js`.

## Publish on GitHub Pages
1. Extract this ZIP.
2. Upload **all files and both icons** to the root of your GitHub repository.
3. In GitHub, open **Settings → Pages**.
4. Choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. Open the HTTPS GitHub Pages URL in Chrome on Android.
6. After the first successful online load, use Chrome's menu → **Install app** or
   **Add to Home screen** (the wording may vary).

## Updating the app
When you change the app, replace `index.html` and commit it to GitHub. If you change
the manifest or offline behavior, upload those files too. The service worker caches the
app shell for offline opening after the first online visit. A browser may need a refresh
or a short moment to activate a newly deployed version.

## Data and limitations
The supplied app's records remain in browser `localStorage` on that device/browser.
This PWA package does not add cloud sync, user accounts, server database, or multi-user
security. Browser storage can be cleared by the user or browser, so keep using the app's
built-in backup feature. Offline use requires the app to have been opened online first.

`LIFE-BUDDY-original.html` is an untouched copy of the uploaded source. `index.html`
contains only the PWA manifest metadata and service-worker registration added around
the existing app.
