import React, { useState } from 'react';
import { ShieldCheck, FileText, CheckCircle } from 'lucide-react';

export default function LegalView() {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

  return (
    <div className="space-y-6">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-900/30 border border-gray-800/40 rounded-xl p-5">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>Legal Disclosures & Guidelines</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Read our standardized Privacy Policy and Terms of Service agreements.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-gray-900 rounded-lg p-0.5 border border-gray-850 w-full sm:w-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg cursor-pointer transition-colors ${activeTab === 'privacy' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg cursor-pointer transition-colors ${activeTab === 'terms' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Terms of Service
          </button>
        </div>
      </div>

      {/* Main text box */}
      <div className="glass-panel rounded-xl p-6 md:p-8 space-y-6 select-text text-xs leading-relaxed text-gray-400 max-w-4xl">
        
        {activeTab === 'privacy' ? (
          /* Privacy Policy */
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-200 flex items-center gap-2 pb-2 border-b border-gray-800">
              <ShieldCheck className="w-5 h-5 text-blue-400" /> NFC Writer Privacy Policy
            </h3>
            
            <p className="text-gray-300 font-semibold font-mono text-[10px]">Effective Date: July 4, 2026</p>
            
            <p>
              Your digital privacy is our highest concern. NFC Writer operates strictly as an offline-first client-side web utility. Because our software does not include any background cloud servers or APIs, we maintain unique and pristine security parameters:
            </p>

            <div className="space-y-3">
              <div className="space-y-1">
                <h4 className="font-bold text-gray-200">1. Zero Database Collection</h4>
                <p>NFC Writer does not gather, transmit, store, or share any personal identifying details (SSID names, passwords, vCards, phone logs, maps coordinates, or JSON data streams) programmed to or scanned from physical tags. All data packets processed inside the app stay strictly on your local CPU.</p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-gray-200">2. Local Storage Directories</h4>
                <p>All customized templates and scanned log activities are retained locally on your computer/phone using browser-sandboxed LocalStorage keys. Clear your browser cache or reset caches in settings to permanently wipe this data. We have zero access to your logs.</p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-gray-200">3. Third-party APIs & Cookies</h4>
                <p>We do not load analytical trackers, marketing cookies, advertising scripts, or third-party cloud engines. None of your activities are tracked.</p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-gray-200">4. Device Hardware Permissions</h4>
                <p>To scanner NFC tags, the browser will request access to your device's native RFID antenna. This hardware token is only utilized when you trigger "Start Live Scan" or "Program Tag" and is restricted under strict browser sandbox safety standards.</p>
              </div>
            </div>
          </div>
        ) : (
          /* Terms of Service */
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-200 flex items-center gap-2 pb-2 border-b border-gray-800">
              <FileText className="w-5 h-5 text-blue-400" /> NFC Writer Terms of Service
            </h3>

            <p className="text-gray-300 font-semibold font-mono text-[10px]">Effective Date: July 4, 2026</p>

            <p>
              Welcome to NFC Writer (hosted at nfc.aiue.se). By accessing or loading our Progressive Web App, you accept our service conditions:
            </p>

            <div className="space-y-3">
              <div className="space-y-1">
                <h4 className="font-bold text-gray-200">1. Acceptable Tool Usage</h4>
                <p>This software is built strictly for programming standard high-frequency RFID/NFC tags for personal, corporate, connectivity, educational, or testing purposes. You are forbidden from deploying our tool to clone unauthorized physical security keycards, duplicate protected smart-card signatures, or program malicious payloads onto public public-access NFC markers.</p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-gray-200">2. Disclaimer of Hardware Warranties</h4>
                <p>NFC Writer is provided "as is" and "as available". We do not represent or guarantee that Web NFC operations will compile flawlessly on every phone, browser model, or RFID tag frequency. We are not liable for broken tag chips, bricked NFC tags, or lost physical assets resulting from magnetic sector writes or lock operations.</p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-gray-200">3. Modification & Open Deployment</h4>
                <p>As a browser-only client-side utility, users can export, zip, or copy the static files to configure their own custom instances. Redepoyments are permitted as long as all appropriate copyright attributes are kept intact.</p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
