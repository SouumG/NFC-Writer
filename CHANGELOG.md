# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-04

### Added
- **Core Reading Engine**: Native scanner to poll, extract, and format high-frequency RFID/NFC sectors.
- **Dynamic Parsers**: Customized decoding visuals for plain text, links, business vCards, Wi-Fi networks, maps coordinates, and raw hex representations.
- **Core Writing Engine**: Modular interfaces to configure, packetize, and program 12 separate NDEF record types onto tags with automated write-verification checksum checks.
- **NDEF Templates**: 20 precompiled built-in write profiles and custom profile exporters/importers using JSON configurations.
- **Hardware Diagnostics**: Real-time diagnostic checklist and device environment analyzer (screens, browsers, secure origin checks).
- **History log streams**: Sandboxed LocalStorage caches tracking scanned/written transactions with CSV/JSON exporters.
- **Web Utilities**: Dynamic client-side QR Code compiler canvas, Base64 codecs, and JSON validator beautifiers.
- **Progressive Web App**: Custom `manifest.json`, Registered Cache-First `/sw.js` Service Worker, responsive vector shortcuts, and splash configurations.
- **Legal & Help Directories**: Standard FAQ accordion drawers, chip register specifications (NTAG213 vs 215 vs 216), Terms of Service, and Privacy Policy files.
