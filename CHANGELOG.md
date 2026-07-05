# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.3] - 2026-07-05

### Added
- **Preset Template Sync**: Enabled loading built-in or custom templates directly from the Templates screen into the Write screen's input fields.

### Fixed
- **Iframe Sandbox Compatibility**: Resolved critical `SecurityError` and DOM exception crashes by wrapping browser environment checks and `NDEFReader` operations in secure `try-catch` structures. This ensures the app operates smoothly in sandboxed `iframe` containers (such as the Google AI Studio live preview).

## [1.1.2] - 2026-07-04

### Changed
- **Memory Format Options**: Added a custom memory capacity input field to the NDEF formatting options, allowing users to write to non-standard capacities instead of strictly 144B, 504B, or 888B tags.
- **Sidebar Blur**: Removed the background blur on the mobile sidebar overlay to improve legibility and responsiveness during navigation.

## [1.2.1] - 2026-07-04

### Added
- **Web NFC Specs & Simulator Documentation**: Added an active software-level explanation detailing exactly why the simulator exists and how it enables testing on desktop platforms (macOS/Windows) and Safari on iOS.
- **Hardware Limitations Matrix**: Outlined an 11-point system matrix detailing Web NFC capabilities and standard OS sandboxing limits (what physical tags can do vs. what browsers are security-barred from executing, e.g. Wi-Fi adapter or screen brightness toggles).

### Changed
- **Erase Tag Payload definition**: Enhanced erase operations to safely overwrite tags with clean, standardized empty text record blocks.
- **SW Update Lifecycles**: Integrated automated byte-for-byte check triggers inside the main registration flow to activate code changes instantly.

### Fixed
- **Simulator memory leak prevention**: Added standard `useRef` array trackers to clear simulated writing timeouts when component pages are unmounted.

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
