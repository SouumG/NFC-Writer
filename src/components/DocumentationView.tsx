import React from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Github, 
  Cpu, 
  Database, 
  Terminal, 
  FileCode, 
  Layers, 
  Lock, 
  Wifi 
} from 'lucide-react';

export default function DocumentationView() {
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/40 via-sky-950/30 to-slate-900/40 border border-blue-500/10 p-6 md:p-8">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono">
              <FileCode className="w-3.5 h-3.5" /> Technical Docs
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              NFC Writer Developer Suite
            </h2>
            <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
              Find physical layer specifications, browser sandboxing definitions, and NDEF structure schemas. Access open-source source repositories and developer kits.
            </p>
          </div>

          <a
            href="https://github.com/SouumG/NFC-Writer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer hover:shadow-blue-500/30 active:scale-95 whitespace-nowrap"
          >
            <Github className="w-4 h-4" />
            <span>Open GitHub Repository</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Core Docs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Start Guide */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-4">
            <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
              <Terminal className="w-4.5 h-4.5 text-blue-400" />
              <span>NFC Hardware Read & Write Protocols</span>
            </h3>
            
            <div className="text-xs text-gray-400 leading-relaxed space-y-4">
              <p>
                The <strong>Web NFC API</strong> enables web applications to read and write Near Field Communication (NFC) tags when they are brought in close proximity to the user's device (usually under 4 cm). The primary data format used is the <strong>NFC Data Exchange Format (NDEF)</strong>, which is lightweight and standardized.
              </p>

              <div className="space-y-2.5">
                <h4 className="font-semibold text-gray-200">How to Scan NFC Tags:</h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-gray-400">
                  <li>Navigate to the <strong>Read NFC Tag</strong> terminal tab.</li>
                  <li>Click on <strong>Start Live Scan</strong> to initiate the browser's hardware listening loop.</li>
                  <li>Bring the physical NFC tag directly against the device's NFC antenna (typically located on the back center of Android devices, or near the top camera frame of iOS devices).</li>
                  <li>Keep the tag still for approximately 1 second. The terminal will automatically capture the tag serial number, read its memory blocks, and decode NDEF text or URL structures directly on the screen.</li>
                </ol>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-semibold text-gray-200">How to Write NFC Tags:</h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-gray-400">
                  <li>Navigate to the <strong>Write NFC Tag</strong> control console.</li>
                  <li>Select the record structure you wish to program (e.g., Wi-Fi network, vCard, map coordinate, plain text).</li>
                  <li>Fill in the fields, and customize the parameters. You can also save it as a template for future use.</li>
                  <li>Click on <strong>Write Tag</strong> to arm the antenna.</li>
                  <li>Tap the physical writable tag (such as NTAG213 or NTAG215) against the antenna sector to instantly transfer the NDEF registers.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Tag Specifications & Memory Profile */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-4">
            <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
              <Cpu className="w-4.5 h-4.5 text-blue-400" />
              <span>Contactless Chip Chipset Matrix</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400">
                    <th className="py-2.5 font-semibold">Chip Family</th>
                    <th className="py-2.5 font-semibold">Total Memory</th>
                    <th className="py-2.5 font-semibold">NDEF User Capacity</th>
                    <th className="py-2.5 font-semibold">Standard Application</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-900 text-gray-300">
                  <tr>
                    <td className="py-3 font-mono font-bold text-blue-400">NTAG213</td>
                    <td className="py-3">180 Bytes</td>
                    <td className="py-3">144 Bytes</td>
                    <td className="py-3 text-gray-400">Short URLs, trigger scripts, asset tagging</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-mono font-bold text-emerald-400">NTAG215</td>
                    <td className="py-3">540 Bytes</td>
                    <td className="py-3">504 Bytes</td>
                    <td className="py-3 text-gray-400">Amiibo, business cards, multi-record payloads</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-mono font-bold text-purple-400">NTAG216</td>
                    <td className="py-3">924 Bytes</td>
                    <td className="py-3">888 Bytes</td>
                    <td className="py-3 text-gray-400">Detailed contact vCards, large JSON data matrices</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-mono font-bold text-amber-400">Mifare Ultralight EV1</td>
                    <td className="py-3">80 / 164 Bytes</td>
                    <td className="py-3">48 / 128 Bytes</td>
                    <td className="py-3 text-gray-400">Transit ticketing, event passes, simple links</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed mt-2">
              * Note: NTAG215 is the recommended standard for universal cross-platform compatibility across Chrome for Android and Safari on iOS.
            </p>
          </div>

        </div>

        {/* Right 1 Column: Developer Resources & Specifications */}
        <div className="space-y-8">
          
          {/* GitHub Repository Specs */}
          <div className="glass-panel rounded-2xl p-5 space-y-4 border border-gray-800 bg-gray-950/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 pb-2 border-b border-gray-900 flex items-center gap-1.5">
              <Github className="w-4 h-4 text-blue-400" /> Git Source Details
            </h3>
            
            <div className="space-y-3.5 text-xs text-gray-400">
              <div>
                <span className="block text-[10px] text-gray-500 font-semibold uppercase">Repository URL</span>
                <a 
                  href="https://github.com/SouumG/NFC-Writer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline break-all font-mono text-[11px] mt-0.5 block"
                >
                  https://github.com/SouumG/NFC-Writer
                </a>
              </div>

              <div>
                <span className="block text-[10px] text-gray-500 font-semibold uppercase">Build Environment</span>
                <span className="text-gray-200 mt-0.5 block">Vite + React SPA (Static Delivery)</span>
              </div>

              <div>
                <span className="block text-[10px] text-gray-500 font-semibold uppercase">Key Dependencies</span>
                <ul className="list-disc pl-4 text-gray-400 mt-1 space-y-0.5">
                  <li>lucide-react (vector icons)</li>
                  <li>motion (smooth visual transitions)</li>
                  <li>Web NFC API standards</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Browser Support Specs */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 pb-2 border-b border-gray-850 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-blue-400" /> Platform Security
            </h3>

            <div className="space-y-3 text-xs leading-relaxed text-gray-400">
              <div className="flex gap-2.5 items-start">
                <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20 shrink-0 mt-0.5">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-200">Secure Protocol Only</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">Web NFC can only be executed within secure HTTPS cryptographic contexts. Insecure HTTP origins are blocked by default.</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 shrink-0 mt-0.5">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-200">User Gesture Mandate</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">NFC scanning or writing can only be triggered by deliberate user actions like clicking a button. Background execution is strictly disallowed.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
