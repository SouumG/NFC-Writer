import React from 'react';
import { 
  Settings, 
  Moon, 
  Sun, 
  Monitor, 
  Palette, 
  Trash2, 
  RefreshCw, 
  Vibrate, 
  Info,
  Download,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { NFCSettings } from '../types';

interface SettingsViewProps {
  settings: NFCSettings;
  onUpdateSettings: (newSettings: Partial<NFCSettings>) => void;
  onResetAllData: () => void;
}

export const COLOR_PRESETS = [
  { name: 'Classic Cyan', value: '#0ea5e9', class: 'bg-sky-500' },
  { name: 'Dynamic Blue', value: '#3b82f6', class: 'bg-blue-500' },
  { name: 'Acid Green', value: '#10b981', class: 'bg-emerald-500' },
  { name: 'Neon Purple', value: '#8b5cf6', class: 'bg-violet-500' },
  { name: 'Solar Amber', value: '#f59e0b', class: 'bg-amber-500' },
  { name: 'Crimson Core', value: '#ef4444', class: 'bg-red-500' },
];

export default function SettingsView({ 
  settings, 
  onUpdateSettings, 
  onResetAllData 
}: SettingsViewProps) {

  return (
    <div className="space-y-6">
      
      {/* Upper header title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-900/30 border border-gray-800/40 rounded-xl p-5">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <span>NFC Configuration Suite</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Customize visual themes, set auto-save parameters, and view offline installation rules.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: General preferences toggles */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Visual Preferences */}
          <div className="glass-panel rounded-xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2 pb-2.5 border-b border-gray-800">
              <Palette className="w-4.5 h-4.5 text-blue-400" /> Visual Theme & Customization
            </h3>

            <div className="space-y-4 text-xs">
              {/* Theme Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-gray-300">Color Palette Mode</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Toggle light backgrounds or deep space aesthetics.</div>
                </div>

                <div className="flex bg-gray-900 rounded-lg p-0.5 border border-gray-850 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ theme: 'dark' })}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-md flex items-center gap-1 cursor-pointer ${settings.theme === 'dark' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    <Moon className="w-3 h-3" /> Space
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ theme: 'light' })}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-md flex items-center gap-1 cursor-pointer ${settings.theme === 'light' ? 'bg-blue-600 text-white animate-pulse' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    <Sun className="w-3 h-3" /> Bright
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ theme: 'system' })}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-md flex items-center gap-1 cursor-pointer ${settings.theme === 'system' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    <Monitor className="w-3 h-3" /> System
                  </button>
                </div>
              </div>

              {/* Accent Color Customizer */}
              <div className="space-y-3 border-t border-gray-900 pt-4">
                <div>
                  <div className="font-semibold text-gray-300">Accent Highlight Tone</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Select high-contrast color presets or choose a custom color.</div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      type="button"
                      key={color.name}
                      onClick={() => onUpdateSettings({ accentColor: color.value })}
                      className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border-2 transition-all ${settings.accentColor.toLowerCase() === color.value.toLowerCase() ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                      title={color.name}
                    >
                      <span 
                        className="w-6 h-6 rounded-full block" 
                        style={{ backgroundColor: color.value }}
                      ></span>
                    </button>
                  ))}

                  {/* Custom Hex Color Picker */}
                  <div className="flex items-center gap-2 pl-2 border-l border-gray-800">
                    <label className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-gray-700 hover:border-gray-500 cursor-pointer flex items-center justify-center transition-transform hover:scale-105 shrink-0">
                      <input
                        type="color"
                        value={settings.accentColor || '#3b82f6'}
                        onChange={(e) => onUpdateSettings({ accentColor: e.target.value })}
                        className="absolute -inset-2 w-12 h-12 cursor-pointer opacity-0"
                        title="Pick custom color"
                      />
                      <span 
                        className="w-full h-full block rounded-full" 
                        style={{ backgroundColor: settings.accentColor || '#3b82f6' }}
                      ></span>
                    </label>
                    <div className="flex items-center bg-gray-900 rounded-lg border border-gray-800 px-2 py-1">
                      <span className="text-[10px] font-mono text-gray-500">HEX</span>
                      <input
                        type="text"
                        value={settings.accentColor}
                        onChange={(e) => {
                          const val = e.target.value;
                          onUpdateSettings({ accentColor: val });
                        }}
                        className="w-16 bg-transparent text-[11px] font-mono text-gray-200 outline-none ml-1.5 uppercase"
                        maxLength={7}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Animation Enabled Toggle */}
              <div className="flex items-center justify-between border-t border-gray-900 pt-4">
                <div>
                  <div className="font-semibold text-gray-300 font-mono text-[11px]">Interface Transitions</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Allow micro-animations and motion transitions.</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.animationEnabled}
                  onChange={() => onUpdateSettings({ animationEnabled: !settings.animationEnabled })}
                  className="accent-blue-500 w-4 h-4 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Sync & Automation Preferences */}
          <div className="glass-panel rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2 pb-2.5 border-b border-gray-800">
              <Vibrate className="w-4.5 h-4.5 text-blue-400" /> Operational Parameters
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-300">Auto-Save Scan History</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Silently cache scanning NDEF events in history files.</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoSaveHistory}
                  onChange={() => onUpdateSettings({ autoSaveHistory: !settings.autoSaveHistory })}
                  className="accent-blue-500 w-4 h-4 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between border-t border-gray-900 pt-4">
                <div>
                  <div className="font-semibold text-gray-300">Verify Programmed Writes</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Pull written tag block indexes and execute parity checks automatically.</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoVerifyWrites}
                  onChange={() => onUpdateSettings({ autoVerifyWrites: !settings.autoVerifyWrites })}
                  className="accent-blue-500 w-4 h-4 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between border-t border-gray-900 pt-4">
                <div>
                  <div className="font-semibold text-gray-300">Haptic Vibration Signals</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Trigger vibration pulses on scanning successes (supported mobile devices).</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.vibrationFeedback}
                  onChange={() => onUpdateSettings({ vibrationFeedback: !settings.vibrationFeedback })}
                  className="accent-blue-500 w-4 h-4 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Install PWA Guide / Reset App */}
        <div className="space-y-6">
          
          {/* PWA Installer Guide */}
          <div className="glass-panel rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 pb-2 border-b border-gray-800 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-blue-400" /> PWA Installation Center
            </h3>

            <div className="text-[11px] leading-relaxed text-gray-400 space-y-3">
              <p>NFC Writer is built as a complete offline-first Progressive Web App. Follow these instructions to launch locally on your homescreen:</p>
              
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-gray-900/60 rounded-lg border border-gray-850/60">
                  <div className="font-bold text-gray-200">Android Chrome</div>
                  <ol className="list-decimal pl-4 mt-1 space-y-0.5 text-gray-400 text-[10px]">
                    <li>Tap the <strong className="text-gray-300">Install App</strong> notification bar or banner.</li>
                    <li>Or click the three dots menu icon in Chrome corner.</li>
                    <li>Select <strong className="text-gray-300">Add to Home screen</strong> option.</li>
                  </ol>
                </div>

                <div className="p-3 bg-gray-900/60 rounded-lg border border-gray-850/60">
                  <div className="font-bold text-gray-200">Apple iOS Safari</div>
                  <ol className="list-decimal pl-4 mt-1 space-y-0.5 text-gray-400 text-[10px]">
                    <li>Launch Safari and navigate here.</li>
                    <li>Tap the blue <strong className="text-gray-300">Share</strong> (arrow up) toolbar button.</li>
                    <li>Scroll down and select <strong className="text-gray-300">Add to Home Screen</strong>.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Purge System State */}
          <div className="glass-panel border-red-500/10 rounded-xl p-5 space-y-3.5">
            <div className="flex items-center gap-2 pb-1.5 border-b border-gray-900">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-400">Memory Purge Core</h3>
            </div>

            <p className="text-[10px] leading-relaxed text-gray-500">
              Wiping state directories will delete all user-configured templates and your local scanned/written logs history permanently. This action is irreversible.
            </p>

            <button
              type="button"
              onClick={() => {
                if (confirm("DANGER: This will permanently wipe all history activity log files and user custom templates from LocalStorage. Are you absolutely certain you want to reset?")) {
                  onResetAllData();
                }
              }}
              className="w-full py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 hover:border-red-500/30 text-[10px] font-bold text-red-400 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Wipe Local Cache memory
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
