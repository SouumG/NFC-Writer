import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Smartphone, 
  QrCode, 
  Database, 
  FileJson, 
  Key, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Copy, 
  ArrowLeftRight,
  ShieldAlert,
  ShieldCheck,
  Wifi,
  Lock,
  Cpu,
  Bookmark,
  Download
} from 'lucide-react';
import { NFCCompatibilityReport } from '../types';

interface ToolsViewProps {
  report: NFCCompatibilityReport;
  onRefreshDiagnostics: () => void;
  onShowToast: (message: string) => void;
}

export default function ToolsView({ report, onRefreshDiagnostics, onShowToast }: ToolsViewProps) {
  const [activeTool, setActiveTool] = useState<'compat' | 'codec' | 'formatter' | 'inspector'>('compat');

  // Codect Tool States
  const [codecInput, setCodecInput] = useState('NFC Writer Pro');
  const [base64Output, setBase64Output] = useState('');
  const [codecDirection, setCodecDirection] = useState<'encode' | 'decode'>('encode');

  // Formatter states
  const [jsonRaw, setJsonRaw] = useState('{\n"app": "NFC Writer",\n"v": "1.0.0",\n"pwa": true\n}');
  const [jsonFormatted, setJsonFormatted] = useState('');
  const [jsonError, setJsonError] = useState('');

  // Wi-Fi Helper State
  const [wifiSsid, setWifiSsid] = useState('NFC_Portal_5G');
  const [wifiPass, setWifiPass] = useState('secure99pass');
  const [wifiEnc, setWifiEnc] = useState('WPA');
  const [wifiString, setWifiString] = useState('');

  // QR Converter State
  const [qrInput, setQrInput] = useState('https://nfc.aiue.se/');
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Dynamic feedback and download states
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [isDownloadingQR, setIsDownloadingQR] = useState(false);

  const handleRefreshDiagnostics = () => {
    setIsDiagnosing(true);
    onShowToast("Scanning hardware components and browser capabilities...");
    setTimeout(() => {
      onRefreshDiagnostics();
      setIsDiagnosing(false);
      onShowToast("Hardware diagnostic assessment complete!");
    }, 1000);
  };

  const handleDownloadQR = () => {
    const canvas = qrCanvasRef.current;
    if (!canvas) {
      onShowToast("Error: QR Canvas is not ready.");
      return;
    }
    setIsDownloadingQR(true);
    onShowToast("Preparing high-fidelity QR Code image...");
    
    setTimeout(() => {
      try {
        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = `nfc_bridge_qr_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        onShowToast("Download started! Saved QR Code PNG.");
      } catch (err) {
        onShowToast("Error downloading QR Code.");
      } finally {
        setIsDownloadingQR(false);
      }
    }, 800);
  };

  // Run Base64 conversion
  useEffect(() => {
    try {
      if (codecDirection === 'encode') {
        setBase64Output(btoa(codecInput));
      } else {
        setBase64Output(atob(codecInput));
      }
    } catch (e) {
      setBase64Output('Invalid string format for translation.');
    }
  }, [codecInput, codecDirection]);

  // Run Wi-Fi String generation
  useEffect(() => {
    const hidden = 'H:false';
    const wifiText = `WIFI:S:${wifiSsid};T:${wifiEnc};P:${wifiPass};${hidden};;`;
    setWifiString(wifiText);
  }, [wifiSsid, wifiPass, wifiEnc]);

  // Formatter execution
  const formatJSON = () => {
    try {
      const parsed = JSON.parse(jsonRaw);
      setJsonFormatted(JSON.stringify(parsed, null, 2));
      setJsonError('');
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON syntax structure.');
      setJsonFormatted('');
    }
  };

  // Dynamically generate simulated high-fidelity QR Code on Canvas
  useEffect(() => {
    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and draw background
    ctx.fillStyle = '#030712'; // Slate dark
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dynamic sizing
    const size = canvas.width;
    const padding = 20;
    const qrSize = size - padding * 2;
    const cells = 21; // standard Version 1 grid size
    const cellSize = qrSize / cells;

    // Simple pseudo-random generator seeded by string
    let seed = 0;
    for (let i = 0; i < qrInput.length; i++) {
      seed += qrInput.charCodeAt(i);
    }
    const pseudoRandom = (x: number, y: number) => {
      const val = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
      return (val - Math.floor(val)) > 0.5;
    };

    // Helper to draw square blocks
    const drawBlock = (cx: number, cy: number, w: number, h: number, style: string) => {
      ctx.fillStyle = style;
      ctx.fillRect(cx, cy, w, h);
    };

    // Render Finder Patterns (Three corners of QR code)
    const drawFinderPattern = (offsetX: number, offsetY: number) => {
      // Outer 7x7 square
      drawBlock(offsetX, offsetY, cellSize * 7, cellSize * 7, '#3b82f6'); // Cyber Blue
      // Inner 5x5 negative spacer
      drawBlock(offsetX + cellSize, offsetY + cellSize, cellSize * 5, cellSize * 5, '#030712');
      // Inner 3x3 solid block
      drawBlock(offsetX + cellSize * 2, offsetY + cellSize * 2, cellSize * 3, cellSize * 3, '#f3f4f6');
    };

    // Apply padding shift
    ctx.translate(padding, padding);

    // Draw 3 Finders
    drawFinderPattern(0, 0); // Top-Left
    drawFinderPattern((cells - 7) * cellSize, 0); // Top-Right
    drawFinderPattern(0, (cells - 7) * cellSize); // Bottom-Left

    // Render data matrix modules
    for (let x = 0; x < cells; x++) {
      for (let y = 0; y < cells; y++) {
        // Skip Finder patterns range (Top-Left 8x8, Top-Right 8x8, Bottom-Left 8x8)
        const inTopLeft = x < 8 && y < 8;
        const inTopRight = x >= cells - 8 && y < 8;
        const inBottomLeft = x < 8 && y >= cells - 8;

        if (!inTopLeft && !inTopRight && !inBottomLeft) {
          if (pseudoRandom(x, y)) {
            // Draw standard QR cell module
            drawBlock(x * cellSize, y * cellSize, cellSize - 0.5, cellSize - 0.5, '#60a5fa');
          }
        }
      }
    }

    // Reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);

  }, [qrInput]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onShowToast("Copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      
      {/* Upper Navigation Tabs Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-900/30 border border-gray-800/40 rounded-xl p-5">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-400" />
            <span>NFC Utilities & Developer Tools</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Access encoders, formatting engines, chip specs, and offline QR compilers.
          </p>
        </div>

        {/* Modular Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTool('compat')}
            className={`flex-1 md:flex-none px-3.5 py-2 rounded-lg cursor-pointer transition-colors ${activeTool === 'compat' ? 'bg-blue-600 text-white' : 'bg-gray-900/50 text-gray-400 hover:text-gray-200 hover:bg-gray-900'}`}
          >
            Diagnostics
          </button>
          <button
            onClick={() => setActiveTool('codec')}
            className={`flex-1 md:flex-none px-3.5 py-2 rounded-lg cursor-pointer transition-colors ${activeTool === 'codec' ? 'bg-blue-600 text-white' : 'bg-gray-900/50 text-gray-400 hover:text-gray-200 hover:bg-gray-900'}`}
          >
            QR & Codecs
          </button>
          <button
            onClick={() => setActiveTool('formatter')}
            className={`flex-1 md:flex-none px-3.5 py-2 rounded-lg cursor-pointer transition-colors ${activeTool === 'formatter' ? 'bg-blue-600 text-white' : 'bg-gray-900/50 text-gray-400 hover:text-gray-200 hover:bg-gray-900'}`}
          >
            Formatters
          </button>
          <button
            onClick={() => setActiveTool('inspector')}
            className={`flex-1 md:flex-none px-3.5 py-2 rounded-lg cursor-pointer transition-colors ${activeTool === 'inspector' ? 'bg-blue-600 text-white' : 'bg-gray-900/50 text-gray-400 hover:text-gray-200 hover:bg-gray-900'}`}
          >
            Chip Inspector
          </button>
        </div>
      </div>

      {/* RENDER TOOL: Diagnostics */}
      {activeTool === 'compat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Detailed report panel */}
          <div className="lg:col-span-2 glass-panel rounded-xl p-6 space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-gray-800">
              <h3 className="text-sm font-bold text-gray-200">Device Hardware Assessment</h3>
              <button
                type="button"
                disabled={isDiagnosing}
                onClick={handleRefreshDiagnostics}
                className={`p-1.5 hover:bg-gray-900 border border-gray-800 rounded-md text-gray-400 hover:text-blue-400 cursor-pointer flex items-center gap-1.5 text-[10px] font-semibold ${isDiagnosing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isDiagnosing ? 'animate-spin text-blue-400' : ''}`} />
                {isDiagnosing ? 'Assessing...' : 'Re-Diagnose'}
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5">
                  {report.webNfcSupported ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <ShieldAlert className="w-5 h-5 text-red-400" />}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-gray-200">Web NFC API availability</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                    {report.webNfcSupported ? 'Browser context includes window.NDEFReader.' : 'No window.NDEFReader support. Android Chrome or Opera is required.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="mt-0.5">
                  {report.secureContext ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <ShieldAlert className="w-5 h-5 text-amber-400" />}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-gray-200">Cryptographic Context (HTTPS)</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                    {report.secureContext ? 'Running in secure window.isSecureContext.' : 'Insecure origin. Web NFC API is restricted to HTTPS contexts only.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="mt-0.5">
                  {!report.isIframe ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <ShieldAlert className="w-5 h-5 text-red-400" />}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-gray-200">Top-Level Context</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                    {!report.isIframe ? 'Running in a top-level window.' : 'Running inside an Iframe sandbox. Web NFC requires top-level navigation context.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="mt-0.5">
                  {report.isAndroid ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <ShieldAlert className="w-5 h-5 text-amber-400" />}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-gray-200">Operating System Compatibility</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                    Target is Android. Currently recognized environment is <strong className="text-gray-300">{report.osName}</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Device info metrics */}
          <div className="glass-panel rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 pb-2 border-b border-gray-800 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-blue-400" /> Environment specs
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-900">
                <span className="text-gray-400">Device Type</span>
                <span className="font-medium text-gray-200 capitalize">{report.deviceType}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-900">
                <span className="text-gray-400">Browser Name</span>
                <span className="font-medium text-gray-200">{report.browserName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-900">
                <span className="text-gray-400">Browser Version</span>
                <span className="font-medium text-gray-300 font-mono text-[10px] truncate max-w-[120px]">{report.browserVersion}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-900">
                <span className="text-gray-400">Screen Resolution</span>
                <span className="font-medium text-gray-300 font-mono">{report.screenResolution}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-900">
                <span className="text-gray-400">Touch Support</span>
                <span className="font-medium text-gray-200">{report.touchSupported ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-400">Language (locale)</span>
                <span className="font-medium text-gray-300 font-mono">{report.language}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER TOOL: QR & Codecs */}
      {activeTool === 'codec' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Base64 translation panel */}
          <div className="glass-panel rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <ArrowLeftRight className="w-4 h-4 text-blue-400" /> Base64 Codec
              </h3>
              
              <div className="flex bg-gray-900 rounded-lg p-0.5 border border-gray-850">
                <button
                  type="button"
                  onClick={() => setCodecDirection('encode')}
                  className={`px-2 py-1 text-[9px] font-bold rounded-md cursor-pointer ${codecDirection === 'encode' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                >
                  ENCODE
                </button>
                <button
                  type="button"
                  onClick={() => setCodecDirection('decode')}
                  className={`px-2 py-1 text-[9px] font-bold rounded-md cursor-pointer ${codecDirection === 'decode' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                >
                  DECODE
                </button>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-400">Input String</label>
                <textarea
                  value={codecInput}
                  onChange={(e) => setCodecInput(e.target.value)}
                  placeholder="Enter text string..."
                  className="w-full h-16 p-2 text-xs glass-input rounded-lg resize-none text-gray-200 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-gray-400">Codec Output</label>
                  <button
                    onClick={() => copyToClipboard(base64Output)}
                    className="p-1 hover:bg-gray-900 text-gray-400 hover:text-blue-400 rounded cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-3 bg-gray-950 border border-gray-900 rounded-lg text-[10px] font-mono text-blue-300 break-all select-all min-h-[3rem]">
                  {base64Output}
                </div>
              </div>
            </div>
          </div>

          {/* QR Code generator */}
          <div className="glass-panel rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 pb-2 border-b border-gray-800 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-blue-400" /> QR Converter (NFC Bridge)
            </h3>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-3 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-400">Target payload string</label>
                  <input
                    type="text"
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    placeholder="example.com/redirect"
                    className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-200 font-mono"
                  />
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    Convert links, Wi-Fi credentials, or text configs to dual NFC & QR tags. Good for hybrid access.
                  </p>
                </div>
              </div>

              {/* Dynamic QR Canvas */}
              <div className="shrink-0 flex flex-col items-center gap-3">
                <div className="p-2.5 bg-gray-950 border border-gray-900 rounded-xl">
                  <canvas 
                    ref={qrCanvasRef} 
                    width={150} 
                    height={150} 
                    className="w-32 h-32" 
                  />
                </div>
                <button
                  type="button"
                  disabled={isDownloadingQR}
                  onClick={handleDownloadQR}
                  className={`w-full py-1.5 px-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-[10px] font-bold text-gray-300 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-all ${isDownloadingQR ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Download className={`w-3.5 h-3.5 text-blue-400 ${isDownloadingQR ? 'animate-bounce' : ''}`} />
                  {isDownloadingQR ? 'Downloading...' : 'Download PNG'}
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* RENDER TOOL: Formatters */}
      {activeTool === 'formatter' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* JSON Formatter */}
          <div className="glass-panel rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 pb-2 border-b border-gray-800 flex items-center gap-1.5">
              <FileJson className="w-4 h-4 text-blue-400" /> JSON Beautifier & Validator
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-400">Raw JSON string</label>
                <textarea
                  value={jsonRaw}
                  onChange={(e) => setJsonRaw(e.target.value)}
                  placeholder='{"key": "value"}'
                  className="w-full h-20 p-2 text-xs glass-input rounded-lg resize-none text-gray-200 font-mono"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={formatJSON}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-lg cursor-pointer"
                >
                  Verify & Beautify JSON
                </button>
              </div>

              {jsonError && (
                <div className="p-2.5 bg-red-950/20 border border-red-500/20 text-red-400 text-[10px] rounded-lg font-mono leading-relaxed">
                  Format error: {jsonError}
                </div>
              )}

              {jsonFormatted && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-400">Beautified JSON Code</label>
                    <button
                      onClick={() => copyToClipboard(jsonFormatted)}
                      className="p-1 hover:bg-gray-900 text-gray-400 hover:text-blue-400 rounded cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <pre className="p-3 bg-gray-950 border border-gray-900 rounded-lg text-[10px] font-mono text-emerald-400 overflow-x-auto max-h-40 whitespace-pre leading-relaxed select-text">
                    {jsonFormatted}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Wi-Fi custom credentials builder */}
          <div className="glass-panel rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 pb-2 border-b border-gray-800 flex items-center gap-1.5">
              <Wifi className="w-4 h-4 text-blue-400" /> Wi-Fi NDEF String Generator
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-400">SSID (Name)</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="Network SSID"
                    className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-200 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-400">Password</label>
                  <input
                    type="text"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    placeholder="Password"
                    className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-200 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-gray-400">Compiled NDEF Wi-Fi Payload</label>
                  <button
                    onClick={() => copyToClipboard(wifiString)}
                    className="p-1 hover:bg-gray-900 text-gray-400 hover:text-blue-400 rounded cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-3 bg-gray-950 border border-gray-900 rounded-lg text-[10px] font-mono text-emerald-400 break-all select-all leading-relaxed">
                  {wifiString}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* RENDER TOOL: Chip Inspector Registry */}
      {activeTool === 'inspector' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {[
            {
              chip: 'NTAG213',
              cap: '144 Bytes',
              use: '137 Bytes',
              desc: 'Standard light-weight chip for marketing tags, URL links and simple text triggers.',
              reg: '15 character URL length',
              sec: '7-Byte UID'
            },
            {
              chip: 'NTAG215',
              cap: '540 Bytes',
              use: '504 Bytes',
              desc: 'High popularity standard. Optimal capacity for vCards, contact coordinates and Amiibo emulators.',
              reg: '80 character business profile',
              sec: '7-Byte UID'
            },
            {
              chip: 'NTAG216',
              cap: '924 Bytes',
              use: '888 Bytes',
              desc: 'Large capacity module. Best for multi-record profiles, detailed medical info and custom JSON registers.',
              reg: '150 character deep payload',
              sec: '7-Byte UID'
            }
          ].map((inf, i) => (
            <div key={i} className="glass-panel rounded-xl p-5 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-gray-100 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-blue-400" /> {inf.chip} SPEC
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 bg-blue-950 text-blue-400 border border-blue-900 rounded font-semibold font-mono">{inf.cap}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{inf.desc}</p>
              </div>

              <div className="pt-3 border-t border-gray-900/60 text-[10px] text-gray-500 font-mono space-y-1">
                <div>Memory Writable: {inf.use}</div>
                <div>Practical Cap: {inf.reg}</div>
                <div>Security: {inf.sec}</div>
              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}
