# LIFE-BUDDY — Firebase Cloud Version

This package is based on the supplied LIFE-BUDDY app. Existing finance-tracker screens and features are retained. It adds Firebase Email/Password and Google popup sign-in, Firestore cloud sync, local browser caching, first-device local-data migration, and standard browser downloads for PDF/CSV/JSON backup.

## Firebase project already configured

The Web App configuration from the Firebase project screenshot is already entered in `firebase-config.js`:

- Firebase project: `life-buddy-528c4`
- Auth domain: `life-buddy-528c4.firebaseapp.com`
- Authorized GitHub Pages domain: `iroshanekanayake.github.io`

The Firebase Web API key in that file is a public client configuration value. Do not add service-account private keys or Admin SDK credentials to this static website.

## Required Firebase Console setup

1. Authentication → Sign-in method: enable **Email/Password** and **Google**.
2. Google sign-in uses `signInWithPopup()` because this app is hosted on GitHub Pages rather than Firebase Hosting. This avoids the cross-site storage issue that can prevent `signInWithRedirect()` from completing in modern browsers.
3. Authentication → Settings → Authorized domains: confirm `iroshanekanayake.github.io` is listed.
4. Cloud Firestore: create the database if it has not already been created.
5. Firestore → Rules: publish the exact contents of `firestore.rules` in this package. Until these rules are deployed, signed-in users may see `permission-denied` and cloud sync will not work.

The rules allow an authenticated user to read/write only their own `/users/{uid}/private/state` document. All other paths are denied.

## Publish to GitHub Pages

Upload the contents of this folder to the root of the `iroshanekanayake` GitHub Pages repository, replacing the previous `index.html` and `service-worker.js`, and adding `firebase-config.js`, `firestore.rules`, and `firebase.json`. Keep `manifest.json` and both icons. Then open GitHub → Settings → Pages and confirm deployment from the intended branch/root.

Open the HTTPS GitHub Pages URL and refresh once. The service-worker cache version has been bumped so the updated app shell can be fetched.

## First sign-in and data migration

- On the first sign-in on a browser, if this Firebase account has no cloud state yet, the app uploads that browser's existing `dawas-gana-v1` data to the account.
- If the account already has cloud data, the app loads it. Before replacing a non-empty local state on that browser, it keeps a one-time safety copy in localStorage under `life-buddy-pre-cloud-backup`.
- Use the same Firebase account on your other devices to load the same cloud state.
- The app continues to cache state locally. When signed in and online, changes are written to Firestore after a short debounce.

## Important limitations

- The app syncs the complete LIFE-BUDDY state as one Firestore document. Firestore documents have a 1 MiB limit; very large data sets may need a later collection-based migration.
- This version uses last-write-wins whole-state synchronization. Avoid editing the same account simultaneously on multiple devices until a future conflict-aware sync upgrade is added.
- Offline changes remain on that device until connectivity and sign-in return; this build does not merge conflicting offline edits from multiple devices.
- PDF/CSV/JSON exports use standard browser Blob downloads, not an embedded-app download bridge. Android Chrome saves to Downloads. On iPhone Safari, a PDF may open in preview; use Share → Save to Files. After deployment, refresh the app once so the v6 service-worker cache replaces older cached code.
- Scheduled Firestore backups require a paid Blaze plan; the app does not depend on scheduled backups. Use the app's JSON backup export regularly.

## Files

- `index.html` — LIFE-BUDDY app with Firebase authentication and cloud sync.
- `firebase-config.js` — this Firebase project's public Web App configuration.
- `firestore.rules` — per-user Firestore security rules to publish.
- `firebase.json` — Firebase CLI rules deployment configuration.
- `service-worker.js`, `manifest.json`, `icon-192.png`, `icon-512.png` — PWA support.
- `LIFE-BUDDY-original.html` — untouched copy of the supplied source HTML.


## v5 Login and Settings improvements

- Firebase Auth persistence is explicitly set to LOCAL so PWA sign-in survives app restarts.
- A startup loading screen waits for Firebase auth state before showing the login gate, preventing a login-screen flash for signed-in users.
- Account email, cloud sync status, and a confirmation-protected Sign out action are shown inside Settings.
- Login form typography and button sizing are more compact.
- Service-worker cache version is bumped so installed PWAs can receive the updated app shell.

After uploading the updated files, refresh the installed PWA once while online. Existing Firebase users and Firestore data are retained.

## Smart Bill Scanner — local photo privacy version

- Receipt images are saved only in this device/browser using IndexedDB. They are never uploaded to Firebase Storage.
- Only the transaction fields (income/expense, amount, date, category, shop/description and a short OCR text summary) sync through the existing Firestore account state.
- The original photo can be viewed from the transaction on the same device. It is not available on another phone or browser.
- Local bill photos are automatically cleaned up after 180 days when the app next opens. Income/Expense records remain in the account.
- Deleting a transaction also removes its local bill photo.
- If the user clears browser/app storage, uninstalls the PWA, or changes device, local bill photos may be lost. Export/backup of Firestore data does not include these local photos. Keep the original receipt in the phone gallery if it must be retained longer.
- No Firebase Storage bucket, Storage Rules, Blaze upgrade, or Cloud Storage lifecycle configuration is needed for this local-photo design. The app's existing Firebase Authentication and Firestore cloud sync remain unchanged.

OCR uses browser-side Tesseract.js (English-first) to suggest shop/description, date and total. OCR is only a suggestion: users must review and confirm before a transaction is added. JPG, PNG and WebP images up to 10 MB are accepted.

### Data-size note

The app still syncs the complete LIFE-BUDDY state as one Firestore document, with a 1 MiB document limit. Photos are excluded from that document, but transaction metadata and OCR summaries still count toward the limit. A later scaling update should move transaction history into per-user subcollections.
