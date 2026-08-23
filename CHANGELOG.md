# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.18] - 2026-08-22

### Added
- **Core Reading Engine**: Native W3C Web NFC scanner to poll, extract, and format high-frequency RFID/NFC sectors.
- **Dynamic Parsers**: Customized decoding visualizers for plain text, links, business vCards, Wi-Fi networks, maps coordinates, and raw hex representations.
- **Core Writing Engine**: Modular interfaces to configure, packetize, and program 12 separate NDEF record types onto tags with automated write-verification checksum checks.
- **NDEF Templates**: 20 precompiled built-in write profiles and custom profile exporters/importers using JSON configurations.
- **Hardware Diagnostics & Compatibility Matrix**: Real-time diagnostic checklist and device environment analyzer (screens, browsers, secure origin checks).
- **History Log Streams**: Sandboxed LocalStorage caches tracking scanned/written transactions with CSV/JSON exporters.
- **Web Utilities**: Dynamic client-side QR Code compiler canvas, Base64 codecs, and JSON validator beautifiers.
- **Progressive Web App (PWA)**: Custom `manifest.json`, registered cache-first `/sw.js` Service Worker, responsive vector shortcuts, and offline-first PWA caching.
- **Proprietary & Domain-Restricted License**: Source-available and domain-restricted legal framework under author SouumG.
- **WPA3 & Binary WPS Wi-Fi Payloads**: WPS TLV big-endian binary compilation for native tap-to-connect prompts on Android devices and WPA3 Personal (SAE) security support.

### Changed
- **Pure Client-Side Architecture**: Consolidated zero server data, zero backend database dependencies, zero API keys, and 100% browser-local NFC execution with Google site-verification metadata integration.
- **Original Theme & Visual Aesthetics**: Preserved dark slate glassmorphism theme with adaptive accent engine and responsive light mode support.
- **Authorized Dual Domain Security**: Enforced strict domain restriction authorizing exclusively `nfc.aiue.se` and `www.nfc.aiue.se`.
- **Synchronized Release Footprint**: Consolidated version footprint to `1.1.18` across `package.json`, service worker cache declarations, app components, README, and system documentation.

## [1.1.17] - 2026-07-29

### Changed
- **Collapsible Changelog Interface**: Formatted system changelog history to display only the latest version by default with an interactive toggle dropdown to reveal older versions.
- **Unified Typographic Color Scheme**: Standardized all release headings, tag badges, and list entries to use a single cohesive color palette.
- **Synchronized Release Footprint**: Consolidated version footprint across all components, service worker caches, and documentation.

## [1.1.16] - 2026-07-22

### Changed
- **Authorized Dual Domain & Link Styling**: Expanded the domain restrictions to authorize strictly `nfc.aiue.se` and `www.nfc.aiue.se` with active, interactive clickable hyperlinks.
- **Complete Sitemap & Route Indexing**: Updated `sitemap.xml` with all client-side hash routes (`#about`, `#legal`, `#documentation`) and synchronized timestamps.
- **Pure Serverless Architecture**: Removed unused server-side packages and API dependencies to ensure a 100% client-side serverless application architecture.

## [1.1.15] - 2026-07-14

### Changed
- **Metadata Optimization**: Removed inactive properties from `metadata.json` to keep application configuration aligned with zero-backend architecture.

### Fixed
- **Native Android Wi-Fi Connection Trigger**: Implemented full WPS (Wi-Fi Protected Setup) TLV big-endian binary compilation for native Android tap-to-connect prompts.
- **Cross-Device Wi-Fi Compatibility**: Designed a dual-record sequence compiling native binary WPS record followed by standard text `WIFI:` URI record.
- **CRLF Alignment for vCard & iCalendar**: Corrected line break formatting for vCard contacts and iCalendar schedules to standard network `\r\n` (CRLF).

## [1.1.14] - 2026-07-14

### Added
- **Proprietary & Domain-Restricted License**: Created custom `LICENSE` file under author's official GitHub username **SouumG**.

### Changed
- **Attribution Brand Update**: Replaced all occurrences of author's real name with official GitHub username **SouumG** across all app modules.

## [1.1.13] - 2026-07-14

### Changed
- **Absolute Domain Lock Enforcement**: Completely locked application execution exclusively to official domain hosts.

## [1.1.12] - 2026-07-14

### Added
- **Client-Side Domain Lock**: Implemented client-side domain lock enforcement preventing unauthorized domain hosting.

## [1.1.11] - 2026-07-07

### Fixed
- **Web NFC Scanner/Writer Cleanup**: Resolved critical race condition where fast state changes prematurely aborted the active `AbortController`.
- **Reference Resolution**: Instantiated `NDEFReader` object directly from `window.NDEFReader` to prevent sandboxed iframe reference errors.

## [1.1.10] - 2026-07-07

### Added
- **Interactive Dashboard Fixes**: Wired up all interactive buttons across tools, settings, and dashboard terminals.
- **WPA3 Personal (SAE) Support**: Added native support for WPA3 Personal (SAE) and WPA2/WPA3 Mixed security profiles.

## [1.1.3] - 2026-07-05

### Added
- **Preset Template Sync**: Enabled loading built-in or custom templates directly from the Templates screen into the Write screen's input fields.

## [1.1.2] - 2026-07-04

### Changed
- **Memory Format Options**: Added custom memory capacity input field to NDEF formatting options.

## [1.0.0] - 2026-07-04

### Added
- **Core Reading Engine**: Native scanner to poll, extract, and format high-frequency RFID/NFC sectors.
- **Dynamic Parsers**: Customized decoding visualizers for plain text, links, business vCards, Wi-Fi networks, maps coordinates, and raw hex representations.
- **Core Writing Engine**: Modular interfaces to configure, packetize, and program 12 separate NDEF record types.
- **NDEF Templates**: 20 precompiled built-in write profiles and custom profile exporters/importers.
- **Progressive Web App**: Custom `manifest.json`, registered cache-first Service Worker, and offline PWA support.
