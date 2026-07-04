export type NFCRecordType =
  | 'text'
  | 'url'
  | 'phone'
  | 'email'
  | 'sms'
  | 'vcard'
  | 'wifi'
  | 'calendar'
  | 'location'
  | 'json'
  | 'mime'
  | 'custom'
  | 'multi'
  | 'erase'
  | 'format'
  | 'aar'; // Android Application Record

export interface NFCTemplate {
  id: string;
  name: string;
  description: string;
  type: NFCRecordType;
  category: string;
  // Payload structures based on type
  payload: {
    text?: string;
    url?: string;
    phoneNumber?: string;
    emailAddress?: string;
    emailSubject?: string;
    emailBody?: string;
    smsNumber?: string;
    smsBody?: string;
    vcardName?: string;
    vcardOrg?: string;
    vcardPhone?: string;
    vcardEmail?: string;
    vcardUrl?: string;
    vcardAddress?: string;
    wifiSsid?: string;
    wifiPassword?: string;
    wifiEncryption?: 'WEP' | 'WPA' | 'none';
    wifiHidden?: boolean;
    calendarTitle?: string;
    calendarStart?: string;
    calendarEnd?: string;
    calendarLocation?: string;
    calendarDesc?: string;
    geoLat?: string;
    geoLng?: string;
    geoTitle?: string;
    jsonPayload?: string;
    mimeType?: string;
    mimeData?: string;
    customType?: string;
    customPayload?: string;
    aarPackageName?: string;
    multiRecords?: Array<{ type: NFCRecordType; payload: any }>;
  };
  isBuiltIn?: boolean;
  createdAt: number;
}

export interface NFCHistoryEntry {
  id: string;
  timestamp: number;
  operation: 'read' | 'write' | 'format' | 'lock';
  status: 'success' | 'failed';
  errorMessage?: string;
  recordType?: string;
  recordsCount?: number;
  summary: string;
  details?: string; // Serialized NDEF message or description
  isFavorite?: boolean;
}

export interface NFCCompatibilityReport {
  webNfcSupported: boolean;
  secureContext: boolean;
  permissionStatus: 'granted' | 'denied' | 'prompt' | 'unknown';
  browserName: string;
  browserVersion: string;
  osName: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  isAndroid: boolean;
  isChrome: boolean;
  isHTTPS: boolean;
  screenResolution: string;
  touchSupported: boolean;
  language: string;
  isIframe: boolean;
  readyToUse: boolean;
}

export interface NFCSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string; // hex or tailwind class
  animationEnabled: boolean;
  autoSaveHistory: boolean;
  autoVerifyWrites: boolean;
  vibrationFeedback: boolean;
}
