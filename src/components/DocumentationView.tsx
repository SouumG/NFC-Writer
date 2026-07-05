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
  Wifi,
  Monitor,
  Scan,
  Edit,
  RefreshCw,
  Trash2,
  FileJson,
  Key,
  Shield,
  Smartphone,
  AlertTriangle,
  FolderOpen
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
              <FileCode className="w-3.5 h-3.5" /> Web NFC Reference Guide
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              NFC Specifications &amp; Capabilities
            </h2>
            <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
              Explore actual browser-level support bounds, hardware protocols, memory layouts, and core transponder specifications.
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

      {/* Grid: 11 Point NFC Tag Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. READ NFC TAGS */}
        <div className="glass-panel rounded-xl p-5 border border-gray-800/80 space-y-2.5">
          <div className="flex items-center gap-2 text-blue-400">
            <Scan className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">01</span>
            <h4 className="font-bold text-xs text-gray-100 uppercase tracking-wide">Read NFC Tags</h4>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Read physical NDEF (NFC Data Exchange Format) tags on contact. You can extract plain text, web URLs, phone directory sequences (<code className="text-blue-300 font-mono">tel:</code>), email structures, SMS drafts, Wi-Fi configuration matrices, and raw JSON payloads.
          </p>
        </div>

        {/* 2. WRITE TO NFC TAGS */}
        <div className="glass-panel rounded-xl p-5 border border-gray-800/80 space-y-2.5">
          <div className="flex items-center gap-2 text-blue-400">
            <Edit className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">02</span>
            <h4 className="font-bold text-xs text-gray-100 uppercase tracking-wide">Write to NFC Tags</h4>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Program NDEF compatible chips (such as NTAG213, NTAG215, or NTAG216). Write direct web links, customized text cards, map coordinates, direct phone dials, pre-populated email drafts, and complex nested data strings.
          </p>
        </div>

        {/* 3. OVERWRITE NFC TAGS */}
        <div className="glass-panel rounded-xl p-5 border border-gray-800/80 space-y-2.5">
          <div className="flex items-center gap-2 text-blue-400">
            <RefreshCw className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">03</span>
            <h4 className="font-bold text-xs text-gray-100 uppercase tracking-wide">Overwrite NFC Tags</h4>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Modify or completely replace old structures on physical tags instantly with new NDEF payloads. Overwriting is fully supported as long as the sector blocks are writable and have not been set to permanent read-only status.
          </p>
        </div>

        {/* 4. "ERASE" NFC TAGS */}
        <div className="glass-panel rounded-xl p-5 border border-gray-800/80 space-y-2.5">
          <div className="flex items-center gap-2 text-blue-400">
            <Trash2 className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">04</span>
            <h4 className="font-bold text-xs text-gray-100 uppercase tracking-wide">Erase Tags (Overwrite Method)</h4>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Since there is no native physical "factory reset" button in commercial NFC chips, erasing is accomplished by overwriting the memory sectors with a clean, empty text record to safely wipe existing data blocks.
          </p>
        </div>

        {/* 5. FORMAT NFC TAGS */}
        <div className="glass-panel rounded-xl p-5 border border-gray-800/80 space-y-2.5">
          <div className="flex items-center gap-2 text-blue-400">
            <FileCode className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">05</span>
            <h4 className="font-bold text-xs text-gray-100 uppercase tracking-wide">Format NFC Tags</h4>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Prepare raw or corrupted tags for reuse. Formatting programs a standard, empty NDEF container registry to establish a clean directory index ready to receive structured payloads.
          </p>
        </div>

        {/* 6. LOCK NFC TAGS */}
        <div className="glass-panel rounded-xl p-5 border border-gray-800/80 space-y-2.5">
          <div className="flex items-center gap-2 text-blue-400">
            <Lock className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">06</span>
            <h4 className="font-bold text-xs text-gray-100 uppercase tracking-wide">Lock NFC Tags</h4>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Permanent locking turns a writable tag into a read-only tag. Please note that permanent locks are irreversible and are highly hardware-dependent; lock commands are often handled directly via native Android/iOS developer toolsets.
          </p>
        </div>

        {/* 7. MULTI-RECORD TAGS */}
        <div className="glass-panel rounded-xl p-5 border border-gray-800/80 space-y-2.5">
          <div className="flex items-center gap-2 text-blue-400">
            <FolderOpen className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">07</span>
            <h4 className="font-bold text-xs text-gray-100 uppercase tracking-wide">Multi-Record Tags</h4>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Write and parse multiple distinct entries on a single tag (e.g. Record 1: Wi-Fi setup, Record 2: Portfolio Website, Record 3: Contact vCard). This app supports multi-record structures, reading and displaying each individually.
          </p>
        </div>

        {/* 8. NFC TRIGGER ACTIONS */}
        <div className="glass-panel rounded-xl p-5 border border-gray-800/80 space-y-2.5">
          <div className="flex items-center gap-2 text-blue-400">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">08</span>
            <h4 className="font-bold text-xs text-gray-100 uppercase tracking-wide">NFC Trigger Actions</h4>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Trigger standard phone actions automatically on tap. Launch web browsers via URLs, open maps coordinates, dial phone numbers, trigger email drafts, compose SMS messages, or initiate deep app links (Android Intent actions).
          </p>
        </div>

        {/* 9. PERMISSION + SECURITY LIMITS */}
        <div className="glass-panel rounded-xl p-5 border border-gray-800/80 space-y-2.5">
          <div className="flex items-center gap-2 text-blue-400">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">09</span>
            <h4 className="font-bold text-xs text-gray-100 uppercase tracking-wide">Permission &amp; Security limits</h4>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Web NFC is heavily sandboxed for safety: it requires a secure cryptographic HTTPS context, active browser tab visibility, and is strictly restricted to user-initiated gestures (explicit tap-to-start triggers). Passive background scanning is blocked.
          </p>
        </div>

        {/* 10. DEVICE LIMITATIONS */}
        <div className="glass-panel rounded-xl p-5 border border-gray-800/80 space-y-2.5">
          <div className="flex items-center gap-2 text-blue-400">
            <Smartphone className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">10</span>
            <h4 className="font-bold text-xs text-gray-100 uppercase tracking-wide">Device Limitations</h4>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            The physical Web NFC API is only supported on Android devices using Chrome, Opera, or Edge browsers. Desktop platforms (Windows, macOS) and Apple iOS devices do not expose NDEF transmission capabilities to standard web browsers.
          </p>
        </div>

        {/* 11. WHAT YOU CANNOT DO */}
        <div className="glass-panel rounded-xl p-5 border border-gray-800/80 space-y-2.5 md:col-span-2 font-sans">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="font-bold text-[10px] bg-red-950/20 text-red-400 border border-red-900/40 px-2 py-0.5 rounded font-mono">11</span>
            <h4 className="font-bold text-xs text-red-300 uppercase tracking-wide">Hardware &amp; OS Restrictions (What You Cannot Do)</h4>
          </div>
          <div className="text-xs text-gray-400 leading-relaxed space-y-2 font-sans">
            <p>
              Due to modern security sandboxes, no web browser application can perform low-level hardware manipulations on a user's phone or tag:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li><strong>Phone Controls:</strong> You cannot toggle device Wi-Fi, control Bluetooth status, change screen brightness, adjust audio volumes, or toggle the camera flashlight.</li>
              <li><strong>Low-level Chip Access:</strong> You cannot bypass manufacturers' locked memory blocks, access full raw sector memory maps, or modify low-level chip hardware IDs (UID).</li>
              <li><strong>iOS Web NFC:</strong> Apple does not allow Safari or third-party iOS browsers to interface with the core NFC core chip for Web NDEF actions. iOS requires dedicated App Store apps.</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Chip Family Matrix */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-4">
        <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
          <Cpu className="w-4.5 h-4.5 text-blue-400" />
          <span>Contactless Chipset Architecture Specification</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 font-mono text-[11px]">
                <th className="py-2.5 font-semibold uppercase">Chip Family</th>
                <th className="py-2.5 font-semibold uppercase">Total Memory</th>
                <th className="py-2.5 font-semibold uppercase">User Data NDEF Capacity</th>
                <th className="py-2.5 font-semibold uppercase">Recommended Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900 text-gray-300 font-mono text-[11px]">
              <tr>
                <td className="py-3 font-bold text-blue-400">NTAG213</td>
                <td className="py-3">180 Bytes</td>
                <td className="py-3">144 Bytes</td>
                <td className="py-3 text-gray-400 font-sans">Short URLs, map coordinates, smart posters, and asset tags.</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-emerald-400">NTAG215</td>
                <td className="py-3">540 Bytes</td>
                <td className="py-3">504 Bytes</td>
                <td className="py-3 text-gray-400 font-sans">Amiibo emulation, comprehensive contact cards, and Wi-Fi credentials.</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-purple-400">NTAG216</td>
                <td className="py-3">924 Bytes</td>
                <td className="py-3">888 Bytes</td>
                <td className="py-3 text-gray-400 font-sans">Large vCards, detailed medical emergency records, or custom JSON data arrays.</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-amber-400">Mifare Ultralight EV1</td>
                <td className="py-3">80 / 164 Bytes</td>
                <td className="py-3">48 / 128 Bytes</td>
                <td className="py-3 text-gray-400 font-sans">Transit ticketing, loyalty vouchers, and event passes.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-gray-500 leading-relaxed font-sans mt-2">
          * Note: NTAG215 is the recommended industry standard for cross-platform RFID and NFC NDEF interactions.
        </p>
      </div>

    </div>
  );
}
