import React from 'react';
import { Bookmark, ShieldAlert, Cpu, Heart, Code2 } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="space-y-6">
      
      {/* Header title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-900/30 border border-gray-800/40 rounded-xl p-5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-blue-400" />
            <span>About NFC Writer Suite</span>
          </h2>
          <p className="text-xs text-gray-400">
            Read development metrics, release versions, credits, and the structural changelog history.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: About product details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-gray-200">Contactless Engineering Built Client-Side</h3>
            <div className="text-xs text-gray-400 leading-relaxed space-y-3 select-text">
              <p>
                NFC Writer (v1.1.15) is a robust, full-stack client-side Progressive Web Application designed for programming, scanning, parsing, and diagnosing high-frequency RFID/NFC chips. Built entirely in React and styled with a glassmorphism theme, this applet operates 100% locally on your browser.
              </p>
              <p>
                By avoiding backend databases, your personal Wi-Fi configurations, phone lines, coordinates, or vCard details are never uploaded or synced to external servers, guaranteeing maximum privacy and cryptographic security.
              </p>
            </div>
            
            <div className="pt-2 flex items-center gap-1.5 text-xs text-gray-500 font-mono">
              <Code2 className="w-4 h-4 text-gray-600" />
              <span>Made with React 19, TypeScript, and Tailwind v4.</span>
            </div>
          </div>

          {/* Changelog list */}
          <div className="glass-panel rounded-xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 pb-2 border-b border-gray-800">
              System Changelog History
            </h3>

            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-200">v1.1.15</span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">• Native Android Wi-Fi WPS Payload &amp; CRLF Alignment</span>
                </div>
                <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                  <li>Implemented fully spec-compliant binary WPS (Wi-Fi Protected Setup) payload compilation for native tap-to-connect triggers on Android.</li>
                  <li>Maintained dual-record writing with plain URI string fallback for cross-device scanner app compatibility.</li>
                  <li>Corrected vCard and iCalendar record streams to use standard CRLF line endings to improve device parsing.</li>
                </ul>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-200">v1.1.14</span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">• Added Proprietary License &amp; Attribution</span>
                </div>
                <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                  <li>Introduced explicit source-available and domain-restricted legal framework.</li>
                  <li>Attributed all original author and licensing rights to official GitHub creator SouumG.</li>
                  <li>Secured attribution requirements linking back to SouumG on GitHub for forks or modifications.</li>
                </ul>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-200">v1.1.13</span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">• Complete Domain Lock &amp; Bypass Removal</span>
                </div>
                <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                  <li>Completely removed local development and run.app sandbox domain bypasses.</li>
                  <li>Locked execution exclusively to the verified production domain (nfc.aiue.se).</li>
                </ul>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-200">v1.1.12</span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">• Client-side Domain Lock Enforcement &amp; Build Verification</span>
                </div>
                <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                  <li>Implemented client-side hosting locks restricting distribution builds strictly to verified domains (nfc.aiue.se).</li>
                  <li>Maintained transparent allowances for localhost and local sandboxed developer preview/sandbox frame instances.</li>
                </ul>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-200">v1.1.11</span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">• Fix Web NFC State Cancellation &amp; Iframe Instantiation Crashes</span>
                </div>
                <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                  <li>Resolved a critical race condition where fast React re-renders aborted the active AbortController immediately during scan state transitions.</li>
                  <li>Instantiated the NDEFReader object safely from window.NDEFReader to prevent reference errors in sandboxed browser frames.</li>
                </ul>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-200">v1.1.10</span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">• Interactive Dashboard Fixes &amp; Unified Hardware Button Event Handlers</span>
                </div>
                <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                  <li>Wired up all interactive and placeholder buttons across the tools, settings, and dashboard terminals.</li>
                  <li>Ensured visual buttons respond with appropriate native-like event triggers, dialogs, and user feedback.</li>
                  <li>Optimized Web NFC scanning states and native reader initialization diagnostics.</li>
                  <li>Added native support for WPA3 Personal (SAE) security profiles.</li>
                  <li>Integrated support for WPA2/WPA3 Mixed security profiles to maximize device compatibility.</li>
                  <li>Updated Wi-Fi connection NDEF string generation and parser components for backward compatibility.</li>
                </ul>
              </div>

              <div className="space-y-1 border-t border-gray-900/50 pt-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-400">v1.1.9</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">• Advanced Wi-Fi Config, Handover Select &amp; Custom External Record Forms</span>
                </div>
                <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                  <li>Added granular selectors for all standard WPA/WPA2/WPA3 authentication configurations and TKIP/AES/WEP encryption parameters.</li>
                  <li>Implemented full visual widgets in the scanner reader to decode and present advanced Wi-Fi profiles correctly.</li>
                  <li>Integrated interactive forms for custom external record domains and local scopes in the programming suite.</li>
                  <li>Added visual card structures for Handover Select (Hs) connection protocols and custom local scopes.</li>
                </ul>
              </div>

              <div className="space-y-1 border-t border-gray-900/50 pt-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-400">v1.1.8</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">• Complete Contactless Wi-Fi/NDEF Encodings &amp; Auto-Pause</span>
                </div>
                <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                  <li>Added fully spec-compliant Wi-Fi authentication and encryption protocol configuration suite.</li>
                  <li>Integrated Device Provisioning Protocol / WPA3 Wi-Fi links (DPP://) and deep-linking schemas.</li>
                  <li>Enabled domain-scoped custom external record types with strict format validation.</li>
                  <li>Added Handover Select (Hs) local record parser and protocol state.</li>
                  <li>Implemented background execution auto-pause on page tab switches (Page Visibility API) to save device battery and prevent overlapping scan handlers.</li>
                  <li>Enhanced error telemetry tracking with onreadingerror failures and detailed status diagnostics.</li>
                </ul>
              </div>

              <div className="space-y-1 border-t border-gray-900/50 pt-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-400">v1.1.7</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">• Advanced Record Operations &amp; Permanent Locks</span>
                </div>
                <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                  <li>Implemented Lock Tags Permanently (makeReadOnly()) functionality directly from the terminal with diagnostic warning.</li>
                  <li>Expanded text record creator to support custom language tags (en, es) and UTF-8/UTF-16 encoding configurations.</li>
                  <li>Enhanced URL redirect inputs with deep links and custom protocols (mailto:, tel:, sms:).</li>
                  <li>Added native NDEF support for empty, local, and domain-scoped external record types.</li>
                  <li>Integrated binary payload files and custom application/octet-stream buffers inside MIME records.</li>
                  <li>Upgraded event listening telemetry for successful onreading and failed onreadingerror triggers.</li>
                </ul>
              </div>

              <div className="space-y-1 border-t border-gray-900/50 pt-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-400">v1.1.6</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">• Reverted Cancel Scan Buttons &amp; Cleaned Up UX</span>
                </div>
                <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                  <li>Changed read scanner action text back to "Cancel Scan" and write action button back to "Cancel".</li>
                  <li>Fixed diagnostic warning status badge layout and vertical alignment to prevent visual overflows on narrower mobile devices.</li>
                  <li>Removed toast notification popup triggers upon manual scan cancellations, keeping the visual UI clean and non-disruptive.</li>
                </ul>
              </div>

              <div className="space-y-1 border-t border-gray-900/50 pt-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-400">v1.1.5</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">• Professional Download Animations &amp; Diagnostic Feedback</span>
                </div>
                <ul className="list-disc pl-4 text-gray-450 text-[11px] space-y-0.5 leading-relaxed">
                  <li>Added professional asynchronous download transitions with dynamic status spinners to the templates directory and history log CSV/JSON exports.</li>
                  <li>Integrated a real-time assessing state with spinning indicator and progress toast feedback to the Hardware Re-Diagnose button, resolving static clicks.</li>
                  <li>Embedded a high-fidelity "Download QR PNG" action button directly below the QR code generator canvas.</li>
                  <li>Aligned and synchronized release version designations across all system landing pages and reference manuals.</li>
                </ul>
              </div>

              <div className="space-y-1 border-t border-gray-900/50 pt-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-400">v1.1.4</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">• Toast Feedback &amp; Button Standardization</span>
                </div>
                <ul className="list-disc pl-4 text-gray-450 text-[11px] space-y-0.5 leading-relaxed">
                  <li>Implemented responsive screen-overlay toast notifications for clip-copying, sharing, loading presets, and clearing log operations.</li>
                  <li>Standardized chip formatting selector cards to standard React HTML button components.</li>
                  <li>Removed leftover simulator references from Help and Documentation structures to focus strictly on real Web NFC hardware.</li>
                </ul>
              </div>

              <div className="space-y-1 border-t border-gray-900/50 pt-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-400">v1.1.3</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">• Iframe Safe &amp; Preset Sync</span>
                </div>
                <ul className="list-disc pl-4 text-gray-450 text-[11px] space-y-0.5 leading-relaxed">
                  <li>Wrapped Web NFC availability and sandboxing environment checks in secure try-catch structures.</li>
                  <li>Injected cross-origin sandbox SecurityError safety checks to prevent preview environment crashes.</li>
                  <li>Wired Templates directory selection triggers directly to the Write view to auto-load configuration records.</li>
                </ul>
              </div>

              <div className="space-y-1 border-t border-gray-900/50 pt-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-200">v1.1.2</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">• UI/UX &amp; Navigation Enhancements</span>
                </div>
                <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                  <li>Implemented full-screen blurred backdrop for mobile sidebar navigation, enabling clicking outside to dismiss.</li>
                  <li>Decluttered sidebar interface by removing the duplicate redundant interior close button.</li>
                  <li>Upgraded mobile header toggle trigger (Menu icon) to convert directly to an X icon when active and back when closed.</li>
                </ul>
              </div>

              <div className="space-y-1 border-t border-gray-900/50 pt-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-400">v1.2.1</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">• Bugfix &amp; PWA Stabilization</span>
                </div>
                <ul className="list-disc pl-4 text-gray-500 text-[11px] space-y-0.5 leading-relaxed">
                  <li>Upgraded service worker updating checks in main entry block.</li>
                  <li>Injected active software simulation timeouts reference cleaning upon components unmounting.</li>
                  <li>Overwrote erase-blocks payload definition with a clean single empty text record structure.</li>
                  <li>Added an 11-point capabilities matrix documenting native sandbox limitations.</li>
                </ul>
              </div>

              <div className="space-y-1 border-t border-gray-900/50 pt-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-400">v1.0.0</span>
                  <span className="text-[10px] text-gray-500">• Initial Production Spec Release</span>
                </div>
                <ul className="list-disc pl-4 text-gray-500 text-[11px] space-y-0.5 leading-relaxed">
                  <li>Full Web NFC NDEF scanning and multi-record encoding.</li>
                  <li>Real-time Device hardware compatibility diagnostic dashboard.</li>
                  <li>Integrated 20 system NDEF templates (Wi-Fi, social handles, maps).</li>
                  <li>Local storage activity history log streams with CSV export structures.</li>
                  <li>Base64 codecs, JSON formatters, and dynamic QR compilers.</li>
                  <li>Progressive Web App (PWA) manifest and offline cache configurations.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Specifications and info */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 pb-2 border-b border-gray-800 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-blue-400" /> Operational Limits
            </h3>

            <p className="text-[11px] leading-relaxed text-gray-400 select-text">
              This client-only browser application interfaces exclusively with NFC tag reading/writing protocols. Browsers are barred by system-level OS sandboxing from altering physical system settings (like direct cellular toggles, volume limits, flashlight, or bluetooth states).
            </p>
            <p className="text-[11px] leading-relaxed text-gray-400 select-text">
              For complex device automation sequences, write custom payload tags that connect natively to task engines like MacroDroid or Tasker.
            </p>
          </div>

          <div className="glass-panel rounded-xl p-5 space-y-1 flex items-center justify-center text-center flex-col text-xs text-gray-500 py-6">
            <Heart className="w-6 h-6 text-red-500 animate-pulse mb-1" />
            <div>Designed and structured for:</div>
            <a href="https://nfc.aiue.se/" target="_blank" rel="noreferrer" className="text-blue-400 font-semibold hover:underline mt-0.5 font-mono">nfc.aiue.se</a>
          </div>
        </div>

      </div>

    </div>
  );
}
