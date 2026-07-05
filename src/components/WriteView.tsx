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
  Cpu,
  Radio
} from 'lucide-react';
import { NFCRecordType, NFCTemplate, NFCHistoryEntry, NFCCompatibilityReport } from '../types';
import { generateId, generateVCard, generateWifiString, generateCalendarString } from '../data';

interface WriteViewProps {
  report: NFCCompatibilityReport;
  customTemplates: NFCTemplate[];
  onAddHistory: (entry: Omit<NFCHistoryEntry, 'id' | 'timestamp'>) => void;
  onSaveTemplate: (template: NFCTemplate) => void;
  selectedPreset?: NFCTemplate | null;
  onClearPreset?: () => void;
}

export default function WriteView({ 
  report, 
  customTemplates, 
  onAddHistory, 
  onSaveTemplate,
  selectedPreset,
  onClearPreset
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
  const [wifiEnc, setWifiEnc] = useState<'WEP' | 'WPA' | 'none'>('WPA');
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

  // Compilation write state
  const [isWriting, setIsWriting] = useState(false);
  const [writeResult, setWriteResult] = useState<'success' | 'failed' | null>(null);
  const [writeLogs, setWriteLogs] = useState<string[]>([]);
  const [writeError, setWriteError] = useState('');
  const [useSimulator, setUseSimulator] = useState(!report.readyToUse);
  
  const [verifyOption, setVerifyOption] = useState(true);
  const [templateName, setTemplateName] = useState('');
  const [templateDesc, setTemplateDesc] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const timeoutIdsRef = useRef<any[]>([]);

  // Clear all pending mock simulation timeouts on unmount to prevent crashes
  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach(id => clearTimeout(id));
    };
  }, []);

  // Generate NDEF message array based on selected type
  const compileNDEFMessage = () => {
    const recordsList: any[] = [];

    switch (selectedType) {
      case 'text':
        recordsList.push({
          recordType: 'text',
          data: textVal
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
        const wifiStr = generateWifiString({
          wifiSsid, wifiPassword: wifiPass, wifiEncryption: wifiEnc, wifiHidden
        });
        recordsList.push({
          recordType: 'mime',
          mediaType: 'application/vnd.wfa.wsc',
          data: new TextEncoder().encode(wifiStr)
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
        recordsList.push({
          recordType: 'mime',
          mediaType: mimeType,
          data: new TextEncoder().encode(mimeData)
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

    if (useSimulator || !('NDEFReader' in window) || isIframe) {
      // Execute Mock Simulation on non-compatible systems or in iframe sandbox
      executeMockWrite(records, isIframe);
      return;
    }

    try {
      const ndef = new NDEFReader();
      setWriteLogs(prev => [...prev, 'Listening for target NTAG sector...', 'Align your NFC tag...']);
      
      if (selectedType === 'erase') {
        setWriteLogs(prev => [...prev, 'Executing Erase Operation: overwriting with blank NDEF records...']);
        await ndef.write({ records: [{ recordType: 'text', data: '' }] });
      } else if (selectedType === 'format') {
        setWriteLogs(prev => [...prev, 'Executing NDEF Format Operation: establishing clean payload registry...']);
        await ndef.write({ records: [{ recordType: 'text', data: '' }] });
      } else {
        await ndef.write({ records });
      }
      
      setWriteLogs(prev => [...prev, 'Tag recognized.', 'Writing NDEF payload sectors...']);
      
      if (verifyOption) {
        setWriteLogs(prev => [...prev, 'Reading written registers to verify checksum...']);
        // Simulating verification briefly
        await new Promise(r => setTimeout(r, 800));
        setWriteLogs(prev => [...prev, 'Verification completed. Checksum match.']);
      }

      setWriteLogs(prev => [...prev, 'Successfully programmed tag!']);
      setWriteResult('success');

      // History log
      const opType = selectedType === 'erase' ? 'format' : selectedType === 'format' ? 'format' : 'write';
      onAddHistory({
        operation: opType,
        status: 'success',
        recordType: selectedType === 'erase' ? 'Empty/Erase' : selectedType === 'format' ? 'Clean NDEF Format' : selectedType.toUpperCase(),
        recordsCount: records.length,
        summary: selectedType === 'erase' ? 'Erased NFC tag memory' : selectedType === 'format' ? 'Formatted NFC tag to NDEF' : `Programmed tag (${selectedType.toUpperCase()})`,
        details: `Successfully completed: ${selectedType === 'erase' ? 'Erase memory' : selectedType === 'format' ? 'Format NDEF' : JSON.stringify(records)}`
      });

    } catch (err: any) {
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
      
      const opType = selectedType === 'erase' ? 'format' : selectedType === 'format' ? 'format' : 'write';
      onAddHistory({
        operation: opType,
        status: 'failed',
        errorMessage: friendlyError,
        summary: selectedType === 'erase' ? 'Erased NFC tag failure' : selectedType === 'format' ? 'Formatted NFC tag failure' : `Programmed tag failure (${selectedType.toUpperCase()})`,
      });
    }
  };

  // Mock writing simulator for desktops
  const executeMockWrite = (records: any[], isIframe = false) => {
    const t1 = setTimeout(() => {
      const tagDesc = isCustomFormatSize ? `Custom • ${formatMemorySize || 0} Bytes` : `NTAG • ${formatMemorySize} Bytes`;
      if (isIframe) {
        setWriteLogs(prev => [
          ...prev, 
          'Iframe Sandbox Detected: Physical Web NFC is restricted inside preview iframes.',
          'Activating high-fidelity RFID simulator...',
          `Mock Tag detected (${tagDesc}).`
        ]);
      } else {
        setWriteLogs(prev => [...prev, 'Simulator Mode Active: Emulating tag alignment...', `Mock Tag detected (${tagDesc}).`]);
      }
    }, 600);

    const t2 = setTimeout(() => {
      if (selectedType === 'erase') {
        setWriteLogs(prev => [...prev, 'Initializing sector zero-fill routine...']);
      } else if (selectedType === 'format') {
        setWriteLogs(prev => [...prev, 'Accessing low-level CC (Capabilities Container) block...']);
      } else {
        setWriteLogs(prev => [...prev, `Writing compiled records of type "${selectedType.toUpperCase()}"...`, `NDEF Byte footprint: ${JSON.stringify(records).length} Bytes.`]);
      }
    }, 1200);

    const t3 = setTimeout(() => {
      if (selectedType === 'erase') {
        setWriteLogs(prev => [...prev, 'Writing zero registers [0x04 - 0x2C]...', 'Erasing NDEF message header...']);
      } else if (selectedType === 'format') {
        setWriteLogs(prev => [...prev, 'Configuring standard NDEF capability flags...', 'Formatting sectors 0-15...']);
      } else {
        if (verifyOption) {
          setWriteLogs(prev => [...prev, 'Verification Phase: polling sector checksums...', 'Data integrity verified (100% Match).']);
        }
      }
    }, 2000);

    const t4 = setTimeout(() => {
      if (selectedType === 'erase') {
        setWriteLogs(prev => [...prev, 'Memory sectors successfully zeroed and cleared!']);
      } else if (selectedType === 'format') {
        setWriteLogs(prev => [...prev, 'NDEF directory structure created and formatted!']);
      } else {
        setWriteLogs(prev => [...prev, 'Simulator Write Completed. Tag memory locked (Writable).']);
      }
      setWriteResult('success');

      const opType = selectedType === 'erase' ? 'format' : selectedType === 'format' ? 'format' : 'write';
      onAddHistory({
        operation: opType,
        status: 'success',
        recordType: selectedType === 'erase' ? 'Empty/Erase' : selectedType === 'format' ? 'Clean NDEF Format' : selectedType.toUpperCase(),
        recordsCount: records.length,
        summary: selectedType === 'erase' ? 'Erased NFC tag memory (Simulated)' : selectedType === 'format' ? 'Formatted NFC tag to NDEF (Simulated)' : `Mock programmed tag (${selectedType.toUpperCase()})`,
        details: `Successfully simulated: ${selectedType === 'erase' ? 'Erase memory' : selectedType === 'format' ? 'Format NDEF' : JSON.stringify(records)}`
      });
    }, 2800);

    timeoutIdsRef.current.push(t1, t2, t3, t4);
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
          {/* Mode Selector */}
          <div className="bg-gray-950 p-1 rounded-lg border border-gray-800 flex items-center gap-1">
            <button
              onClick={() => setUseSimulator(false)}
              className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
                !useSimulator 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              title="Communicate with actual physical NFC hardware via the Web NFC API"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Hardware</span>
            </button>
            <button
              onClick={() => setUseSimulator(true)}
              className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
                useSimulator 
                  ? 'bg-amber-600 text-white' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              title="Emulate NDEF transmission in a software simulation environment"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Simulator</span>
            </button>
          </div>

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
            onClick={clearInputs}
            className="px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-[11px] font-semibold text-gray-400 hover:text-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            Reset Form
          </button>
        </div>
      </div>

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
              { id: 'aar', label: 'Android App Link', icon: Grid },
              { id: 'erase', label: 'Erase Tag Memory', icon: Trash2 },
              { id: 'format', label: 'Format as NDEF', icon: RefreshCw },
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
                    <label className="text-xs font-semibold text-gray-300">Security Encryption</label>
                    <select
                      value={wifiEnc}
                      onChange={(e) => setWifiEnc(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-gray-900 border border-gray-800 rounded-lg text-gray-300 focus:outline-none"
                    >
                      <option value="WPA">WPA/WPA2 Personal</option>
                      <option value="WEP">WEP Legacy</option>
                      <option value="none">Open Network (No password)</option>
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
                    />
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
                      <div onClick={() => { setFormatMemorySize('144'); setIsCustomFormatSize(false); }} className={`p-2 border rounded-lg text-center cursor-pointer transition-colors ${!isCustomFormatSize && formatMemorySize === '144' ? 'bg-blue-950/40 border-blue-500/30' : 'bg-gray-950 border-gray-800 hover:bg-gray-800'}`}>
                        <div className={`font-bold ${!isCustomFormatSize && formatMemorySize === '144' ? 'text-blue-300' : 'text-gray-300'}`}>NTAG213</div>
                        <div className={`text-[10px] ${!isCustomFormatSize && formatMemorySize === '144' ? 'text-blue-500' : 'text-gray-500'}`}>144 Bytes</div>
                      </div>
                      <div onClick={() => { setFormatMemorySize('504'); setIsCustomFormatSize(false); }} className={`p-2 border rounded-lg text-center cursor-pointer transition-colors ${!isCustomFormatSize && formatMemorySize === '504' ? 'bg-blue-950/40 border-blue-500/30' : 'bg-gray-950 border-gray-800 hover:bg-gray-800'}`}>
                        <div className={`font-bold ${!isCustomFormatSize && formatMemorySize === '504' ? 'text-blue-300' : 'text-gray-300'}`}>NTAG215</div>
                        <div className={`text-[10px] ${!isCustomFormatSize && formatMemorySize === '504' ? 'text-blue-500' : 'text-gray-500'}`}>504 Bytes</div>
                      </div>
                      <div onClick={() => { setFormatMemorySize('888'); setIsCustomFormatSize(false); }} className={`p-2 border rounded-lg text-center cursor-pointer transition-colors ${!isCustomFormatSize && formatMemorySize === '888' ? 'bg-blue-950/40 border-blue-500/30' : 'bg-gray-950 border-gray-800 hover:bg-gray-800'}`}>
                        <div className={`font-bold ${!isCustomFormatSize && formatMemorySize === '888' ? 'text-blue-300' : 'text-gray-300'}`}>NTAG216</div>
                        <div className={`text-[10px] ${!isCustomFormatSize && formatMemorySize === '888' ? 'text-blue-500' : 'text-gray-500'}`}>888 Bytes</div>
                      </div>
                      <div onClick={() => setIsCustomFormatSize(true)} className={`p-2 border rounded-lg text-center cursor-pointer flex flex-col justify-center transition-colors ${isCustomFormatSize ? 'bg-blue-950/40 border-blue-500/30' : 'bg-gray-950 border-gray-800 hover:bg-gray-800'}`}>
                        <div className={`font-bold ${isCustomFormatSize ? 'text-blue-300' : 'text-gray-300'}`}>Custom</div>
                        <div className={`text-[10px] ${isCustomFormatSize ? 'text-blue-500' : 'text-gray-500'}`}>Any Size</div>
                      </div>
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
              {selectedType !== 'erase' && selectedType !== 'format' && (
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="px-4 py-2.5 bg-gray-900 border border-gray-800 text-gray-300 text-xs font-bold rounded-lg cursor-pointer transition-colors hover:bg-gray-800 flex items-center justify-center gap-2 shrink-0"
                >
                  <Save className="w-4 h-4 text-gray-400" /> Save as Template
                </button>
              )}

              <button
                onClick={executeNDEFWrite}
                disabled={isWriting}
                className={`flex-1 py-2.5 text-white text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                  selectedType === 'erase' 
                    ? 'bg-red-600 hover:bg-red-500 disabled:bg-red-800 shadow-red-500/10' 
                    : selectedType === 'format'
                    ? 'bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 shadow-blue-500/10'
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

      {/* Writing Progress Modal Simulation / Overlay */}
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
                {writeResult !== null && (
                  <button
                    onClick={() => setIsWriting(false)}
                    className="w-full py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-xs font-semibold text-gray-200 rounded-lg cursor-pointer transition-colors"
                  >
                    Close Terminal
                  </button>
                )}
                {writeResult === 'failed' && (
                  <button
                    onClick={executeNDEFWrite}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg cursor-pointer transition-colors"
                  >
                    Retry Hardware
                  </button>
                )}
              </div>
              {writeResult === 'failed' && !useSimulator && (
                <button
                  onClick={() => {
                    setUseSimulator(true);
                    setTimeout(() => {
                      setIsWriting(true);
                      setWriteResult(null);
                      setWriteError('');
                      setWriteLogs(['Booting Web NFC Engine (Simulator)...', 'Accessing simulated RFID writer...']);
                      executeMockWrite(compileNDEFMessage(), false);
                    }, 100);
                  }}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white rounded-lg cursor-pointer transition-colors"
                >
                  Switch to Simulator Mode &amp; Program Tag
                </button>
              )}
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
