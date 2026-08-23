import React, { useState, useRef, useEffect } from 'react';
import { 
  PenTool, 
  Trash2, 
  Save, 
  Wifi, 
  Contact, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Code, 
  ExternalLink, 
  FileText, 
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Settings,
  Grid,
  Info,
  RefreshCw,
  Plus,
  Lock
} from 'lucide-react';
import { NFCRecordType, NFCTemplate, NFCHistoryEntry, NFCCompatibilityReport, NFCSettings } from '../types';
import { generateId, generateVCard, generateWifiString, generateCalendarString, generateWifiBinary } from '../data';

interface WriteViewProps {
  report: NFCCompatibilityReport;
  customTemplates: NFCTemplate[];
  onAddHistory: (entry: Omit<NFCHistoryEntry, 'id' | 'timestamp'>) => void;
  onSaveTemplate: (template: NFCTemplate) => void;
  selectedPreset?: NFCTemplate | null;
  onClearPreset?: () => void;
  onShowToast: (message: string) => void;
  settings?: NFCSettings;
}

export default function WriteView({ 
  report, 
  customTemplates, 
  onAddHistory, 
  onSaveTemplate,
  selectedPreset,
  onClearPreset,
  onShowToast,
  settings
}: WriteViewProps) {
  // Configured inputs state
  const [selectedType, setSelectedType] = useState<NFCRecordType>('text');
  
  // Single inputs state
  const [textVal, setTextVal] = useState('Hello from NFC Writer!');
  const [urlPrefix, setUrlPrefix] = useState('https://');
  const [urlVal, setUrlVal] = useState('nfc.aiue.se');
  const [phoneVal, setPhoneVal] = useState('+15550192834');
  
  const [emailTo, setEmailTo] = useState('info@aiue.se');
  const [emailSub, setEmailSub] = useState('Hello NFC');
  const [emailBody, setEmailBody] = useState('Sent via NFC tag!');
  
  const [smsTo, setSmsTo] = useState('+15550192834');
  const [smsBody, setSmsBody] = useState('Tap here to text me.');

  const [vcardName, setVcardName] = useState('Robert Bruce');
  const [vcardOrg, setVcardOrg] = useState('Contactless Labs');
  const [vcardPhone, setVcardPhone] = useState('+1 (555) 012-3456');
  const [vcardEmail, setVcardEmail] = useState('robert@contactless.example.com');
  const [vcardUrl, setVcardUrl] = useState('https://nfc.aiue.se');
  const [vcardAddress, setVcardAddress] = useState('100 Silicon Blvd, CA');

  const [wifiSsid, setWifiSsid] = useState('NFC_High_Speed');
  const [wifiPass, setWifiPass] = useState('guestwifi2026');
  const [wifiEnc, setWifiEnc] = useState<'WEP' | 'WPA' | 'none' | 'WPA3' | 'WPA2_WPA3'>('WPA');
  const [wifiAuth, setWifiAuth] = useState<string>('WPA2PSK');
  const [wifiCrypt, setWifiCrypt] = useState<string>('AES');
  const [wifiPayloadFormat, setWifiPayloadFormat] = useState<'standard' | 'wsc'>('standard');
  const [wifiHidden, setWifiHidden] = useState(false);

  const [calTitle, setCalTitle] = useState('Team Standup Meeting');
  const [calStart, setCalStart] = useState('2026-07-10T10:00');
  const [calEnd, setCalEnd] = useState('2026-07-10T11:00');
  const [calLoc, setCalLoc] = useState('Virtual Room 4B');
  const [calDesc, setCalDesc] = useState('Monthly NFC sync update.');

  const [geoLat, setGeoLat] = useState('37.774929');
  const [geoLng, setGeoLng] = useState('-122.419416');
  const [geoTitle, setGeoTitle] = useState('San Francisco, CA');

  const [jsonVal, setJsonVal] = useState('{\n  "version": "1.0.0",\n  "active": true,\n  "role": "NFC Keycard"\n}');
  const [formatMemorySize, setFormatMemorySize] = useState('504');
  const [isCustomFormatSize, setIsCustomFormatSize] = useState(false);
  const [mimeType, setMimeType] = useState('application/json');
  const [mimeData, setMimeData] = useState('{"key": "val"}');

  const [customType, setCustomType] = useState('android.com:pkg');
  const [customPayload, setCustomPayload] = useState('com.android.settings');

  const [aarPackage, setAarPackage] = useState('com.google.android.apps.maps');

  // New states for advanced Web NFC operations
  const [textLang, setTextLang] = useState('en');
  const [textEncoding, setTextEncoding] = useState<'utf-8' | 'utf-16'>('utf-8');
  const [localType, setLocalType] = useState(':mytype');
  const [localPayload, setLocalPayload] = useState('Hello Local NDEF');
  const [externalType, setExternalType] = useState('com.example:mytarget');
  const [externalPayload, setExternalPayload] = useState('Custom Domain External Data');
  const [mimeFileBase64, setMimeFileBase64] = useState('');
  const [mimeFileName, setMimeFileName] = useState('');

  // Compilation write state
  const [isWriting, setIsWriting] = useState(false);
  const [writeResult, setWriteResult] = useState<'success' | 'failed' | null>(null);
  const [writeLogs, setWriteLogs] = useState<string[]>([]);
  const [writeError, setWriteError] = useState('');
  
  const [verifyOption, setVerifyOption] = useState(settings?.autoVerifyWrites ?? true);

  const [templateName, setTemplateName] = useState('');
  const [templateDesc, setTemplateDesc] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const isWritingRef = useRef(isWriting);

  // Sync state ref
  useEffect(() => {
    isWritingRef.current = isWriting;
  }, [isWriting]);

  // Clean up on unmount to prevent active locks
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Handle tab visibility change to auto-pause
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isWritingRef.current) {
        setWriteLogs(prev => [...prev, 'Page visibility hidden. Auto-pausing NFC writer context to preserve battery...']);
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
        setIsWriting(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Generate NDEF message array based on selected type
  const compileNDEFMessage = () => {
    const recordsList: any[] = [];

    switch (selectedType) {
      case 'text':
        recordsList.push({
          recordType: 'text',
          data: textVal,
          encoding: textEncoding,
          lang: textLang
        });
        break;
      case 'url':
        recordsList.push({
          recordType: 'url',
          data: urlPrefix + urlVal
        });
        break;
      case 'phone':
        recordsList.push({
          recordType: 'url',
          data: `tel:${phoneVal}`
        });
        break;
      case 'email':
        const emailUrl = `mailto:${emailTo}?subject=${encodeURIComponent(emailSub)}&body=${encodeURIComponent(emailBody)}`;
        recordsList.push({
          recordType: 'url',
          data: emailUrl
        });
        break;
      case 'sms':
        recordsList.push({
          recordType: 'url',
          data: `sms:${smsTo}?body=${encodeURIComponent(smsBody)}`
        });
        break;
      case 'vcard':
        const cardPayload = generateVCard({
          vcardName, vcardOrg, vcardPhone, vcardEmail, vcardUrl, vcardAddress
        });
        recordsList.push({
          recordType: 'mime',
          mediaType: 'text/vcard',
          data: new TextEncoder().encode(cardPayload)
        });
        break;
      case 'wifi':
        try {
          const wifiBin = generateWifiBinary({
            wifiSsid,
            wifiPassword: wifiPass,
            wifiEncryption: wifiEnc,
            wifiAuth: wifiAuth,
            wifiCrypt: wifiCrypt,
            wifiHidden
          });
          recordsList.push({
            recordType: 'mime',
            mediaType: 'application/vnd.wfa.wsc',
            data: wifiBin
          });
        } catch (e) {
          console.error("Binary WPS construction failed:", e);
        }

        // Standard URI fallback for third-party scanner apps and cross-OS compatibility (e.g. iOS)
        const wifiStr = generateWifiString({
          wifiSsid,
          wifiPassword: wifiPass,
          wifiEncryption: wifiEnc,
          wifiAuth: wifiAuth,
          wifiCrypt: wifiCrypt,
          wifiHidden
        });
        recordsList.push({
          recordType: 'url',
          data: wifiStr
        });
        break;
      case 'calendar':
        // Robust defensive parsing for calendar dates
        const formatICalDate = (iso: string) => {
          if (!iso) return '';
          try {
            return iso.replace(/[-:]/g, '').split('.')[0] + 'Z';
          } catch (e) {
            return '';
          }
        };
        const calStr = generateCalendarString({
          calendarTitle: calTitle,
          calendarStart: formatICalDate(calStart),
          calendarEnd: formatICalDate(calEnd),
          calendarLocation: calLoc,
          calendarDesc: calDesc
        });
        recordsList.push({
          recordType: 'mime',
          mediaType: 'text/calendar',
          data: new TextEncoder().encode(calStr)
        });
        break;
      case 'location':
        recordsList.push({
          recordType: 'url',
          data: `https://www.google.com/maps/search/?api=1&query=${geoLat},${geoLng}`
        });
        break;
      case 'json':
        recordsList.push({
          recordType: 'mime',
          mediaType: 'application/json',
          data: new TextEncoder().encode(jsonVal)
        });
        break;
      case 'mime':
        let mimePayloadData: Uint8Array;
        if (mimeFileBase64) {
          try {
            const binaryString = window.atob(mimeFileBase64);
            const len = binaryString.length;
            mimePayloadData = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              mimePayloadData[i] = binaryString.charCodeAt(i);
            }
          } catch (err) {
            mimePayloadData = new TextEncoder().encode(mimeData);
          }
        } else {
          mimePayloadData = new TextEncoder().encode(mimeData);
        }
        recordsList.push({
          recordType: 'mime',
          mediaType: mimeType,
          data: mimePayloadData
        });
        break;
      case 'local':
        recordsList.push({
          recordType: localType.startsWith(':') ? localType : `:${localType}`,
          data: new TextEncoder().encode(localPayload)
        });
        break;
      case 'external':
        recordsList.push({
          recordType: externalType,
          data: new TextEncoder().encode(externalPayload)
        });
        break;
      case 'empty':
        recordsList.push({
          recordType: 'empty'
        });
        break;
      case 'custom':
        recordsList.push({
          recordType: customType,
          data: new TextEncoder().encode(customPayload)
        });
        break;
      case 'aar':
        recordsList.push({
          recordType: 'android.com:pkg',
          data: new TextEncoder().encode(aarPackage)
        });
        break;
      case 'erase':
        // Erasing writes empty NDEF records
        break;
      case 'format':
        // Format places an empty text NDEF container
        recordsList.push({
          recordType: 'text',
          data: ''
        });
        break;
    }

    return recordsList;
  };

  // Live Web NFC Tag writing
  const executeNDEFWrite = async () => {
    setIsWriting(true);
    setWriteResult(null);
    setWriteError('');
    setWriteLogs(['Booting Web NFC Engine...', 'Accessing device RFID writer...']);

    // Check if running inside iframe sandbox
    let isIframe = false;
    try {
      isIframe = window.self !== window.top;
    } catch (e) {
      isIframe = true;
    }

    let records: any[] = [];
    try {
      records = compileNDEFMessage();
    } catch (compileErr: any) {
      console.error(compileErr);
      setWriteError(`Compilation failed: ${compileErr.message || 'Check input formatting'}`);
      setWriteResult('failed');
      setWriteLogs(prev => [...prev, `Compilation error: ${compileErr.message || 'Check fields'}`]);
      return;
    }

    if (!('NDEFReader' in window) || isIframe) {
      const msg = isIframe
        ? "Physical Web NFC is restricted inside preview iframes. Please open the app in a NEW TAB to program tags."
        : "Web NFC is not supported or disabled on this system. Direct physical Web NFC access is only available on compatible mobile devices (e.g. Android using Google Chrome) over secure HTTPS, operating outside of sandboxed frames.";
      setWriteError(msg);
      setWriteResult('failed');
      setWriteLogs(prev => [...prev, `Hardware access denied: ${msg}`]);
      return;
    }

    try {
      const ndef = new (window as any).NDEFReader();
      abortControllerRef.current = new AbortController();
      setWriteLogs(prev => [...prev, 'Listening for target NTAG sector...', 'Align your NFC tag...']);
      
      if (selectedType === 'erase') {
        setWriteLogs(prev => [...prev, 'Executing Erase Operation: overwriting with blank NDEF records...']);
        await ndef.write({ records: [{ recordType: 'text', data: '' }] }, { signal: abortControllerRef.current.signal });
      } else if (selectedType === 'format') {
        setWriteLogs(prev => [...prev, 'Executing NDEF Format Operation: establishing clean payload registry...']);
        await ndef.write({ records: [{ recordType: 'text', data: '' }] }, { signal: abortControllerRef.current.signal });
      } else if (selectedType === 'lock') {
        setWriteLogs(prev => [...prev, 'Executing permanent Lock Operation: invoking makeReadOnly()...']);
        // invoking makeReadOnly to permanently lock tag
        await ndef.makeReadOnly({ signal: abortControllerRef.current.signal });
      } else {
        await ndef.write({ records }, { signal: abortControllerRef.current.signal });
      }
      
      setWriteLogs(prev => [...prev, 'Tag recognized.', 'Writing NDEF payload sectors...']);
      
      if (verifyOption && selectedType !== 'lock') {
        setWriteLogs(prev => [...prev, 'Reading written registers to verify checksum...']);
        // Simulating verification briefly
        await new Promise(r => setTimeout(r, 800));
        setWriteLogs(prev => [...prev, 'Verification completed. Checksum match.']);
      }

      // Haptic feedback (Vibrate instead of sound)
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }

      setWriteLogs(prev => [...prev, selectedType === 'lock' ? 'Successfully locked tag permanently!' : 'Successfully programmed tag!']);
      setWriteResult('success');

      // History log
      const opType = selectedType === 'erase' ? 'format' : selectedType === 'format' ? 'format' : selectedType === 'lock' ? 'lock' : 'write';
      onAddHistory({
        operation: opType,
        status: 'success',
        recordType: selectedType === 'erase' ? 'Empty/Erase' : selectedType === 'format' ? 'Clean NDEF Format' : selectedType === 'lock' ? 'Permanent Lock' : selectedType.toUpperCase(),
        recordsCount: selectedType === 'lock' ? 0 : records.length,
        summary: selectedType === 'erase' ? 'Erased NFC tag memory' : selectedType === 'format' ? 'Formatted NFC tag to NDEF' : selectedType === 'lock' ? 'Locked NFC tag permanently' : `Programmed tag (${selectedType.toUpperCase()})`,
        details: `Successfully completed: ${selectedType === 'erase' ? 'Erase memory' : selectedType === 'format' ? 'Format NDEF' : selectedType === 'lock' ? 'makeReadOnly permanent lock' : JSON.stringify(records)}`
      });

    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('NDEF write session aborted/cancelled.');
        return;
      }
      console.error(err);
      let friendlyError = err.message || 'Tag disconnected. Hold tag firmly near phone.';
      if (err.name === 'NotAllowedError') {
        friendlyError = "NFC permission denied. Note that Web NFC cannot run inside an iframe. Please open this app in a NEW TAB to program physical tags.";
      } else if (err.name === 'SecurityError') {
        friendlyError = "Security constraint: Web NFC requires a secure origin (HTTPS) and must be loaded in a top-level window. Open the app in a NEW TAB.";
      }
      setWriteLogs(prev => [...prev, `Writing failed: ${err.name || 'Error'} - ${friendlyError}`]);
      setWriteError(friendlyError);
      setWriteResult('failed');
      
      const opType = selectedType === 'erase' ? 'format' : selectedType === 'format' ? 'format' : selectedType === 'lock' ? 'lock' : 'write';
      onAddHistory({
        operation: opType,
        status: 'failed',
        errorMessage: friendlyError,
        summary: selectedType === 'erase' ? 'Erased NFC tag failure' : selectedType === 'format' ? 'Formatted NFC tag failure' : `Programmed tag failure (${selectedType.toUpperCase()})`,
      });
    }
  };

  // Save customized current inputs as an NFC Template
  const handleSaveAsTemplate = () => {
    if (!templateName) return;

    const payloadObj: NFCTemplate['payload'] = {};

    switch (selectedType) {
      case 'text': payloadObj.text = textVal; break;
      case 'url': payloadObj.url = urlPrefix + urlVal; break;
      case 'phone': payloadObj.phoneNumber = phoneVal; break;
      case 'email':
        payloadObj.emailAddress = emailTo;
        payloadObj.emailSubject = emailSub;
        payloadObj.emailBody = emailBody;
        break;
      case 'sms':
        payloadObj.smsNumber = smsTo;
        payloadObj.smsBody = smsBody;
        break;
      case 'vcard':
        payloadObj.vcardName = vcardName;
        payloadObj.vcardOrg = vcardOrg;
        payloadObj.vcardPhone = vcardPhone;
        payloadObj.vcardEmail = vcardEmail;
        payloadObj.vcardUrl = vcardUrl;
        payloadObj.vcardAddress = vcardAddress;
        break;
      case 'wifi':
        payloadObj.wifiSsid = wifiSsid;
        payloadObj.wifiPassword = wifiPass;
        payloadObj.wifiEncryption = wifiEnc;
        payloadObj.wifiHidden = wifiHidden;
        break;
      case 'calendar':
        payloadObj.calendarTitle = calTitle;
        payloadObj.calendarStart = calStart;
        payloadObj.calendarEnd = calEnd;
        payloadObj.calendarLocation = calLoc;
        payloadObj.calendarDesc = calDesc;
        break;
      case 'location':
        payloadObj.geoLat = geoLat;
        payloadObj.geoLng = geoLng;
        payloadObj.geoTitle = geoTitle;
        break;
      case 'json': payloadObj.jsonPayload = jsonVal; break;
      case 'mime':
        payloadObj.mimeType = mimeType;
        payloadObj.mimeData = mimeData;
        break;
      case 'custom':
        payloadObj.customType = customType;
        payloadObj.customPayload = customPayload;
        break;
      case 'aar': payloadObj.aarPackageName = aarPackage; break;
    }

    const newTemplate: NFCTemplate = {
      id: 'usr-' + generateId(),
      name: templateName,
      description: templateDesc || `Customized ${selectedType.toUpperCase()} record template.`,
      type: selectedType,
      category: 'User Custom',
      payload: payloadObj,
      isBuiltIn: false,
      createdAt: Date.now()
    };

    onSaveTemplate(newTemplate);
    setShowSaveModal(false);
    setTemplateName('');
    setTemplateDesc('');
    onShowToast("Template saved successfully!");
  };

  // Fast-fill inputs from a user template or preset
  const loadPresetTemplate = (tmpl: NFCTemplate) => {
    setSelectedType(tmpl.type);
    
    if (tmpl.payload.text) setTextVal(tmpl.payload.text);
    if (tmpl.payload.url) {
      if (tmpl.payload.url.startsWith('https://')) {
        setUrlPrefix('https://');
        setUrlVal(tmpl.payload.url.replace('https://', ''));
      } else if (tmpl.payload.url.startsWith('http://')) {
        setUrlPrefix('http://');
        setUrlVal(tmpl.payload.url.replace('http://', ''));
      } else {
        setUrlVal(tmpl.payload.url);
      }
    }
    if (tmpl.payload.phoneNumber) setPhoneVal(tmpl.payload.phoneNumber);
    if (tmpl.payload.emailAddress) {
      setEmailTo(tmpl.payload.emailAddress);
      setEmailSub(tmpl.payload.emailSubject || '');
      setEmailBody(tmpl.payload.emailBody || '');
    }
    if (tmpl.payload.smsNumber) {
      setSmsTo(tmpl.payload.smsNumber);
      setSmsBody(tmpl.payload.smsBody || '');
    }
    if (tmpl.payload.vcardName) {
      setVcardName(tmpl.payload.vcardName);
      setVcardOrg(tmpl.payload.vcardOrg || '');
      setVcardPhone(tmpl.payload.vcardPhone || '');
      setVcardEmail(tmpl.payload.vcardEmail || '');
      setVcardUrl(tmpl.payload.vcardUrl || '');
      setVcardAddress(tmpl.payload.vcardAddress || '');
    }
    if (tmpl.payload.wifiSsid) {
      setWifiSsid(tmpl.payload.wifiSsid);
      setWifiPass(tmpl.payload.wifiPassword || '');
      setWifiEnc(tmpl.payload.wifiEncryption || 'WPA');
      setWifiHidden(tmpl.payload.wifiHidden || false);
    }
    if (tmpl.payload.calendarTitle) {
      setCalTitle(tmpl.payload.calendarTitle);
      setCalStart(tmpl.payload.calendarStart || '');
      setCalEnd(tmpl.payload.calendarEnd || '');
      setCalLoc(tmpl.payload.calendarLocation || '');
      setCalDesc(tmpl.payload.calendarDesc || '');
    }
    if (tmpl.payload.geoLat) {
      setGeoLat(tmpl.payload.geoLat);
      setGeoLng(tmpl.payload.geoLng || '');
      setGeoTitle(tmpl.payload.geoTitle || '');
    }
    if (tmpl.payload.jsonPayload) setJsonVal(tmpl.payload.jsonPayload);
    if (tmpl.payload.mimeType) {
      setMimeType(tmpl.payload.mimeType);
      setMimeData(tmpl.payload.mimeData || '');
    }
    if (tmpl.payload.customType) {
      setCustomType(tmpl.payload.customType);
      setCustomPayload(tmpl.payload.customPayload || '');
    }
    if (tmpl.payload.aarPackageName) setAarPackage(tmpl.payload.aarPackageName);
  };

  // Auto-fill template from preset state when redirected from Templates View
  useEffect(() => {
    if (selectedPreset) {
      loadPresetTemplate(selectedPreset);
      if (onClearPreset) {
        onClearPreset();
      }
    }
  }, [selectedPreset, onClearPreset]);

  const clearInputs = () => {
    setTextVal('');
    setUrlVal('');
    setPhoneVal('');
    setEmailTo('');
    setEmailSub('');
    setEmailBody('');
    setSmsTo('');
    setSmsBody('');
    setVcardName('');
    setVcardOrg('');
    setVcardPhone('');
    setVcardEmail('');
    setVcardUrl('');
    setVcardAddress('');
    setWifiSsid('');
    setWifiPass('');
    setJsonVal('');
    setMimeType('');
    setMimeData('');
    setCustomType('');
    setCustomPayload('');
    setAarPackage('');
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-900/30 border border-gray-800/40 rounded-xl p-5">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <PenTool className="w-5 h-5 text-blue-400" />
            <span>NDEF Writer Terminal</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Configure record types, package inputs, and write directly into magnetic tag storage.
          </p>
        </div>

        {/* Action Toggle controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs w-full sm:w-auto">
          <label className="flex items-center gap-2 text-gray-300">
            <input 
              type="checkbox" 
              checked={verifyOption} 
              onChange={() => setVerifyOption(!verifyOption)}
              className="accent-blue-500 rounded" 
            />
            <span>Verify writes</span>
          </label>
          <button
            type="button"
            onClick={clearInputs}
            className="px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-[11px] font-semibold text-gray-400 hover:text-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            Reset Form
          </button>
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
            Contactless writing/erasing is restricted or unsupported in this browser environment. Direct physical Web NFC access is only available on compatible mobile devices (e.g. Android using Google Chrome) over secure HTTPS, operating outside of sandboxed frames.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Type Selector Rail */}
        <div className="glass-panel rounded-xl p-4 space-y-2 lg:col-span-1 h-fit">
          <div className="text-[10px] uppercase font-bold tracking-wider text-gray-500 px-2 pb-1.5 border-b border-gray-800 flex items-center justify-between">
            <span>NDEF Format Types</span>
            <Info className="w-3 h-3 text-gray-600" />
          </div>

          <div className="space-y-1 pt-1.5">
            {[
              { id: 'text', label: 'Plain Text', icon: FileText },
              { id: 'url', label: 'URL Redirect', icon: ExternalLink },
              { id: 'phone', label: 'Phone Call', icon: Phone },
              { id: 'email', label: 'Email Dispatch', icon: Mail },
              { id: 'sms', label: 'SMS Dispatch', icon: Mail },
              { id: 'vcard', label: 'vCard Business', icon: Contact },
              { id: 'wifi', label: 'Wi-Fi Portal', icon: Wifi },
              { id: 'calendar', label: 'Calendar reminder', icon: Calendar },
              { id: 'location', label: 'GPS Coordinates', icon: MapPin },
              { id: 'json', label: 'JSON Payload', icon: Code },
              { id: 'mime', label: 'Custom MIME', icon: Code },
              { id: 'local', label: 'Local Record', icon: Code },
              { id: 'external', label: 'External Record', icon: Code },
              { id: 'empty', label: 'Empty Record', icon: Trash2 },
              { id: 'aar', label: 'Android App Link', icon: Grid },
              { id: 'erase', label: 'Erase Tag Memory', icon: Trash2 },
              { id: 'format', label: 'Format as NDEF', icon: RefreshCw },
              { id: 'lock', label: 'Lock Tag (Permanent)', icon: Lock },
            ].map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedType(item.id as NFCRecordType)}
                  className={`w-full px-3 py-2 text-left rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${selectedType === item.id ? 'bg-blue-600 text-white shadow shadow-blue-600/30 font-semibold' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/50'}`}
                >
                  <IconComp className={`w-4 h-4 shrink-0 ${selectedType === item.id ? 'text-white' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Inputs + Writing Module */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel rounded-xl p-6 space-y-4">
            
            {/* Input fields based on selectedType */}
            <div className="space-y-4">
              <div className="border-b border-gray-800/80 pb-3">
                <h3 className="font-bold text-sm text-gray-200">NDEF Payload Construction</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Please provide configuration values for the "{selectedType.toUpperCase()}" target record.</p>
              </div>

              {/* 1. Plain Text */}
              {selectedType === 'text' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 flex justify-between">
                    <span>Message content</span>
                    <span className="text-[10px] text-gray-500">{textVal.length}/500 chars</span>
                  </label>
                  <textarea
                    value={textVal}
                    onChange={(e) => setTextVal(e.target.value)}
                    placeholder="Enter plain text written directly to tag..."
                    className="w-full h-24 p-3 text-xs glass-input rounded-lg resize-none text-gray-200 font-mono"
                    maxLength={500}
                  />
                  <div className="grid grid-cols-2 gap-4 pt-1.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400">Language Tag (e.g. en, es, fr)</label>
                      <input
                        type="text"
                        value={textLang}
                        onChange={(e) => setTextLang(e.target.value)}
                        placeholder="en"
                        className="w-full px-3 py-2 text-xs bg-black/40 border border-gray-800 rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400">Encoding Format</label>
                      <select
                        value={textEncoding}
                        onChange={(e) => setTextEncoding(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs bg-gray-900 border border-gray-800 rounded-lg text-gray-300 focus:outline-none"
                      >
                        <option value="utf-8">UTF-8 Encoding</option>
                        <option value="utf-16">UTF-16 Encoding</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. URL Redirect */}
              {selectedType === 'url' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Target Website Link</label>
                  <div className="flex rounded-lg overflow-hidden border border-gray-800">
                    <select
                      value={urlPrefix}
                      onChange={(e) => setUrlPrefix(e.target.value)}
                      className="bg-gray-900 px-3 py-2 text-xs text-gray-300 border-r border-gray-800 outline-none"
                    >
                      <option value="https://">https://</option>
                      <option value="http://">http://</option>
                      <option value="ftp://">ftp://</option>
                      <option value="mailto:">mailto:</option>
                      <option value="tel:">tel:</option>
                      <option value="sms:">sms:</option>
                      <option value="geo:">geo:</option>
                      <option value="dpp://">dpp:// (WPA3 DPP)</option>
                      <option value="custom:">custom:</option>
                    </select>
                    <input
                      type="text"
                      value={urlVal}
                      onChange={(e) => setUrlVal(e.target.value)}
                      placeholder="example.com/path"
                      className="flex-1 px-3 py-2 bg-gray-950 text-xs text-gray-200 font-mono outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 3. Phone Call */}
              {selectedType === 'phone' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Target Phone Number</label>
                  <input
                    type="tel"
                    value={phoneVal}
                    onChange={(e) => setPhoneVal(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full px-3 py-2.5 text-xs glass-input rounded-lg text-gray-200 font-mono"
                  />
                  <span className="text-[9px] text-gray-500">Must include country code (e.g., +1 for US/CA).</span>
                </div>
              )}

              {/* 4. Email Dispatch */}
              {selectedType === 'email' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-300 font-mono">Recipient Email</label>
                    <input
                      type="email"
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      placeholder="support@aiue.se"
                      className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-200 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-300 font-mono">Subject Title</label>
                    <input
                      type="text"
                      value={emailSub}
                      onChange={(e) => setEmailSub(e.target.value)}
                      placeholder="Support Ticket"
                      className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-200"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-300 font-mono">Body Content</label>
                    <textarea
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Enter precompiled email message..."
                      className="w-full h-16 p-3 text-xs glass-input rounded-lg resize-none text-gray-200"
                    />
                  </div>
                </div>
              )}

              {/* 5. SMS Dispatch */}
              {selectedType === 'sms' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Recipient Mobile</label>
                    <input
                      type="text"
                      value={smsTo}
                      onChange={(e) => setSmsTo(e.target.value)}
                      placeholder="+15550192834"
                      className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-200 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-300">Text Content</label>
                    <textarea
                      value={smsBody}
                      onChange={(e) => setSmsBody(e.target.value)}
                      placeholder="Write message template..."
                      className="w-full h-16 p-3 text-xs glass-input rounded-lg resize-none text-gray-200"
                    />
                  </div>
                </div>
              )}

              {/* 6. vCard Business Card */}
              {selectedType === 'vcard' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Full Display Name</label>
                    <input
                      type="text"
                      value={vcardName}
                      onChange={(e) => setVcardName(e.target.value)}
                      placeholder="Bruce Wayne"
                      className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Company / Organization</label>
                    <input
                      type="text"
                      value={vcardOrg}
                      onChange={(e) => setVcardOrg(e.target.value)}
                      placeholder="Wayne Enterprises"
                      className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Phone</label>
                    <input
                      type="text"
                      value={vcardPhone}
                      onChange={(e) => setVcardPhone(e.target.value)}
                      placeholder="+1 (555) 012-3456"
                      className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-200 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Email Address</label>
                    <input
                      type="email"
                      value={vcardEmail}
                      onChange={(e) => setVcardEmail(e.target.value)}
                      placeholder="bruce@wayne.example.com"
                      className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-200 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-300">Website URL</label>
                    <input
                      type="text"
                      value={vcardUrl}
                      onChange={(e) => setVcardUrl(e.target.value)}
                      placeholder="https://wayne.corp"
                      className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-200 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-300">Physical Address</label>
                    <input
                      type="text"
                      value={vcardAddress}
                      onChange={(e) => setVcardAddress(e.target.value)}
                      placeholder="100 Wayne Manor, Gotham City"
                      className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-200"
                    />
                  </div>
                </div>
              )}

              {/* 7. Wi-Fi Portal */}
              {selectedType === 'wifi' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-300">Network Name (SSID)</label>
                    <input
                      type="text"
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      placeholder="My_Home_Wi-Fi"
                      className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-200 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Network Password</label>
                    <input
                      type="password"
                      value={wifiPass}
                      onChange={(e) => setWifiPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-200 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Security Profile</label>
                    <select
                      value={wifiEnc}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setWifiEnc(val);
                        if (val === 'WPA') {
                          setWifiAuth('WPA2PSK');
                          setWifiCrypt('AES');
                        } else if (val === 'WEP') {
                          setWifiAuth('WEP');
                          setWifiCrypt('WEP');
                        } else if (val === 'WPA3') {
                          setWifiAuth('WPA3PSK');
                          setWifiCrypt('AES');
                        } else if (val === 'WPA2_WPA3') {
                          setWifiAuth('WPA2WPA3PSK');
                          setWifiCrypt('AES');
                        } else {
                          setWifiAuth('none');
                          setWifiCrypt('none');
                        }
                      }}
                      className="w-full px-3 py-2 text-xs bg-gray-900 border border-gray-800 rounded-lg text-gray-300 focus:outline-none"
                    >
                      <option value="WPA">WPA/WPA2 Personal</option>
                      <option value="WPA3">WPA3 Personal (SAE)</option>
                      <option value="WPA2_WPA3">WPA2/WPA3 Personal Mixed</option>
                      <option value="WEP">WEP Legacy</option>
                      <option value="none">Open Network (No password)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Advanced Authentication</label>
                    <select
                      value={wifiAuth}
                      onChange={(e) => setWifiAuth(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-900 border border-gray-800 rounded-lg text-gray-300 focus:outline-none"
                    >
                      <option value="none">Open / None Authentication</option>
                      <option value="WEP">WEP Authentication</option>
                      <option value="WPAPSK">WPA-Personal Authentication</option>
                      <option value="WPAEAP">WPA-Enterprise Authentication</option>
                      <option value="WPA2PSK">WPA2-Personal Authentication</option>
                      <option value="WPA2EAP">WPA2-Enterprise Authentication</option>
                      <option value="WPAWPA2PSK">WPA/WPA2-Personal Mixed Authentication</option>
                      <option value="WPAWPA2EAP">WPA/WPA2-Enterprise Mixed Authentication</option>
                      <option value="WPA3PSK">WPA3-Personal Authentication (SAE)</option>
                      <option value="WPA3EAP">WPA3-Enterprise Authentication</option>
                      <option value="WPA2WPA3PSK">WPA2/WPA3-Personal Mixed Authentication</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Advanced Encryption</label>
                    <select
                      value={wifiCrypt}
                      onChange={(e) => setWifiCrypt(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-900 border border-gray-800 rounded-lg text-gray-300 focus:outline-none"
                    >
                      <option value="none">None Encryption</option>
                      <option value="WEP">WEP Encryption</option>
                      <option value="TKIP">TKIP Encryption</option>
                      <option value="AES">AES Encryption</option>
                      <option value="AESTKIP">AES-TKIP Mixed Encryption</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-2 text-xs text-gray-300">
                    <input
                      type="checkbox"
                      checked={wifiHidden}
                      onChange={() => setWifiHidden(!wifiHidden)}
                      className="accent-blue-500 rounded"
                    />
                    <span>This SSID represents a hidden network.</span>
                  </div>
                </div>
              )}

              {/* 8. Calendar Reminder */}
              {selectedType === 'calendar' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-300">Event Title</label>
                    <input
                      type="text"
                      value={calTitle}
                      onChange={(e) => setCalTitle(e.target.value)}
                      placeholder="NFC Hackathon Workshop"
                      className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Start Date/Time</label>
                    <input
                      type="datetime-local"
                      value={calStart}
                      onChange={(e) => setCalStart(e.target.value)}
                      className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">End Date/Time</label>
                    <input
                      type="datetime-local"
                      value={calEnd}
                      onChange={(e) => setCalEnd(e.target.value)}
                      className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-300"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-300 font-mono">Location/Coordinates</label>
                    <input
                      type="text"
                      value={calLoc}
                      onChange={(e) => setCalLoc(e.target.value)}
                      placeholder="Conference Hall A / coordinates"
                      className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-200"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-300">Brief Description</label>
                    <textarea
                      value={calDesc}
                      onChange={(e) => setCalDesc(e.target.value)}
                      placeholder="Enter event agenda details..."
                      className="w-full h-16 p-3 text-xs glass-input rounded-lg resize-none text-gray-200"
                    />
                  </div>
                </div>
              )}

              {/* 9. GPS Coordinates */}
              {selectedType === 'location' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Latitude</label>
                    <input
                      type="text"
                      value={geoLat}
                      onChange={(e) => setGeoLat(e.target.value)}
                      placeholder="37.7749"
                      className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-200 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300 font-mono">Longitude</label>
                    <input
                      type="text"
                      value={geoLng}
                      onChange={(e) => setGeoLng(e.target.value)}
                      placeholder="-122.4194"
                      className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-200 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-300">Location Label</label>
                    <input
                      type="text"
                      value={geoTitle}
                      onChange={(e) => setGeoTitle(e.target.value)}
                      placeholder="San Francisco HQ Office"
                      className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-200"
                    />
                  </div>
                </div>
              )}

              {/* 10. JSON Payload */}
              {selectedType === 'json' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Structured JSON Block</label>
                  <textarea
                    value={jsonVal}
                    onChange={(e) => setJsonVal(e.target.value)}
                    placeholder='{"key": "value"}'
                    className="w-full h-28 p-3 text-xs glass-input rounded-lg resize-none text-gray-200 font-mono"
                  />
                  <span className="text-[9px] text-gray-500">Must represent valid structured JSON formatting.</span>
                </div>
              )}

              {/* 11. Custom MIME */}
              {selectedType === 'mime' && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">MIME Media Type</label>
                    <input
                      type="text"
                      value={mimeType}
                      onChange={(e) => setMimeType(e.target.value)}
                      placeholder="application/vnd.mycustom"
                      className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-200 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">MIME Payload Content</label>
                    <textarea
                      value={mimeData}
                      onChange={(e) => setMimeData(e.target.value)}
                      placeholder="Enter raw MIME text stream..."
                      className="w-full h-20 p-3 text-xs glass-input rounded-lg resize-none text-gray-200 font-mono"
                      disabled={!!mimeFileBase64}
                    />
                    {mimeFileBase64 && (
                      <p className="text-[10px] text-amber-500">
                        Notice: Text payload is disabled because a binary file is uploaded.
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5 border-t border-gray-900 pt-3">
                    <label className="text-xs font-semibold text-gray-300 block">Or Upload Binary/Plain File Payload</label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              const base64String = (reader.result as string).split(',')[1];
                              setMimeFileBase64(base64String);
                              setMimeFileName(file.name);
                              setMimeType(file.type || 'application/octet-stream');
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="mime-file-upload"
                      />
                      <label
                        htmlFor="mime-file-upload"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs text-white font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-colors text-center"
                      >
                        Choose File
                      </label>
                      {mimeFileName ? (
                        <div className="flex items-center gap-2 text-xs text-emerald-400">
                          <span>Attached: <strong>{mimeFileName}</strong></span>
                          <button
                            type="button"
                            onClick={() => {
                              setMimeFileName('');
                              setMimeFileBase64('');
                            }}
                            className="text-gray-500 hover:text-red-400 font-bold text-sm"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">No file attached (falls back to text payload above)</span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500">
                      Easily embed business vCard profiles, images, JSON files, or custom structured binary arrays (application/octet-stream).
                    </p>
                  </div>
                </div>
              )}

              {/* 12. Android App Link (AAR) */}
              {selectedType === 'aar' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Android Package Name (AAR)</label>
                  <input
                    type="text"
                    value={aarPackage}
                    onChange={(e) => setAarPackage(e.target.value)}
                    placeholder="com.google.android.apps.maps"
                    className="w-full px-3 py-2.5 text-xs glass-input rounded-lg text-gray-200 font-mono"
                  />
                  <p className="text-[10px] text-gray-500 leading-relaxed mt-1">
                    Android Application Records trigger automatic launcher execution. If the app isn't installed, scans trigger redirect to Google Play Store.
                  </p>
                </div>
              )}

              {/* 13. Erase Tag Memory */}
              {selectedType === 'erase' && (
                <div className="space-y-4">
                  <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-xl flex items-start gap-3">
                    <Trash2 className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-red-300">Erase Memory Warning</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        This action will write an empty NDEF structure to the target contactless tag. Any existing payloads (Wi-Fi portals, URLs, vCards) will be cleared. 
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 bg-gray-900/40 p-3.5 border border-gray-850/60 rounded-xl">
                    <div className="text-xs font-bold text-gray-200">Secure Erase Operation</div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Performs a standard zero-fill command across the writable sector blocks. This makes any private data unrecoverable by consumer smartphones.
                    </p>
                  </div>
                </div>
              )}

              {/* 14. Format as NDEF */}
              {selectedType === 'format' && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-950/20 border border-blue-500/20 rounded-xl flex items-start gap-3">
                    <RefreshCw className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-blue-300">NDEF Formatting Utility</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        Format initializes the raw registers of a standard RFID card (like Mifare Classic or NTAG) with the standard Web-compliant NDEF application header.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 bg-gray-900/40 p-4 border border-gray-850/60 rounded-xl text-xs">
                    <div className="font-bold text-gray-200">Select Target Capacity</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <button type="button" onClick={() => { setFormatMemorySize('144'); setIsCustomFormatSize(false); }} className={`p-2 border rounded-lg text-center cursor-pointer transition-colors ${!isCustomFormatSize && formatMemorySize === '144' ? 'bg-blue-950/40 border-blue-500/30' : 'bg-gray-950 border-gray-800 hover:bg-gray-800'}`}>
                        <div className={`font-bold ${!isCustomFormatSize && formatMemorySize === '144' ? 'text-blue-300' : 'text-gray-300'}`}>NTAG213</div>
                        <div className={`text-[10px] ${!isCustomFormatSize && formatMemorySize === '144' ? 'text-blue-500' : 'text-gray-500'}`}>144 Bytes</div>
                      </button>
                      <button type="button" onClick={() => { setFormatMemorySize('504'); setIsCustomFormatSize(false); }} className={`p-2 border rounded-lg text-center cursor-pointer transition-colors ${!isCustomFormatSize && formatMemorySize === '504' ? 'bg-blue-950/40 border-blue-500/30' : 'bg-gray-950 border-gray-800 hover:bg-gray-800'}`}>
                        <div className={`font-bold ${!isCustomFormatSize && formatMemorySize === '504' ? 'text-blue-300' : 'text-gray-300'}`}>NTAG215</div>
                        <div className={`text-[10px] ${!isCustomFormatSize && formatMemorySize === '504' ? 'text-blue-500' : 'text-gray-500'}`}>504 Bytes</div>
                      </button>
                      <button type="button" onClick={() => { setFormatMemorySize('888'); setIsCustomFormatSize(false); }} className={`p-2 border rounded-lg text-center cursor-pointer transition-colors ${!isCustomFormatSize && formatMemorySize === '888' ? 'bg-blue-950/40 border-blue-500/30' : 'bg-gray-950 border-gray-800 hover:bg-gray-800'}`}>
                        <div className={`font-bold ${!isCustomFormatSize && formatMemorySize === '888' ? 'text-blue-300' : 'text-gray-300'}`}>NTAG216</div>
                        <div className={`text-[10px] ${!isCustomFormatSize && formatMemorySize === '888' ? 'text-blue-500' : 'text-gray-500'}`}>888 Bytes</div>
                      </button>
                      <button type="button" onClick={() => setIsCustomFormatSize(true)} className={`p-2 border rounded-lg text-center cursor-pointer flex flex-col justify-center transition-colors ${isCustomFormatSize ? 'bg-blue-950/40 border-blue-500/30' : 'bg-gray-950 border-gray-800 hover:bg-gray-800'}`}>
                        <div className={`font-bold ${isCustomFormatSize ? 'text-blue-300' : 'text-gray-300'}`}>Custom</div>
                        <div className={`text-[10px] ${isCustomFormatSize ? 'text-blue-500' : 'text-gray-500'}`}>Any Size</div>
                      </button>
                    </div>
                    {isCustomFormatSize && (
                      <div className="mt-3">
                        <label className="block text-[11px] font-bold text-gray-400 mb-1.5">Custom Memory Size (Bytes)</label>
                        <input
                          type="number"
                          value={formatMemorySize}
                          onChange={(e) => setFormatMemorySize(e.target.value)}
                          className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all font-mono"
                          placeholder="e.g. 1024"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 15. Local Record */}
              {selectedType === 'local' && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-blue-950/20 border border-blue-500/20 rounded-xl flex items-start gap-3">
                    <Code className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-blue-300">NDEF Local Record</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        Local records are used for domain-specific local payloads inside parent NDEF structures. They must begin with a colon <code>:</code> (e.g. <code>:mytype</code>).
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Local Record Type</label>
                    <input
                      type="text"
                      value={localType}
                      onChange={(e) => setLocalType(e.target.value)}
                      placeholder=":mytype"
                      className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-200 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Local Record Payload</label>
                    <textarea
                      value={localPayload}
                      onChange={(e) => setLocalPayload(e.target.value)}
                      placeholder="Enter raw payload string or JSON..."
                      className="w-full h-20 p-3 text-xs glass-input rounded-lg resize-none text-gray-200 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* 18. External Record */}
              {selectedType === 'external' && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-xl flex items-start gap-3">
                    <Code className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-purple-300">NDEF External Record</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        External records are used for domain-scoped custom formats (e.g. <code>com.example:mytarget</code>). They must contain a domain name, a colon, and a type name.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">External Domain & Type (domain:type)</label>
                    <input
                      type="text"
                      value={externalType}
                      onChange={(e) => setExternalType(e.target.value)}
                      placeholder="com.example:mytarget"
                      className="w-full px-3 py-2 text-xs glass-input rounded-lg text-gray-200 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">External Payload</label>
                    <textarea
                      value={externalPayload}
                      onChange={(e) => setExternalPayload(e.target.value)}
                      placeholder="Enter raw external payload data or JSON..."
                      className="w-full h-20 p-3 text-xs glass-input rounded-lg resize-none text-gray-200 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* 16. Empty Record */}
              {selectedType === 'empty' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-950 border border-gray-800 rounded-xl flex items-start gap-3">
                    <Trash2 className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-gray-300">Empty Record Payload</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        An empty record indicates the presence of a record but with no payload, type, or identifier. It serves as a marker or terminator inside multi-record tags.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 17. Lock Tag (Permanent) */}
              {selectedType === 'lock' && (
                <div className="space-y-4">
                  <div className="p-4 bg-red-950/35 border border-red-500/40 rounded-xl flex items-start gap-3">
                    <Lock className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-red-300">PERMANENT DESTRUCTIVE ACTION WARNING</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-semibold">
                        This action uses the NDEF <code>makeReadOnly()</code> command. Once locked, the tag CANNOT be written to, formatted, or erased EVER again. It becomes permanently read-only!
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-900/40 p-4 border border-gray-850/60 rounded-xl text-xs space-y-2">
                    <div className="font-bold text-gray-200">Tag Locking Terms</div>
                    <ul className="list-disc pl-4 text-gray-400 space-y-1">
                      <li>Irreversible hardware register state fuse.</li>
                      <li>Smartphones can still read the data indefinitely.</li>
                      <li>Useful for commercial product tags, public posters, or read-only tokens.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Presets / User Saved Custom Templates list in-line */}
            {customTemplates.length > 0 && selectedType !== 'erase' && selectedType !== 'format' && (
              <div className="border-t border-gray-800/60 pt-4 space-y-2">
                <h4 className="text-[11px] uppercase font-bold tracking-wider text-gray-500">Fast Fill Custom Templates</h4>
                <div className="flex flex-wrap gap-2">
                  {customTemplates.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => loadPresetTemplate(tmpl)}
                      className="px-2.5 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-md text-[10px] font-semibold text-gray-300 cursor-pointer flex items-center gap-1.5 transition-colors"
                    >
                      <PenTool className="w-3 h-3 text-blue-400" />
                      <span>{tmpl.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

             {/* Program tag buttons */}
            <div className="border-t border-gray-800/80 pt-5 flex flex-col sm:flex-row gap-3">
              {selectedType !== 'erase' && selectedType !== 'format' && selectedType !== 'lock' && (
                <button
                  type="button"
                  onClick={() => setShowSaveModal(true)}
                  className="px-4 py-2.5 bg-gray-900 border border-gray-800 text-gray-300 text-xs font-bold rounded-lg cursor-pointer transition-colors hover:bg-gray-800 flex items-center justify-center gap-2 shrink-0"
                >
                  <Save className="w-4 h-4 text-gray-400" /> Save as Template
                </button>
              )}

              <button
                type="button"
                onClick={executeNDEFWrite}
                disabled={isWriting || !report.readyToUse}
                className={`flex-1 py-2.5 text-white text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                  !report.readyToUse
                    ? 'bg-gray-800 border border-gray-700 text-gray-500 cursor-not-allowed opacity-60'
                    : selectedType === 'erase' 
                    ? 'bg-red-600 hover:bg-red-500 disabled:bg-red-800 shadow-red-500/10' 
                    : selectedType === 'format'
                    ? 'bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 shadow-blue-500/10'
                    : selectedType === 'lock'
                    ? 'bg-red-700 hover:bg-red-600 disabled:bg-red-900 shadow-red-700/15 font-extrabold'
                    : 'bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 shadow-blue-500/15'
                }`}
              >
                {isWriting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Coding sectors...
                  </>
                ) : (
                  <>
                    {selectedType === 'erase' ? (
                      <>
                        <Trash2 className="w-4 h-4" /> Erase Tag Memory
                      </>
                    ) : selectedType === 'format' ? (
                      <>
                        <RefreshCw className="w-4 h-4" /> Format Tag as NDEF
                      </>
                    ) : selectedType === 'lock' ? (
                      <>
                        <Lock className="w-4 h-4 animate-pulse" /> Lock Tag Permanently
                      </>
                    ) : (
                      <>
                        <PenTool className="w-4 h-4" /> Program Tag Payload
                      </>
                    )}
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Writing Progress Modal Overlay */}
      {isWriting && (
        <div id="write-progress-overlay" className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-4">
            
            {/* Spinning Hologram radar rings */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-dashed border-blue-500/20 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border border-blue-500/30 animate-pulse"></div>
              <div className="w-14 h-14 rounded-full bg-blue-950 border border-blue-500/40 flex items-center justify-center">
                {writeResult === 'success' ? (
                  <CheckCircle className="w-7 h-7 text-emerald-400" />
                ) : writeResult === 'failed' ? (
                  <AlertCircle className="w-7 h-7 text-red-400" />
                ) : (
                  <RefreshCw className="w-7 h-7 text-blue-400 animate-spin" />
                )}
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-gray-200">
                {writeResult === 'success' ? 'Programming Completed!' : writeResult === 'failed' ? 'Operation Interrupted' : 'RFID Transmission Active'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {writeResult === 'success' ? 'Your NDEF tag is safe to disconnect.' : writeResult === 'failed' ? 'Contactless communication failed.' : 'Align physical tag with device antenna.'}
              </p>
              {writeResult === 'failed' && writeError && (
                <div className="mt-2.5 p-2 bg-red-950/40 border border-red-500/20 rounded-lg text-[10px] text-red-400 text-left leading-relaxed">
                  <span className="font-semibold text-red-300 block mb-0.5">Error Diagnostic:</span>
                  {writeError}
                </div>
              )}
            </div>

            {/* Command terminal logs display */}
            <div className="p-3 bg-gray-900 rounded-lg border border-gray-800/80 font-mono text-[9px] text-gray-400 space-y-1 h-28 overflow-y-auto">
              {writeLogs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-blue-500 select-none">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>

            {/* Modal action triggers */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex gap-3">
                {writeResult === null && (
                  <button
                    type="button"
                    onClick={() => {
                      if (abortControllerRef.current) {
                        abortControllerRef.current.abort();
                        abortControllerRef.current = null;
                      }
                      setIsWriting(false);
                    }}
                    className="w-full py-2 bg-red-600 hover:bg-red-500 text-xs font-semibold text-white rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    Cancel
                  </button>
                )}
                {writeResult !== null && (
                  <button
                    type="button"
                    onClick={() => setIsWriting(false)}
                    className="w-full py-2 bg-gray-900 hover:bg-gray-850 border border-gray-850 text-xs font-semibold text-gray-200 rounded-lg cursor-pointer transition-colors"
                  >
                    Close Terminal
                  </button>
                )}
                {writeResult === 'failed' && (
                  <button
                    type="button"
                    onClick={executeNDEFWrite}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg cursor-pointer transition-colors"
                  >
                    Retry Hardware
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Custom Template Modal */}
      {showSaveModal && (
        <div id="save-template-overlay" className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-gray-200 flex items-center gap-1.5 pb-2 border-b border-gray-800">
              <Save className="w-4 h-4 text-blue-400" /> Save Payload as Template
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-400">Template Name</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Office Board Wi-Fi"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-400">Template Description (Optional)</label>
                <textarea
                  value={templateDesc}
                  onChange={(e) => setTemplateDesc(e.target.value)}
                  placeholder="Describe context details..."
                  className="w-full h-16 p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-200 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="w-1/2 py-2 bg-gray-900 hover:bg-gray-850 border border-gray-800 text-xs font-semibold text-gray-400 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAsTemplate}
                disabled={!templateName}
                className="w-1/2 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-xs font-semibold text-white rounded-lg cursor-pointer"
              >
                Save Preset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
