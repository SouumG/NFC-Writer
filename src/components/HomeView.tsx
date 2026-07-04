import React from 'react';
import { motion } from 'motion/react';
import { 
  Scan, 
  PenTool, 
  Settings as SettingsIcon, 
  History as HistoryIcon, 
  BookOpen, 
  Smartphone, 
  ShieldCheck, 
  Chrome, 
  AlertTriangle,
  Download,
  Flame,
  CheckCircle,
  FileText,
  Compass,
  LayoutGrid
} from 'lucide-react';
import { NFCCompatibilityReport, NFCHistoryEntry } from '../types';

interface HomeViewProps {
  report: NFCCompatibilityReport;
  recentHistory: NFCHistoryEntry[];
  onNavigate: (page: string) => void;
  deferredPrompt: any;
  onInstallPWA: () => void;
}

export default function HomeView({ 
  report, 
  recentHistory, 
  onNavigate, 
  deferredPrompt, 
  onInstallPWA 
}: HomeViewProps) {
  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-2xl glass-panel p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-12">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-sky-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>NFC suite v1.2.1</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-400">
            Write. Read. Format. <br />Contactless Tags.
          </h1>
          <p className="text-sm md:text-base text-gray-400 max-w-xl leading-relaxed">
            NFC Writer is a client-side utility to program and inspect physical NDEF tags. Program Wi-Fi portals, contact business cards, automated triggers, or locations instantly in your browser.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center md:justify-start">
            <button
              onClick={() => onNavigate('read')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-lg shadow-blue-500/10"
            >
              <Scan className="w-5 h-5" />
              <span>Read Tag Scanner</span>
            </button>
            <button
              onClick={() => onNavigate('write')}
              className="px-6 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <PenTool className="w-5 h-5 text-blue-400" />
              <span>Write NDEF Records</span>
            </button>
          </div>
        </div>

        {/* Dynamic Holographic Scanner Art */}
        <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center shrink-0">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/20 animate-spin" style={{ animationDuration: '60s' }}></div>
          <div className="absolute inset-4 rounded-full border border-blue-500/10 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }}></div>
          <div className="absolute w-40 h-40 md:w-48 md:h-48 rounded-full bg-blue-600/5 backdrop-blur-sm border border-blue-500/20 flex items-center justify-center">
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border border-blue-500/30 flex items-center justify-center pulse-glowing bg-blue-950/20">
              <Scan className="w-12 h-12 md:w-16 md:h-16 text-blue-400" />
              {/* Scanline */}
              <div className="absolute left-0 right-0 h-0.5 bg-blue-500 scanning-line"></div>
            </div>
          </div>
        </div>
      </section>

      {/* PWA Prompt Header Banner */}
      {deferredPrompt && (
        <div className="bg-gradient-to-r from-blue-950/40 via-sky-950/30 to-slate-900/40 border border-blue-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-blue-200">Install PWA Web App</h4>
              <p className="text-xs text-gray-400 mt-0.5">Access NFC Writer instantly from your homescreen with fully sandboxed offline functionality.</p>
            </div>
          </div>
          <button 
            onClick={onInstallPWA}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap active:scale-95"
          >
            Install Now
          </button>
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* NFC Capability status card */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-400" />
                <span>NFC Compatibility Diagnosis</span>
              </h2>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${report.readyToUse ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
                {report.readyToUse ? 'Ready' : 'Diagnostic Warning'}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Web NFC allows browser-based communication with tags. Our real-time diagnostic checks the following criteria:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-gray-900/40 rounded-lg border border-gray-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-300">Web NFC API Status</span>
              </div>
              <span className={`font-semibold ${report.webNfcSupported ? 'text-emerald-400' : 'text-red-400'}`}>
                {report.webNfcSupported ? 'Supported' : 'No API'}
              </span>
            </div>

            <div className="p-3 bg-gray-900/40 rounded-lg border border-gray-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gray-500" />
                <span className="text-gray-300">Secure Protocol (HTTPS)</span>
              </div>
              <span className={`font-semibold ${report.secureContext ? 'text-emerald-400' : 'text-red-400'}`}>
                {report.secureContext ? 'Active' : 'Insecure'}
              </span>
            </div>

            <div className="p-3 bg-gray-900/40 rounded-lg border border-gray-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Chrome className="w-4 h-4 text-gray-500" />
                <span className="text-gray-300">Browser Environment</span>
              </div>
              <span className={`font-semibold ${report.isChrome ? 'text-emerald-400' : 'text-amber-400'}`}>
                {report.browserName || 'Unknown'}
              </span>
            </div>

            <div className="p-3 bg-gray-900/40 rounded-lg border border-gray-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-300">Target Operating System</span>
              </div>
              <span className={`font-semibold ${report.isAndroid ? 'text-emerald-400' : 'text-amber-400'}`}>
                {report.osName || 'Unknown'}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-800/60 flex items-center justify-between text-xs">
            <span className="text-gray-400">Detailed browser capabilities & specs</span>
            <button
              onClick={() => onNavigate('tools')}
              className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer flex items-center gap-1"
            >
              <span>Full Device Report</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Quick Tools and Core Operations Cards */}
        <div className="glass-panel rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 mb-2">
              <LayoutGrid className="w-5 h-5 text-blue-400" />
              <span>NFC Operations</span>
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Select an action to program tags, load ready-to-run templates, or format.
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => onNavigate('templates')}
              className="w-full p-3 bg-blue-950/20 border border-blue-500/10 hover:border-blue-500/30 hover:bg-blue-950/40 rounded-lg text-left flex items-center gap-3 transition-colors cursor-pointer group"
            >
              <FileText className="w-5 h-5 text-blue-400" />
              <div className="flex-1">
                <div className="font-semibold text-xs text-gray-200 group-hover:text-blue-300 transition-colors">NDEF Payload Templates</div>
                <div className="text-[10px] text-gray-400">Wi-Fi, social handles, email...</div>
              </div>
              <span className="text-gray-600 group-hover:text-blue-400 text-sm font-bold">→</span>
            </button>

            <button
              onClick={() => onNavigate('tools')}
              className="w-full p-3 bg-blue-950/20 border border-blue-500/10 hover:border-blue-500/30 hover:bg-blue-950/40 rounded-lg text-left flex items-center gap-3 transition-colors cursor-pointer group"
            >
              <Compass className="w-5 h-5 text-blue-400" />
              <div className="flex-1">
                <div className="font-semibold text-xs text-gray-200 group-hover:text-blue-300 transition-colors">Developer & System Tools</div>
                <div className="text-[10px] text-gray-400">Converters, Base64, QR codes...</div>
              </div>
              <span className="text-gray-600 group-hover:text-blue-400 text-sm font-bold">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Feature Highlights & Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Feature Cards 1 */}
        <div className="glass-panel rounded-xl p-5 space-y-2.5">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg w-fit">
            <Scan className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-gray-100">Tag Scanner</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Scan and parse contactless NFC tags instantly. Visualizer categorizes record payloads, detects active links, maps coordinates, and displays hex structures.
          </p>
        </div>

        {/* Feature Cards 2 */}
        <div className="glass-panel rounded-xl p-5 space-y-2.5">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg w-fit">
            <PenTool className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-gray-100">NFC Tag Writer</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Write customized text payloads, secure web URLs, vCards, hidden Wi-Fi connections, calendar configurations, or multi-record payloads in one go.
          </p>
        </div>

        {/* Recent Activity Panel */}
        <div className="glass-panel rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm text-gray-100 flex items-center gap-1.5">
              <HistoryIcon className="w-4 h-4 text-blue-400" />
              <span>Recent Activity Preview</span>
            </h3>
            <button
              onClick={() => onNavigate('history')}
              className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="flex-1 space-y-2 py-1">
            {recentHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-3 text-[11px] text-gray-500 space-y-1">
                <CheckCircle className="w-6 h-6 text-gray-600" />
                <span>No activities logged yet. Activity from scanning or writing tags will appear here.</span>
              </div>
            ) : (
              recentHistory.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-2 p-2 bg-gray-900/40 rounded-lg border border-gray-800/40 text-[11px]">
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-300 truncate">{item.summary}</div>
                    <div className="text-gray-500 flex items-center gap-1.5">
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span className="uppercase text-[9px] px-1 bg-gray-800 text-blue-400 rounded">{item.operation}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold ${item.status === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {item.status === 'success' ? 'OK' : 'FAIL'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
