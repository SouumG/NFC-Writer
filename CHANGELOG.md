# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.15] - 2026-07-14

### Changed
- **Metadata Optimization**: Removed the inactive `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` capability from `metadata.json` to keep the application configuration fully aligned with its zero-backend, client-only PWA architecture.

### Fixed
- **Native Android Wi-Fi Connection Trigger**: Implemented full WPS (Wi-Fi Protected Setup) TLV big-endian binary compilation for the `application/vnd.wfa.wsc` MIME record type. This triggers native, automated connection dialog prompts on Android devices upon tag contact.
- **Cross-Device Wi-Fi Backwards Compatibility**: Designed a dual-record sequence compiling the native binary WPS record followed immediately by a standard text-based `WIFI:` URI record, resolving third-party scanning app parsing limits on other platforms (e.g., iOS).
- **CRLF Alignment for vCard & iCalendar**: Corrected the line break formatting for both vCard contacts (`text/vcard`) and iCalendar schedules (`text/calendar`) from Unix `\n` to standard network `\r\n` (CRLF), guaranteeing flawless scanning and integration on major mobile operating systems.

## [1.1.14] - 2026-07-14

### Added
- **Proprietary & Domain-Restricted License**: Created a custom `LICENSE` file under the author's official GitHub username **SouumG**. The license grants viewing and local execution rights, but strictly prohibits unauthorized public hosting or deployment under any domain other than `nfc.aiue.se` without prior written permission, whilst enforcing prominent attribution and credit.

### Changed
- **Attribution Brand Update**: Replaced all occurrences of the author's real name with their official GitHub username **SouumG** across all app modules, licensing agreements, documentation files, and the primary application workspace.

## [1.1.13] - 2026-07-14

### Changed
- **Absolute Domain Lock Enforcement**: Completely removed development, sandbox, and local testing domain bypass allowances. The application is now exclusively locked to run under `nfc.aiue.se` with zero exceptions.

## [1.1.12] - 2026-07-14

### Added
- **Client-Side Domain Lock**: Implemented client-side domain lock enforcement preventing the application from running on unauthorized public domains. Added built-in exceptions for localhost and dev/preview sandbox frame environments to preserve rapid local iteration and testing.

## [1.1.11] - 2026-07-07

### Fixed
- **Web NFC Scanner/Writer Cleanup**: Resolved a critical race condition where changing internal React states (e.g. from idle to scanning or compiling) immediately triggered the `useEffect` cleanup hook, prematurely aborting the active `AbortController` and causing instant scan/write cancellations and crashes.
- **Reference Resolution**: Instantiated the `NDEFReader` object directly from `window.NDEFReader` to prevent global constructor references from raising reference errors in sandboxed browser frames.

## [1.1.10] - 2026-07-07

### Added
- **Interactive Dashboard Fixes**: Wired up all interactive and placeholder buttons across the tools, settings, and dashboard terminals with appropriate native-like event triggers, dialogs, and user feedback.
- **WPA3 Personal (SAE) Support**: Added native support for WPA3 Personal (SAE) and WPA2/WPA3 Mixed security profiles to maximize device compatibility.
- **Web NFC Scanning Improvements**: Optimized Web NFC scanning states, native reader initialization diagnostics, and updated Wi-Fi connection NDEF string generation and parser components for backward compatibility.

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
