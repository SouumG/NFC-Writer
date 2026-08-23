import React, { useState } from 'react';
import { Bookmark, ShieldAlert, Heart, Code2, History, ChevronDown, ChevronUp } from 'lucide-react';

export default function AboutView() {
  const [showOlder, setShowOlder] = useState(false);

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
                NFC Writer (v1.1.18) is a robust, full-stack client-side Progressive Web Application designed for programming, scanning, parsing, and diagnosing high-frequency RFID/NFC chips. Built entirely in React and styled with a glassmorphism theme, this applet operates 100% locally on your browser.
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
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-400" />
                <span>System Changelog History</span>
              </h3>
              <span className="text-[10px] font-mono text-gray-500">Release: v1.1.18</span>
            </div>

            <div className="space-y-4 text-xs font-mono">
              {/* Latest Version (Always Visible) */}
              <div className="space-y-2 bg-blue-500/5 border border-blue-500/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 pb-1 border-b border-blue-500/10">
                  <span className="font-bold text-xs text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/30">v1.1.18</span>
                  <span className="text-xs text-gray-200 font-bold uppercase">• Complete Client-Side Suite &amp; System Consolidation</span>
                </div>
                <ul className="list-disc pl-5 text-gray-300 text-[11px] space-y-1.5 leading-relaxed pt-1">
                  <li><strong>Pure Client-Side Architecture:</strong> Zero server data, zero external database dependencies, zero API keys, and 100% browser-local execution with Google site-verification metadata integration.</li>
                  <li><strong>Core NFC Engine:</strong> Native W3C Web NFC scanner and encoder for 12 NDEF record types (plain text, web URLs, vCard contacts, Wi-Fi setups, SMS drafts, maps coordinates, and raw binary).</li>
                  <li><strong>Advanced Wi-Fi &amp; WPS Payloads:</strong> Spec-compliant binary WPS TLV compilation for automated Android tap-to-connect prompts and WPA3 Personal (SAE) security profile support.</li>
                  <li><strong>20 Built-in NDEF Templates:</strong> Precompiled template directory with JSON export/import and direct Write terminal loading.</li>
                  <li><strong>Hardware Diagnostics:</strong> Real-time hardware capability analyzer, browser sandboxing compatibility checklist, and diagnostic status tools.</li>
                  <li><strong>Local Storage &amp; Utilities:</strong> Sandboxed client-side activity history logs, CSV/JSON log exports, dynamic QR Code generator, Base64 codecs, and JSON formatters.</li>
                  <li><strong>Theme &amp; Visual Design:</strong> High-contrast dark slate glassmorphism theme, dynamic accent color selector, and responsive light mode support.</li>
                  <li><strong>Domain Authorization &amp; Licensing:</strong> Exclusive execution authorization restricted strictly to <code>nfc.aiue.se</code> and <code>www.nfc.aiue.se</code> under SouumG proprietary license.</li>
                  <li><strong>Offline PWA Engine:</strong> Cache-first Service Worker with offline fallback pipeline and manifest shortcuts.</li>
                </ul>
              </div>

              {/* Toggle Button for Older Versions */}
              <button
                type="button"
                onClick={() => setShowOlder(!showOlder)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-gray-900/60 hover:bg-gray-800/80 border border-gray-800 rounded-lg text-xs font-mono text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <History className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-semibold">{showOlder ? "Hide older versions" : "Show older version history (17 releases)"}</span>
                </div>
                {showOlder ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>

              {/* Collapsible Older Versions List */}
              {showOlder && (
                <div className="space-y-4 pt-2 border-t border-gray-800/60 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-300">v1.1.17</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">• Collapsible Changelog Interface &amp; Unified Color Scheme</span>
                    </div>
                    <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                      <li>Formatted system changelog history to display only the latest version by default with interactive toggle dropdown.</li>
                      <li>Standardized release headings, tag badges, and list entries to use a single cohesive color palette.</li>
                      <li>Consolidated release footprint across all components, service worker caches, and documentation.</li>
                    </ul>
                  </div>

                  <div className="space-y-1 border-t border-gray-800/40 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-300">v1.1.16</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">• Authorized Dual Domain &amp; Link Styling</span>
                    </div>
                    <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                      <li>Expanded domain restrictions to authorize strictly nfc.aiue.se and www.nfc.aiue.se with active, interactive hyperlinks.</li>
                      <li>Updated sitemap.xml with all client-side hash routes (#about, #legal, #documentation) and synchronized timestamps.</li>
                      <li>Cleaned up build dependencies and verified 100% client-side serverless application architecture.</li>
                    </ul>
                  </div>

                  <div className="space-y-1 border-t border-gray-800/40 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-300">v1.1.15</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">• Native Android Wi-Fi WPS Payload &amp; CRLF Alignment</span>
                    </div>
                    <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                      <li>Implemented full WPS (Wi-Fi Protected Setup) TLV big-endian binary compilation for native Android tap-to-connect prompts.</li>
                      <li>Designed dual-record sequence compiling native binary WPS record followed by standard text WIFI: URI record.</li>
                      <li>Corrected line break formatting for vCard contacts and iCalendar schedules to standard network CRLF (\r\n).</li>
                    </ul>
                  </div>

                  <div className="space-y-1 border-t border-gray-800/40 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-300">v1.1.14</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">• Proprietary License &amp; Attribution</span>
                    </div>
                    <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                      <li>Created custom domain-restricted legal framework under author's official GitHub username SouumG.</li>
                      <li>Replaced all occurrences of author's real name with official GitHub username SouumG across all modules.</li>
                    </ul>
                  </div>

                  <div className="space-y-1 border-t border-gray-800/40 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-300">v1.1.13</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">• Absolute Domain Lock Enforcement</span>
                    </div>
                    <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                      <li>Completely locked application execution exclusively to official domain hosts.</li>
                    </ul>
                  </div>

                  <div className="space-y-1 border-t border-gray-800/40 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-300">v1.1.12</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">• Client-Side Domain Lock</span>
                    </div>
                    <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                      <li>Implemented client-side domain lock enforcement preventing unauthorized domain hosting.</li>
                    </ul>
                  </div>

                  <div className="space-y-1 border-t border-gray-800/40 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-300">v1.1.11</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">• Web NFC State Cancellation &amp; Iframe Fixes</span>
                    </div>
                    <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                      <li>Resolved race condition where state transitions prematurely aborted AbortController during scans.</li>
                      <li>Instantiated NDEFReader object safely from window.NDEFReader to prevent sandboxed iframe reference errors.</li>
                    </ul>
                  </div>

                  <div className="space-y-1 border-t border-gray-800/40 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-300">v1.1.10</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">• Interactive Dashboard &amp; WPA3 Support</span>
                    </div>
                    <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                      <li>Wired up all interactive terminal buttons across tools, settings, and dashboard.</li>
                      <li>Added native support for WPA3 Personal (SAE) and WPA2/WPA3 Mixed security profiles.</li>
                      <li>Optimized Web NFC scanning states and native reader initialization diagnostics.</li>
                    </ul>
                  </div>

                  <div className="space-y-1 border-t border-gray-800/40 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-300">v1.1.9</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">• Advanced Wi-Fi Config &amp; Handover Select</span>
                    </div>
                    <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                      <li>Added selectors for all standard WPA/WPA2/WPA3 authentication and encryption parameters.</li>
                      <li>Implemented visual reader widgets for decoding Handover Select (Hs) protocols and custom external records.</li>
                    </ul>
                  </div>

                  <div className="space-y-1 border-t border-gray-800/40 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-300">v1.1.8</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">• Wi-Fi Encodings &amp; Page Visibility Auto-Pause</span>
                    </div>
                    <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                      <li>Integrated DPP:// Wi-Fi links, domain-scoped custom external record types, and Handover Select parser.</li>
                      <li>Implemented background execution auto-pause on page tab switches (Page Visibility API) to save battery.</li>
                    </ul>
                  </div>

                  <div className="space-y-1 border-t border-gray-800/40 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-300">v1.1.7</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">• Permanent Lock Operations &amp; Custom Encodings</span>
                    </div>
                    <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                      <li>Implemented Lock Tags Permanently (makeReadOnly()) with diagnostic warnings.</li>
                      <li>Expanded text record creator to support custom language tags and UTF-8/UTF-16 encodings.</li>
                    </ul>
                  </div>

                  <div className="space-y-1 border-t border-gray-800/40 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-300">v1.1.6</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">• UX Refinement &amp; Scanner Button Fixes</span>
                    </div>
                    <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                      <li>Standardized scanner action button labels and fixed diagnostic warning status badge layouts.</li>
                    </ul>
                  </div>

                  <div className="space-y-1 border-t border-gray-800/40 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-300">v1.1.5</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">• Professional Download Animations &amp; Diagnostic Feedback</span>
                    </div>
                    <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                      <li>Added asynchronous download transitions with spinners for templates and history CSV/JSON exports.</li>
                      <li>Embedded high-fidelity Download QR PNG action button directly below the QR code generator canvas.</li>
                    </ul>
                  </div>

                  <div className="space-y-1 border-t border-gray-800/40 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-300">v1.1.4</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">• Toast Notifications &amp; Button Standardization</span>
                    </div>
                    <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                      <li>Implemented responsive screen-overlay toast notifications for clip-copying, sharing, and preset loading.</li>
                    </ul>
                  </div>

                  <div className="space-y-1 border-t border-gray-800/40 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-300">v1.1.3</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">• Preset Template Sync &amp; Sandbox Safety</span>
                    </div>
                    <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                      <li>Enabled loading preset templates directly into the Write screen's input fields.</li>
                    </ul>
                  </div>

                  <div className="space-y-1 border-t border-gray-800/40 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-300">v1.1.2</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">• Memory Capacity Options &amp; Navigation Enhancements</span>
                    </div>
                    <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                      <li>Added custom memory capacity input field to NDEF formatting options.</li>
                    </ul>
                  </div>

                  <div className="space-y-1 border-t border-gray-800/40 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-300">v1.0.0</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">• Initial Production Spec Release</span>
                    </div>
                    <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-0.5 leading-relaxed">
                      <li>Full Web NFC NDEF scanning and multi-record encoding.</li>
                      <li>Real-time Device hardware compatibility diagnostic dashboard.</li>
                      <li>Integrated 20 system NDEF templates, history logs, PWA manifest, and offline cache.</li>
                    </ul>
                  </div>
                </div>
              )}
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
