import React, { useState, useRef } from 'react';
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
}

export default function ReadView({ report, onAddHistory }: ReadViewProps) {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [records, setRecords] = useState<any[]>([]);
  const [showRaw, setShowRaw] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // Stop scanning
  const stopScanning = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setScanState('idle');
  };

  // Real Web NFC Scan
  const startRealScan = async () => {
    if (!('NDEFReader' in window)) {
      setErrorMessage("Web NFC is not supported in this browser. Try our Mock Scanner to test!");
      setScanState('error');
      return;
    }

    try {
      setScanState('scanning');
      setErrorMessage('');
      
      const ndef = new NDEFReader();
      abortControllerRef.current = new AbortController();
      
      await ndef.scan({ signal: abortControllerRef.current.signal });

      ndef.onreading = (event: any) => {
        const serial = event.serialNumber || 'N/A';
        setSerialNumber(serial);
        
        const parsedRecords = event.message.records.map((record: any) => {
          const decoder = new TextDecoder();
          let payloadText = '';
          
          try {
            payloadText = decoder.decode(record.data);
          } catch (e) {
            payloadText = 'Binary data';
          }

          return {
            recordType: record.recordType,
            mediaType: record.mediaType || '',
            id: record.id || '',
            rawData: record.data ? new Uint8Array(record.data.buffer) : new Uint8Array(0),
            text: payloadText
          };
        });

        setRecords(parsedRecords);
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

        stopScanning();
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
      console.error(err);
      setErrorMessage(err.message || "Failed to start NFC scan.");
      setScanState('error');
    }
  };

  // Mock Scan Injection for Desktop & Reviewers
  const injectMockScan = (preset: 'wifi' | 'vcard' | 'url' | 'location' | 'text' | 'json') => {
    setScanState('scanning');
    
    setTimeout(() => {
      const serial = '04:A2:BC:92:4F:5D:80';
      setSerialNumber(serial);
      
      let mockRecords: any[] = [];

      switch (preset) {
        case 'wifi':
          mockRecords = [{
            recordType: 'text',
            mediaType: '',
            id: 'wifi-1',
            rawData: new TextEncoder().encode('WIFI:S:Guest_Cabin;T:WPA;P:mountainpass101;H:false;;'),
            text: 'WIFI:S:Guest_Cabin;T:WPA;P:mountainpass101;H:false;;'
          }];
          break;
        case 'vcard':
          mockRecords = [{
            recordType: 'text',
            mediaType: '',
            id: 'vcard-1',
            rawData: new TextEncoder().encode('BEGIN:VCARD\nVERSION:3.0\nFN:Diana Prince\nORG:Justice Org\nTEL;TYPE=CELL:+1 (555) 762-3788\nEMAIL;TYPE=PREF,INTERNET:diana.prince@league.example.com\nURL:https://nfc.aiue.se/bio/diana\nEND:VCARD'),
            text: 'BEGIN:VCARD\nVERSION:3.0\nFN:Diana Prince\nORG:Justice Org\nTEL;TYPE=CELL:+1 (555) 762-3788\nEMAIL;TYPE=PREF,INTERNET:diana.prince@league.example.com\nURL:https://nfc.aiue.se/bio/diana\nEND:VCARD'
          }];
          break;
        case 'url':
          mockRecords = [{
            recordType: 'url',
            mediaType: '',
            id: 'url-1',
            rawData: new TextEncoder().encode('https://nfc.aiue.se/info'),
            text: 'https://nfc.aiue.se/info'
          }];
          break;
        case 'location':
          mockRecords = [{
            recordType: 'text',
            mediaType: '',
            id: 'geo-1',
            rawData: new TextEncoder().encode('geo:48.8584,2.2945'),
            text: 'geo:48.8584,2.2945'
          }];
          break;
        case 'json':
          mockRecords = [{
            recordType: 'mime',
            mediaType: 'application/json',
            id: 'json-1',
            rawData: new TextEncoder().encode('{"deviceId": "sensor-099", "status": "active", "reading": 42.8, "alert": false}'),
            text: '{"deviceId": "sensor-099", "status": "active", "reading": 42.8, "alert": false}'
          }];
          break;
        default:
          mockRecords = [{
            recordType: 'text',
            mediaType: '',
            id: 'text-1',
            rawData: new TextEncoder().encode('Welcome to NFC Writer. This plain text record is written to a standard NTAG215 tag payload.'),
            text: 'Welcome to NFC Writer. This plain text record is written to a standard NTAG215 tag payload.'
          }];
      }

      setRecords(mockRecords);
      setScanState('success');

      // Save to History
      onAddHistory({
        operation: 'read',
        status: 'success',
        recordType: mockRecords[0]?.recordType || 'NDEF Message',
        recordsCount: mockRecords.length,
        summary: `Mock Scanned tag (${preset.toUpperCase()})`,
        details: JSON.stringify({ serialNumber: serial, records: mockRecords.map(r => ({ recordType: r.recordType, text: r.text })) })
      });
    }, 1500);
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
  };

  const shareText = (text: string) => {
    if (navigator.share) {
      navigator.share({ title: 'NFC Read Payload', text });
    } else {
      navigator.clipboard.writeText(text);
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
              onClick={stopScanning}
              className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" /> Cancel Scan
            </button>
          ) : (
            <button
              onClick={startRealScan}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-blue-500/10 active:scale-95"
            >
              <Scan className="w-4 h-4" /> Start Live Scan
            </button>
          )}
        </div>
      </div>

      {/* Mock Scanning Injector for Desktop testing */}
      {!report.webNfcSupported && scanState === 'idle' && (
        <div className="bg-blue-950/20 border border-blue-500/20 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-blue-400 animate-pulse" />
            <h3 className="font-semibold text-xs text-blue-200">Interactive Mock NFC Simulator</h3>
          </div>
          <p className="text-[11px] text-gray-400">
            Since your browser cannot access NFC antennas directly, click a simulation preset below to test how the diagnostic visualizer parses, decodes, and formats live NDEF tags:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button onClick={() => injectMockScan('wifi')} className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-[10px] rounded-md font-medium text-gray-300 flex items-center gap-1 cursor-pointer transition-colors">
              <Wifi className="w-3 h-3 text-sky-400" /> Wi-Fi Preset
            </button>
            <button onClick={() => injectMockScan('vcard')} className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-[10px] rounded-md font-medium text-gray-300 flex items-center gap-1 cursor-pointer transition-colors">
              <Contact className="w-3 h-3 text-emerald-400" /> Business Card
            </button>
            <button onClick={() => injectMockScan('url')} className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-[10px] rounded-md font-medium text-gray-300 flex items-center gap-1 cursor-pointer transition-colors">
              <ExternalLink className="w-3 h-3 text-blue-400" /> URL Preset
            </button>
            <button onClick={() => injectMockScan('location')} className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-[10px] rounded-md font-medium text-gray-300 flex items-center gap-1 cursor-pointer transition-colors">
              <MapPin className="w-3 h-3 text-red-400" /> Location Maps
            </button>
            <button onClick={() => injectMockScan('json')} className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-[10px] rounded-md font-medium text-gray-300 flex items-center gap-1 cursor-pointer transition-colors">
              <Code className="w-3 h-3 text-purple-400" /> JSON Payload
            </button>
            <button onClick={() => injectMockScan('text')} className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-[10px] rounded-md font-medium text-gray-300 flex items-center gap-1 cursor-pointer transition-colors">
              <FileText className="w-3 h-3 text-amber-400" /> Plain Text
            </button>
          </div>
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
          <div className="text-center max-w-sm space-y-4 z-10">
            <div className="relative w-20 h-20 bg-blue-950/40 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto pulse-glowing">
              <Scan className="w-9 h-9 text-blue-400" />
              {/* Spinning Loader Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-t-transparent border-blue-500 animate-spin"></div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue-300">Searching for Contactless Tag...</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Hold tag firmly against the center of device back cover. Do not move during transmission.
              </p>
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
                let isJson = false;
                try {
                  if (record.mediaType === 'application/json' || (record.text.startsWith('{') && record.text.endsWith('}'))) {
                    JSON.parse(record.text);
                    isJson = true;
                  }
                } catch(e){}

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
                                <div className="text-[10px] text-gray-500 mt-1">Encryption: {wifiInfo.wifiEncryption} • Hidden: {wifiInfo.wifiHidden ? 'Yes' : 'No'}</div>
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
                        {isJson && (
                          <div className="p-3 bg-purple-950/15 border border-purple-500/10 rounded-lg space-y-1.5 font-mono text-[10px]">
                            <div className="text-[9px] text-purple-400 font-semibold uppercase tracking-wider font-sans">Structured JSON Message</div>
                            <pre className="text-gray-300 overflow-x-auto whitespace-pre p-2 bg-gray-950 rounded border border-gray-900">{JSON.stringify(JSON.parse(record.text), null, 2)}</pre>
                          </div>
                        )}

                        {/* DEFAULT PAYLOAD: Standard display text */}
                        {!isUrl && !isWifi && !isVCard && !isLocation && !isJson && (
                          <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg text-xs leading-relaxed text-gray-300 select-text whitespace-pre-wrap">
                            {record.text}
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
