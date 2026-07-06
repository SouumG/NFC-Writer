import React from 'react';
import { AlertCircle, Chrome, Smartphone, ShieldCheck, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { NFCCompatibilityReport } from '../types';

interface CompatibilityBannerProps {
  report: NFCCompatibilityReport;
  onNavigateToTools: () => void;
}

export default function CompatibilityBanner({ report, onNavigateToTools }: CompatibilityBannerProps) {
  if (report.readyToUse) {
    return (
      <div id="comp-banner-ready" className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 rounded-xl p-4 mb-6 flex items-start gap-3 backdrop-blur-sm">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-emerald-200">NFC Engine Active & Compatible</h3>
          <p className="text-xs text-emerald-400/90 mt-0.5">
            Your system is fully compatible with Web NFC. All reading, writing, and formatting tools are active.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="comp-banner-warning" className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-4 mb-6 backdrop-blur-md">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-amber-200">Limited Capability Mode</h3>
          <p className="text-xs text-amber-400/80 mt-1 leading-relaxed">
            NFC hardware communication is unavailable on this browser/device setup. You can still design templates, formulate payloads, and use coding tools, but direct tag scanning and writing requires physical hardware support.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-3 text-[11px]">
            <div className={`p-2 rounded-lg flex items-center gap-2 ${report.webNfcSupported ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/10' : 'bg-red-950/20 text-red-400 border border-red-500/10'}`}>
              <Smartphone className="w-3.5 h-3.5" />
              <span>Web NFC: {report.webNfcSupported ? 'Available' : 'Unsupported'}</span>
            </div>
            <div className={`p-2 rounded-lg flex items-center gap-2 ${report.secureContext ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/10' : 'bg-amber-950/20 text-amber-400 border border-amber-500/10'}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Context: {report.secureContext ? 'Secure (HTTPS)' : 'Insecure (HTTP)'}</span>
            </div>
            <div className={`p-2 rounded-lg flex items-center gap-2 ${report.isAndroid && report.isChrome ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/10' : 'bg-amber-950/20 text-amber-400 border border-amber-500/10'}`}>
              <Chrome className="w-3.5 h-3.5" />
              <span>Environment: {report.browserName} on {report.osName}</span>
            </div>
            <div className={`p-2 rounded-lg flex items-center gap-2 ${!report.isIframe ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/10' : 'bg-red-950/20 text-red-400 border border-red-500/10'}`}>
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Frame: {report.isIframe ? 'Iframe Sandbox' : 'Top Level'}</span>
            </div>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row gap-x-4 gap-y-2.5 items-center justify-between border-t border-amber-500/10 pt-3">
            <div className="text-[11px] text-gray-400">
              <span className="font-medium text-amber-300">Quick Fix:</span> {report.isIframe ? (
                <span>Web NFC is blocked inside iframe sandboxes. Open the app directly in a <strong className="text-white">New Tab</strong> to activate NFC features.</span>
              ) : (
                <span>Use <strong className="text-white">Chrome Browser</strong> on an <strong className="text-white">Android Device</strong> over <strong className="text-white">HTTPS</strong>.</span>
              )}
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {report.isIframe && (
                <a
                  href={window.location.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/35 rounded-lg text-[10px] font-bold text-amber-200 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  Open in New Tab
                </a>
              )}
              <button
                type="button"
                onClick={onNavigateToTools}
                className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                Run Diagnostics <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
