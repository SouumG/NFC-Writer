# NFC Writer — Contactless NDEF Suite Pro (v1.0.0)

URL: [https://nfc.aiue.se/](https://nfc.aiue.se/)

NFC Writer is a high-performance, responsive Progressive Web App (PWA) client-only suite designed for programming, reading, formatting, and analyzing Near Field Communication (NFC) RFID chips under standard high-frequency channels (13.56 MHz).

## 🌟 Core Features

- **Read NFC Tag Scanner**: High-fidelity scanner reads physical NTAG registers, decodes NDEF packets, parses vCards, identifies Wi-Fi connections, maps coordinates, parses JSON, and toggles real-time hexadecimal hex-dumps.
- **Write NFC Tag Encoder**: Programs Plain Text, URLs, dial triggers, Email dispatchers, SMS, vCard business contact layouts, Wi-Fi credentials, Calendar events, GPS coordinates, JSON blocks, and Android App Launchers (AAR).
- **NDEF Templates Directory**: 20 precompiled system profiles (Wi-Fi networks, portfolios, emergency hotlines) alongside user templates that can be saved, edited, deleted, and exported/imported to JSON files.
- **Diagnostics Dashboard**: Real-time assessment of device hardware, Web NFC API availability, Cryptographic origins (HTTPS), touch specs, language locales, and permission lists.
- **Offline PWA Engine**: Built with a registered service worker cache interceptor and a web manifest, permitting fully offline launching, standalone homescreen configurations, and custom splash launches.
- **Activity Log History**: Cache files holding scanned/written transactions. Supports searches, favorite items, full detail inspectors, and exports to CSV and JSON formats.

## ⚙️ Development Commands

This applet runs entirely client-side using React, Vite, and Tailwind CSS v4:

```bash
# Install dependencies
npm install

# Boot development server (binding to port 3000)
npm run dev

# Compile production-ready static assets (output folder: /dist)
npm run build

# Run TypeScript linter checks
npm run lint
```

Once `npm run build` is executed, all compiled static assets alongside robots, sitemaps, manifests, and service workers are output to the `/dist` directory. This directory is 100% production-ready to be zipped and uploaded directly to [https://nfc.aiue.se/](https://nfc.aiue.se/).

## 🔒 Security and Privacy

NFC Writer operates 100% locally. Zero server calls, zero database storage pipelines, and zero third-party cookie tags are loaded. Your credentials and logs stay strictly inside sandboxed LocalStorage cache structures on your browser.
