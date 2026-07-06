import React, { useState, useRef, useEffect } from 'react';
import { 
  Scan, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  Share2, 
  FileText, 
  ExternalLink, 
  MapPin, 
  Wifi, 
  Contact, 
  Code, 
  ToggleLeft, 
  ToggleRight, 
  Save, 
  Plus,
  Play
} from 'lucide-react';
import { NFCHistoryEntry, NFCCompatibilityReport } from '../types';
import { parseVCardString, parseWifiString } from '../data';

interface ReadViewProps {
  report: NFCCompatibilityReport;
  onAddHistory: (entry: Omit<NFCHistoryEntry, 'id' | 'timestamp'>) => void;
  onShowToast: (message: string) => void;
}

export default function ReadView({ report, onAddHistory, onShowToast }: ReadViewProps) {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'error' | 'paused'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [records, setRecords] = useState<any[]>([]);
  const [showRaw, setShowRaw] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // Handle visibility change to auto-pause and auto-resume scanning
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && scanState === 'scanning') {
        setScanLogs(prev => [...prev, 'Page visibility hidden. Auto-pausing NFC scanning context to preserve battery...']);
        stopScanning(true);
        setScanState('paused');
      } else if (!document.hidden && scanState === 'paused') {
        setScanLogs(prev => [...prev, 'Page visibility restored. Resuming NFC scanning context...']);
        startRealScan();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [scanState]);

  // Stop scanning
  const stopScanning = (keepState = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (!keepState) {
      setScanState('idle');
    }
  };

  // Real Web NFC Scan
  const startRealScan = async () => {
    try {
      let isIframe = false;
      try {
        isIframe = window.self !== window.top;
      } catch (e) {
        isIframe = true;
      }
      
      if (isIframe || !('NDEFReader' in window)) {
        setErrorMessage("Web NFC is restricted or unsupported in this browser/environment. Web NFC requires HTTPS, a compatible Android mobile device, and must run in a top-level tab (not inside an iframe).");
        setScanState('error');
        return;
      }

      setScanState('scanning');
      setErrorMessage('');
      setScanLogs([
        'Initializing Web NFC scanning controller...',
        'Powering up device RFID reader (13.56 MHz band)...',
        'Listening for contactless transponder targets...'
      ]);
      
      const ndef = new NDEFReader();
      abortControllerRef.current = new AbortController();
      
      await ndef.scan({ signal: abortControllerRef.current.signal });

      ndef.onreading = (event: any) => {
        try {
          const serial = event.serialNumber || 'N/A';
          setSerialNumber(serial);
          
          setScanLogs(prev => [
            ...prev,
            'Contactless transponder magnetic field response detected!',
            `Successfully read tag hardware UID: ${serial}`,
            'Siphoning NDEF sector bytes...',
            'Demultiplexing record payloads...'
          ]);
          
          const recordsList = event.message?.records || [];
          const parsedRecords = recordsList.map((record: any) => {
            let payloadText = '';
            let bytes = new Uint8Array(0);
            
            if (record.data) {
              try {
                bytes = new Uint8Array(record.data.buffer, record.data.byteOffset, record.data.byteLength);
              } catch (e) {
                console.error('Failed to parse DataView buffer:', e);
              }
            }

            try {
              if (record.recordType === 'text') {
                const encoding = record.encoding || 'utf-8';
                const decoder = new TextDecoder(encoding);
                payloadText = decoder.decode(record.data);
              } else if (record.recordType === 'url') {
                const decoder = new TextDecoder('utf-8');
                payloadText = decoder.decode(record.data);
              } else {
                // Try standard UTF-8 decode for MIME, JSON, etc.
                const decoder = new TextDecoder('utf-8');
                payloadText = decoder.decode(record.data);
              }
            } catch (e) {
              try {
                payloadText = new TextDecoder().decode(bytes);
              } catch (err) {
                payloadText = 'Binary data';
              }
            }

            return {
              recordType: record.recordType,
              mediaType: record.mediaType || '',
              id: record.id || '',
              rawData: bytes,
              text: payloadText,
              lang: record.lang || '',
              encoding: record.encoding || 'utf-8'
            };
          });

          // Haptic Feedback / Device Vibration
          if (navigator.vibrate) {
            navigator.vibrate(200);
          }

          setRecords(parsedRecords);
          setScanLogs(prev => [
            ...prev,
            `Extracting complete. Found ${parsedRecords.length} record(s).`,
            'Rendering tag details...'
          ]);
          setScanState('success');
          
          // Save to History
          onAddHistory({
            operation: 'read',
            status: 'success',
            recordType: parsedRecords[0]?.recordType || 'NDEF Message',
            recordsCount: parsedRecords.length,
            summary: `Scanned tag (${serial})`,
            details: JSON.stringify({ serialNumber: serial, records: parsedRecords.map(r => ({ recordType: r.recordType, text: r.text })) })
          });

          stopScanning(true);
        } catch (onReadingErr: any) {
          console.error("Error in onreading event handler:", onReadingErr);
          setErrorMessage("Error parsing scanned tag: " + onReadingErr.message);
          setScanState('error');
          stopScanning(false);
        }
      };

      ndef.onreadingerror = () => {
        setErrorMessage("Hardware Reading Error: Failed to read NFC tag. Make sure tag is aligned.");
        setScanState('error');
        onAddHistory({
          operation: 'read',
          status: 'failed',
          errorMessage: 'Hardware Reading Error',
          summary: 'Scanned tag read failure',
        });
      };

    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('NFC scanning session stopped/cancelled.');
        setScanState(prev => prev === 'success' ? 'success' : 'idle');
        return;
      }
      console.error(err);
      setErrorMessage(err.message || "Failed to start NFC scan.");
      setScanState('error');
    }
  };

  // Convert array to hex string
  const toHexString = (byteArray: Uint8Array) => {
    return Array.from(byteArray, byte => {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2).toUpperCase();
    }).join(' ');
  };

  // Helper to format raw data for text views
  const toAsciiString = (byteArray: Uint8Array) => {
    return Array.from(byteArray, byte => {
      return (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.';
    }).join('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onShowToast("Payload copied to clipboard!");
  };

  const shareText = (text: string) => {
    if (navigator.share) {
      navigator.share({ title: 'NFC Read Payload', text });
      onShowToast("Payload shared!");
    } else {
      navigator.clipboard.writeText(text);
      onShowToast("Payload copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Upper Status/Actions header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-900/30 border border-gray-800/40 rounded-xl p-5">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Scan className="w-5 h-5 text-blue-400" />
            <span>NFC Read Terminal</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Tap "Start Scan" and bring an NFC tag close to your device antenna.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {scanState === 'scanning' ? (
            <button
              type="button"
              onClick={() => stopScanning()}
              className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" /> Cancel Scan
            </button>
          ) : (
            <button
              type="button"
              onClick={startRealScan}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 shadow-blue-500/10 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <Scan className="w-4 h-4" /> Start Live Scan
            </button>
          )}
        </div>
      </div>

      {/* Hardware Compatibility Alert */}
      {!report.readyToUse && (
        <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <h3 className="font-semibold text-xs text-red-200">Hardware Compatibility Alert: NFC Not Available</h3>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Contactless scanning is restricted or unsupported in this browser environment. Direct physical Web NFC access is only available on compatible mobile devices (e.g. Android using Google Chrome) over secure HTTPS, operating outside of sandboxed frames.
          </p>
        </div>
      )}

      {/* Main Terminal Screen */}
      <div className="relative min-h-[350px] rounded-2xl border border-gray-800 bg-gray-950 flex flex-col items-center justify-center p-6 overflow-hidden">
        
        {/* Radar Backdrop if Scanning */}
        {scanState === 'scanning' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-80 h-80 rounded-full border border-blue-500/15 animate-ping" style={{ animationDuration: '3s' }}></div>
            <div className="w-64 h-64 rounded-full border border-blue-500/10 animate-ping" style={{ animationDuration: '2s' }}></div>
            <div className="w-48 h-48 rounded-full border border-blue-500/5 animate-ping" style={{ animationDuration: '1s' }}></div>
          </div>
        )}

        {/* State: IDLE */}
        {scanState === 'idle' && (
          <div className="text-center max-w-sm space-y-4 z-10">
            <div className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-400">
              <Scan className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200">NFC Reader Idle</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Terminal ready to poll RFID/NFC sectors. Ensure device NFC is activated, then click start scan to listen.
              </p>
            </div>
          </div>
        )}

        {/* State: SCANNING */}
        {scanState === 'scanning' && (
          <div className="w-full max-w-md space-y-5 z-10 flex flex-col items-center">
            <div className="text-center space-y-2">
              <div className="relative w-16 h-16 bg-blue-950/40 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto pulse-glowing">
                <Scan className="w-7 h-7 text-blue-400" />
                {/* Spinning Loader Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-t-transparent border-blue-500 animate-spin"></div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-blue-300">
                  Searching for Contactless Tag...
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                  Hold tag firmly against the back of your device.
                </p>
              </div>
            </div>

            {/* Diagnostic Terminal Logs */}
            <div className="w-full bg-black/80 border border-gray-800/80 rounded-xl p-4 font-mono text-[10px] text-gray-400 text-left space-y-1.5 h-36 overflow-y-auto shadow-inner">
              {scanLogs.map((log, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-blue-500 select-none">&gt;</span>
                  <span className={index === scanLogs.length - 1 ? "text-gray-200 font-semibold animate-pulse" : ""}>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* State: ERROR */}
        {scanState === 'error' && (
          <div className="text-center max-w-md space-y-4 z-10 p-4">
            <div className="w-16 h-16 bg-red-950/30 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-red-400">Scan Connection Interrupted</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => setScanState('idle')}
              className="px-4 py-2 bg-gray-900 border border-gray-800 text-[11px] font-semibold text-gray-300 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            >
              Reset Terminal
            </button>
          </div>
        )}

        {/* State: SUCCESS (Render full details) */}
        {scanState === 'success' && (
          <div className="w-full z-10 space-y-6">
            {/* Header tag info metadata */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-800">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h3 className="font-bold text-sm text-gray-200">NDEF Message Extracted</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">UID / Serial: <span className="font-mono text-gray-300">{serialNumber}</span></p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRaw(!showRaw)}
                  className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-[10px] rounded-lg font-semibold text-gray-300 flex items-center gap-1.5 cursor-pointer"
                >
                  {showRaw ? <ToggleRight className="w-4 h-4 text-blue-400" /> : <ToggleLeft className="w-4 h-4 text-gray-500" />}
                  <span>Hex Raw Hex-Dump</span>
                </button>
                <button
                  onClick={() => setScanState('idle')}
                  className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-[10px] rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Scan Another
                </button>
              </div>
            </div>

            {/* Render Records */}
            <div className="space-y-4">
              {records.map((record, index) => {
                const hexString = toHexString(record.rawData || new Uint8Array(0));
                const asciiString = toAsciiString(record.rawData || new Uint8Array(0));
                
                // Parse specifics for dynamic widgets
                let isUrl = record.recordType === 'url' || record.text.startsWith('http://') || record.text.startsWith('https://');
                let isWifi = record.text.startsWith('WIFI:');
                let isVCard = record.text.includes('BEGIN:VCARD');
                let isLocation = record.text.startsWith('geo:');
                let isHs = record.recordType === 'Hs' || record.recordType === ':Hs' || record.recordType === 'handover' || record.recordType === ':handover';
                let isLocalRecord = record.recordType && record.recordType.startsWith(':') && !isHs;
                let isJson = false;
                try {
                  if (record.mediaType === 'application/json' || (record.text.startsWith('{') && record.text.endsWith('}'))) {
                    JSON.parse(record.text);
                    isJson = true;
                  }
                } catch(e){}

                let isImage = record.mediaType && record.mediaType.startsWith('image/');
                let imageUrl = '';
                if (isImage && record.rawData && record.rawData.length > 0) {
                  try {
                    const blob = new Blob([record.rawData], { type: record.mediaType });
                    imageUrl = URL.createObjectURL(blob);
                  } catch(e) {
                    console.error("Failed to generate Object URL for image", e);
                  }
                }

                return (
                  <div key={index} className="p-4 bg-gray-900/30 rounded-xl border border-gray-800/80 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-950 text-blue-400 border border-blue-900 rounded text-[9px] font-bold uppercase">
                          Record #{index + 1}: {record.recordType}
                        </span>
                        {record.mediaType && (
                          <span className="text-[10px] text-gray-500 font-mono">
                            Mime: {record.mediaType}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(record.text)}
                          className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-gray-200 cursor-pointer"
                          title="Copy Payload"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => shareText(record.text)}
                          className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-gray-200 cursor-pointer"
                          title="Share Payload"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Conditional Widget rendering */}
                    {!showRaw ? (
                      <div className="space-y-2">
                        {/* WIDGET: URL */}
                        {isUrl && (
                          <div className="p-3 bg-blue-950/20 border border-blue-500/10 rounded-lg flex items-center justify-between">
                            <div className="min-w-0">
                              <div className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">Identified Link</div>
                              <div className="text-xs text-gray-300 font-mono truncate mt-0.5">{record.text}</div>
                            </div>
                            <a
                              href={record.text}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white shrink-0 cursor-pointer transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}

                        {/* WIDGET: Wi-Fi */}
                        {isWifi && (() => {
                          const wifiInfo = parseWifiString(record.text);
                          return (
                            <div className="p-3 bg-emerald-950/20 border border-emerald-500/10 rounded-lg flex items-center justify-between">
                              <div>
                                <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Wi-Fi Connection Payload</div>
                                <div className="text-xs text-gray-200 font-bold mt-1">Network Name (SSID): <span className="font-mono text-gray-100">{wifiInfo.wifiSsid}</span></div>
                                <div className="text-[11px] text-gray-400 mt-0.5">Password: <span className="font-mono select-all bg-gray-900 px-1 py-0.5 rounded border border-gray-800 text-gray-200">{wifiInfo.wifiPassword}</span></div>
                                <div className="text-[10px] text-gray-500 mt-1">
                                  Encryption: {wifiInfo.wifiEncryption}
                                  {wifiInfo.wifiAuth && wifiInfo.wifiAuth !== 'none' && ` (${wifiInfo.wifiAuth})`}
                                  {wifiInfo.wifiCrypt && wifiInfo.wifiCrypt !== 'none' && ` • Crypt: ${wifiInfo.wifiCrypt}`}
                                  • Hidden: {wifiInfo.wifiHidden ? 'Yes' : 'No'}
                                </div>
                              </div>
                              <div className="p-2 bg-emerald-900/30 text-emerald-400 border border-emerald-500/20 rounded-lg shrink-0">
                                <Wifi className="w-5 h-5" />
                              </div>
                            </div>
                          );
                        })()}

                        {/* WIDGET: vCard / Contact Card */}
                        {isVCard && (() => {
                          const contactInfo = parseVCardString(record.text);
                          return (
                            <div className="p-3 bg-indigo-950/20 border border-indigo-500/10 rounded-lg flex items-start gap-3">
                              <div className="p-2.5 bg-indigo-900/30 text-indigo-400 border border-indigo-500/20 rounded-lg shrink-0">
                                <Contact className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0 text-xs">
                                <div className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">vCard Contact Extract</div>
                                <div className="text-sm font-bold text-gray-200 mt-1">{contactInfo.vcardName || 'N/A'}</div>
                                {contactInfo.vcardOrg && <div className="text-gray-400">{contactInfo.vcardOrg}</div>}
                                <div className="mt-2 space-y-1 text-gray-400 font-mono text-[10px]">
                                  {contactInfo.vcardPhone && <div>Tel: <span className="text-gray-300">{contactInfo.vcardPhone}</span></div>}
                                  {contactInfo.vcardEmail && <div>Email: <span className="text-gray-300">{contactInfo.vcardEmail}</span></div>}
                                  {contactInfo.vcardUrl && <div className="truncate">Web: <span className="text-blue-400 hover:underline">{contactInfo.vcardUrl}</span></div>}
                                  {contactInfo.vcardAddress && <div className="truncate">Addr: <span className="text-gray-300">{contactInfo.vcardAddress}</span></div>}
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* WIDGET: Location geo-marker */}
                        {isLocation && (() => {
                          const coords = record.text.replace('geo:', '').split(',');
                          const lat = coords[0];
                          const lng = coords[1];
                          const mapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                          return (
                            <div className="p-3 bg-red-950/20 border border-red-500/10 rounded-lg flex items-center justify-between">
                              <div>
                                <div className="text-[10px] text-red-400 font-semibold uppercase tracking-wider">Location Marker</div>
                                <div className="text-xs text-gray-200 mt-1">Coordinates: <span className="font-mono text-gray-100">{lat}, {lng}</span></div>
                                <div className="text-[10px] text-gray-500 mt-0.5">Launches GPS navigation maps software directly.</div>
                              </div>
                              <a
                                href={mapsLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-red-600 hover:bg-red-500 rounded-md text-white shrink-0 cursor-pointer transition-colors"
                              >
                                <MapPin className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          );
                        })()}

                        {/* WIDGET: JSON Format */}
                        {isJson && !isImage && (
                          <div className="p-3 bg-purple-950/15 border border-purple-500/10 rounded-lg space-y-1.5 font-mono text-[10px]">
                            <div className="text-[9px] text-purple-400 font-semibold uppercase tracking-wider font-sans">Structured JSON Message</div>
                            <pre className="text-gray-300 overflow-x-auto whitespace-pre p-2 bg-gray-950 rounded border border-gray-900">{JSON.stringify(JSON.parse(record.text), null, 2)}</pre>
                          </div>
                        )}

                        {/* WIDGET: Embedded Image payload */}
                        {isImage && imageUrl && (
                          <div className="p-3 bg-gray-950 rounded-lg border border-gray-900 flex flex-col items-center gap-2">
                            <div className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider self-start">Embedded NFC Image payload ({record.mediaType})</div>
                            <img
                              src={imageUrl}
                              alt="NFC Payload"
                              className="max-h-64 object-contain rounded border border-gray-800"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}

                        {/* WIDGET: Handover Select (Hs) */}
                        {isHs && (
                          <div className="p-3 bg-cyan-950/20 border border-cyan-500/10 rounded-lg flex items-start gap-3">
                            <div className="p-2.5 bg-cyan-900/30 text-cyan-400 border border-cyan-500/20 rounded-lg shrink-0">
                              <Share2 className="w-5 h-5 animate-pulse" />
                            </div>
                            <div className="flex-1 min-w-0 text-xs">
                              <div className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">NFC Handover Select (Hs) Protocol</div>
                              <div className="text-sm font-bold text-gray-200 mt-1">Connection Handover Negotiator</div>
                              <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                                Facilitates automatic device pairing. Standard NFC hardware uses this handover protocol to establish high-speed wireless Direct sessions.
                              </p>
                              <div className="mt-2 text-gray-300 font-mono text-[10px] bg-gray-950/80 p-2 rounded border border-gray-900 overflow-x-auto">
                                Payload: {record.text}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* WIDGET: Local Record */}
                        {isLocalRecord && (
                          <div className="p-3 bg-amber-950/15 border border-amber-500/10 rounded-lg flex items-start gap-3">
                            <div className="p-2.5 bg-amber-900/30 text-amber-400 border border-amber-500/20 rounded-lg shrink-0">
                              <Code className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0 text-xs">
                              <div className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Local NDEF Record Context</div>
                              <div className="text-sm font-bold text-gray-200 mt-1">Type Scope: {record.recordType}</div>
                              <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                                Used internally within application frameworks to bundle private context payloads.
                              </p>
                              <div className="mt-2 text-gray-300 font-mono text-[10px] bg-gray-950/80 p-2 rounded border border-gray-900 overflow-x-auto">
                                Payload: {record.text}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* DEFAULT PAYLOAD: Standard display text */}
                        {!isUrl && !isWifi && !isVCard && !isLocation && !isJson && !isImage && !isHs && !isLocalRecord && (
                          <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg text-xs leading-relaxed text-gray-300 select-text whitespace-pre-wrap">
                            {record.text}
                          </div>
                        )}

                        {/* Text Record Metadata Tags (lang/encoding) */}
                        {record.recordType === 'text' && (
                          <div className="text-[10px] text-gray-500 font-mono flex items-center gap-4 px-1 pt-1">
                            <span>Language: <strong className="text-gray-300 font-semibold">{record.lang || 'en'}</strong></span>
                            <span>Encoding: <strong className="text-gray-300 font-semibold">{record.encoding || 'utf-8'}</strong></span>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Hex Editor view */
                      <div className="space-y-2 font-mono text-[10px]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-3 bg-gray-950 rounded-lg border border-gray-900 text-gray-400 overflow-x-auto leading-relaxed">
                            <div className="text-[9px] text-gray-500 font-sans font-semibold mb-1 uppercase">Hexadecimal Block View</div>
                            <div className="whitespace-pre select-all text-blue-400">{hexString || 'NO BYTE DATA'}</div>
                          </div>
                          <div className="p-3 bg-gray-950 rounded-lg border border-gray-900 text-gray-400 overflow-x-auto leading-relaxed">
                            <div className="text-[9px] text-gray-500 font-sans font-semibold mb-1 uppercase">ISO Latin-1 Plain Representation</div>
                            <div className="whitespace-pre select-all text-gray-300">{asciiString || 'NO BYTE DATA'}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Safety & educational guidance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500 leading-relaxed bg-gray-900/10 border border-gray-800/30 rounded-xl p-4">
        <div>
          <h4 className="font-semibold text-gray-300 mb-1">Standard Contactless Protocol</h4>
          <p>
            Standard NFC reads operate within high frequency channels (13.56 MHz) over a safe distance range of less than 4 cm. Ensure tag antenna tracks are not warped or snapped.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-300 mb-1">NDEF Message Specifications</h4>
          <p>
            The NFC Data Exchange Format (NDEF) stores structured records inside a tag's memory registers. Once scanned, data structures are parsed on your local CPU dynamically.
          </p>
        </div>
      </div>

    </div>
  );
}
