# NFC Writer — Contactless NDEF Developer Suite Pro (v1.1.13)

URL: [https://nfc.aiue.se/](https://nfc.aiue.se/)

NFC Writer is a production-grade, highly optimized Progressive Web Application (PWA) designed for scanning, programming, formatting, and analyzing Near Field Communication (NFC) RFID transponders operating under the High-Frequency (HF) 13.56 MHz band.

This application is built entirely client-side using **React 18**, **Vite**, and **Tailwind CSS v4** to deliver near-instantaneous offline operations, responsive telemetry, and highly precise NDEF structure representation.

---

## The Web NFC API & Hardware Compatibility

### The Challenge of Native Web NFC
The native **W3C Web NFC API** allows web applications to read and write Near Field Communication (NFC) tags. However, the standard is heavily sandboxed and restricted by modern browser vendors:
1. **Device Compatibility:** It is exclusively supported on **Google Chrome, Opera, and Microsoft Edge for Android**.
2. **Desktop & Apple iOS Constraints:** Desktop operating systems (macOS, Windows, Linux) do not expose NFC reader chips to browsers. Furthermore, Apple iOS restricts native browser access to the device NFC controller, reserving core RFID access for native App Store applications.
3. **Context Security:** Web NFC will only compile and execute under secure cryptographic **HTTPS** origins.

---

## Comprehensive Feature Set (11-Point Matrix)

NFC Writer fully implements and documents the maximum bounds of web-accessible RFID capabilities:

1. **Read NFC Tags (NDEF Parsing):** High-fidelity, real-time reader parses physical NDEF records and extracts plain text, web URLs, phone directory sequences (`tel:`), email structures, SMS drafts, Wi-Fi configurations, and raw JSON payloads.
2. **Write NFC Tags (NDEF Encoding):** Custom programmer compiles inputs into standardized NDEF byte streams, writing them directly to the contactless chip.
3. **Overwrite NFC Tags:** Allows modifying or completely replacing old NDEF structures on physical tags, provided the sector blocks have not been set to permanent read-only status.
4. **Erase NFC Tags:** Simulates and executes standard tag clearing by overwriting active memory sectors with a clean, empty text record to safely wipe old data blocks.
5. **Format NFC Tags:** Establishes a clean, initialized NDEF container registry on raw, unformatted, or corrupted transponders to prepare them for future writes.
6. **Lock NFC Tags (Read-Only):** Explains hardware locking constraints. Permanent, irreversible write-protection is highly hardware-dependent and generally managed via native OS-level toolsets.
7. **Multi-Record Tag Support:** Allows reading, writing, and parsing multiple distinct payloads (e.g., a Wi-Fi setup, a GPS coordinate, and a vCard business card) on a single physical tag.
8. **NFC Trigger Actions:** Automatically triggers native smartphone actions on contact (e.g., instantly dialing a number, launching maps coordinates, or opening a website).
9. **Secure Sandbox Protection:** Fully adheres to W3C privacy guidelines, requiring active browser tab visibility and deliberate user gestures (buttons/modals) to arm the transceiver.
10. **Device Matrix Compatibility:** Evaluates device specifications and provides helpful notifications and fallback instructions for incompatible browser engines.
11. **Strict Hardware Controls (What You Cannot Do):** Explicitly outlines standard OS security restrictions. No web browser can toggle device Wi-Fi/Bluetooth adapters, control hardware features like the camera flash, or bypass manufacturer-locked chip UIDs.

---

## Technical Architecture & Project Structure

The codebase is engineered with high modularity and robust separation of concerns:

- `/src/main.tsx`: Entry point. Registers the Progressive Web App (PWA) Service Worker, setting up automated background updates.
- `/src/components/ReadView.tsx`: Real-time Web NFC scanner, complete with Hex-dumps, record parsing, and telemetry diagnostics.
- `/src/components/WriteView.tsx`: Core NDEF programmer. Offers 11 distinct input types and preset template loading.
- `/src/components/ToolsView.tsx`: Advanced utility toolkit for developers, including SSID encryption generators, vCard builders, and URL shorteners.
- `/src/components/DocumentationView.tsx`: Centralized developer guide outlining chip architectures, protocol limits, and Web NFC specifications.
- `/src/data.ts`: Shared constants, utility string generators, and the 20 precompiled NFC templates.
- `/public/sw.js`: Custom Service Worker. Configured with a robust **Network-First offline-fallback pipeline** to ensure live assets are prioritized while maintaining 100% offline functionality.

---

## Local Development & Deployment

Run this application locally or deploy it to any static web server:

```bash
# 1. Install dependencies
npm install

# 2. Boot local development server (binds automatically to port 3000)
npm run dev

# 3. Compile and bundle optimized, production-ready static assets
npm run build

# 4. Run TypeScript syntax and static linter checks
npm run lint
```

Upon executing `npm run build`, all compiled static assets, the web app manifest, icon sets, and the active service worker are generated inside the `/dist` directory. This directory is 100% self-contained and ready to be hosted at [https://nfc.aiue.se/](https://nfc.aiue.se/).

---

## Security & Privacy Policy

NFC Writer is designed with a strict zero-trust privacy model:
- **100% Client-Side:** No databases, background APIs, or telemetry log servers are implemented.
- **No Third-Party Cookies:** Zero tracking scripts, trackers, or marketing pixels are loaded.
- **Secure Storage:** All scanned tags, saved template directories, and activity logs reside strictly inside the browser's sandboxed `LocalStorage` client-side cache and never leave your device.
