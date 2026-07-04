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
                NFC Writer (v1.2.2) is a robust, full-stack client-side Progressive Web Application designed for programming, scanning, parsing, and diagnosing high-frequency RFID/NFC chips. Built entirely in React and styled with a glassmorphism theme, this applet operates 100% locally on your browser.
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
                  <span className="font-bold text-gray-200">v1.2.2</span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">• UI/UX &amp; Navigation Enhancements</span>
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
