import { NFCTemplate, NFCCompatibilityReport } from './types';

// Helper to generate IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export const BUILT_IN_TEMPLATES: NFCTemplate[] = [
  {
    id: 'bi-wifi-home',
    name: 'Home Wi-Fi Config',
    description: 'Quickly connect guests to your home Wi-Fi network.',
    type: 'wifi',
    category: 'Connectivity',
    payload: {
      wifiSsid: 'Home_Network_5G',
      wifiPassword: 'securepassword123',
      wifiEncryption: 'WPA',
      wifiHidden: false,
    },
    isBuiltIn: true,
    createdAt: Date.now(),
  },
  {
    id: 'bi-wifi-guest',
    name: 'Guest Wi-Fi Config',
    description: 'Provide an isolated guest network access point.',
    type: 'wifi',
    category: 'Connectivity',
    payload: {
      wifiSsid: 'Guest_Network_2G',
      wifiPassword: 'welcomeguests!',
      wifiEncryption: 'WPA',
      wifiHidden: false,
    },
    isBuiltIn: true,
    createdAt: Date.now(),
  },
  {
    id: 'bi-vcard-pro',
    name: 'Professional Digital Business Card',
    description: 'Complete vCard contact details including organization, url and address.',
    type: 'vcard',
    category: 'Social & Business',
    payload: {
      vcardName: 'Alex Mercer',
      vcardOrg: 'NFC Tech Solutions',
      vcardPhone: '+1 (555) 019-2834',
      vcardEmail: 'alex.mercer@nfctech.example.com',
      vcardUrl: 'https://nfc.aiue.se/bio/alex',
      vcardAddress: '742 Evergreen Terrace, Springfield',
    },
    isBuiltIn: true,
    createdAt: Date.now(),
  },
  {
    id: 'bi-vcard-personal',
    name: 'Personal Contact Card',
    description: 'Share your personal phone, email, and social card details.',
    type: 'vcard',
    category: 'Social & Business',
    payload: {
      vcardName: 'Jamie Vance',
      vcardPhone: '+1 (555) 014-9988',
      vcardEmail: 'jamie.vance@example.com',
      vcardUrl: 'https://github.com/jamie',
    },
    isBuiltIn: true,
    createdAt: Date.now(),
  },
  {
    id: 'bi-web-main',
    name: 'Main Portfolio Website',
    description: 'Direct redirect to your custom personal or corporate portfolio.',
    type: 'url',
    category: 'Web Links',
    payload: {
      url: 'https://nfc.aiue.se/',
    },
    isBuiltIn: true,
    createdAt: Date.now(),
  },
  {
    id: 'bi-phone-direct',
    name: 'Direct Phone Dial',
    description: 'Triggers the mobile device dialer instantly.',
    type: 'phone',
    category: 'Communications',
    payload: {
      phoneNumber: '+15550192834',
    },
    isBuiltIn: true,
    createdAt: Date.now(),
  },
  {
    id: 'bi-email-feedback',
    name: 'Support Email Dispatcher',
    description: 'Pre-populate an email with recipient, subject, and body templates.',
    type: 'email',
    category: 'Communications',
    payload: {
      emailAddress: 'support@aiue.se',
      emailSubject: 'NFC Writer Feedback',
      emailBody: 'Hello NFC team, I am writing to share my feedback...',
    },
    isBuiltIn: true,
    createdAt: Date.now(),
  },
  {
    id: 'bi-sms-quick',
    name: 'Quick Emergency SMS',
    description: 'Configures a fast pre-written SMS for immediate dispatch.',
    type: 'sms',
    category: 'Communications',
    payload: {
      smsNumber: '+15550192834',
      smsBody: 'Emergency Alert: I have arrived safely at the coordinate.',
    },
    isBuiltIn: true,
    createdAt: Date.now(),
  },
  {
    id: 'bi-maps-office',
    name: 'Corporate Office Location',
    description: 'Google Maps navigation pointer coordinates.',
    type: 'location',
    category: 'Utility',
    payload: {
      geoLat: '37.774929',
      geoLng: '-122.419416',
      geoTitle: 'Headquarters Office',
    },
    isBuiltIn: true,
    createdAt: Date.now(),
  },
  {
    id: 'bi-youtube-channel',
    name: 'YouTube Video Link',
    description: 'Deep link to open a promotional video or channel page.',
    type: 'url',
    category: 'Social & Media',
    payload: {
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    isBuiltIn: true,
    createdAt: Date.now(),
  },
  {
    id: 'bi-spotify-playlist',
    name: 'Spotify Album/Playlist',
    description: 'Open a relaxing ambient sounds album or playlist.',
    type: 'url',
    category: 'Social & Media',
    payload: {
      url: 'https://open.spotify.com/playlist/37i9dQZF1DWWQRvul6Ex2g',
    },
    isBuiltIn: true,
    createdAt: Date.now(),
  },
  {
    id: 'bi-discord-server',
    name: 'Discord Community Invite',
    description: 'Direct server join link for digital communities.',
    type: 'url',
    category: 'Social & Media',
    payload: {
      url: 'https://discord.gg/invite-code',
    },
    isBuiltIn: true,
    createdAt: Date.now(),
  },
  {
    id: 'bi-github-profile',
    name: 'GitHub Source Code Repositories',
    description: 'Link to your active code development profiles.',
    type: 'url',
    category: 'Professional Networks',
    payload: {
      url: 'https://github.com/nfc-writer',
    },
    isBuiltIn: true,
    createdAt: Date.now(),
  },
  {
    id: 'bi-linkedin-card',
    name: 'LinkedIn Professional Profile',
    description: 'Grow your business network with single tap scans.',
    type: 'url',
    category: 'Professional Networks',
    payload: {
      url: 'https://linkedin.com/in/nfc-writer-pro',
    },
    isBuiltIn: true,
    createdAt: Date.now(),
  },
  {
    id: 'bi-instagram-page',
    name: 'Instagram Profile Link',
    description: 'Share your photography profile or brand feed.',
    type: 'url',
    category: 'Social & Media',
    payload: {
      url: 'https://instagram.com/nfc.aiue.se',
    },
    isBuiltIn: true,
    createdAt: Date.now(),
  },
  {
    id: 'bi-facebook-profile',
    name: 'Facebook Company Page',
    description: 'Direct link to community group or organization page.',
    type: 'url',
    category: 'Social & Media',
    payload: {
      url: 'https://facebook.com/nfcwriter',
    },
    isBuiltIn: true,
    createdAt: Date.now(),
  },
  {
    id: 'bi-tiktok-profile',
    name: 'TikTok Video Channel',
    description: 'Direct deep link to trending tutorial reels.',
    type: 'url',
    category: 'Social & Media',
    payload: {
      url: 'https://tiktok.com/@nfcwriter',
    },
    isBuiltIn: true,
    createdAt: Date.now(),
  },
  {
    id: 'bi-emergency-contact',
    name: 'Medical / ICE Contact Info',
    description: 'In Case of Emergency (ICE) details with immediate phone link.',
    type: 'phone',
    category: 'Utility',
    payload: {
      phoneNumber: '911',
    },
    isBuiltIn: true,
    createdAt: Date.now(),
  },
  {
    id: 'bi-calendar-con',
    name: 'Annual NFC Tech Conference',
    description: 'Write an automatic iCalendar schedule reminder.',
    type: 'calendar',
    category: 'Utility',
    payload: {
      calendarTitle: 'NFC Innovation Summit 2026',
      calendarStart: '20261015T090000Z',
      calendarEnd: '20261015T170000Z',
      calendarLocation: 'Moscone Center, SF',
      calendarDesc: 'Explore the latest advancements in Web NFC and secure contactless transactions.',
    },
    isBuiltIn: true,
    createdAt: Date.now(),
  },
  {
    id: 'bi-crypto-btc',
    name: 'Bitcoin Donation Wallet',
    description: 'Write your public BTC address for fast mobile donations.',
    type: 'text',
    category: 'Social & Business',
    payload: {
      text: 'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?label=NFC%20Writer%20Donation',
    },
    isBuiltIn: true,
    createdAt: Date.now(),
  }
];

// Compatibility Diagnostics Engine
export function runCompatibilityCheck(): NFCCompatibilityReport {
  const isSecure = window.isSecureContext === true;
  const hasNFC = 'NDEFReader' in window;
  
  // User Agent Parsing
  const ua = navigator.userAgent;
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';
  let osName = 'Unknown';
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';

  // Detect OS
  if (/android/i.test(ua)) {
    osName = 'Android';
    deviceType = 'mobile';
  } else if (/ipad|iphone|ipod/i.test(ua)) {
    osName = 'iOS';
    deviceType = 'mobile';
  } else if (/windows/i.test(ua)) {
    osName = 'Windows';
  } else if (/macintosh|mac os x/i.test(ua)) {
    osName = 'macOS';
  } else if (/linux/i.test(ua)) {
    osName = 'Linux';
  }

  // Detect Tablet
  if (deviceType === 'mobile' && /tablet|ipad|playbook|silk/i.test(ua)) {
    deviceType = 'tablet';
  }

  // Detect Browser Name & Version
  if (/chrome|crios/i.test(ua) && !/edge|edg/i.test(ua) && !/opr|opera/i.test(ua)) {
    browserName = 'Chrome';
    const match = ua.match(/Chrome\/([0-9.]+)/) || ua.match(/CriOS\/([0-9.]+)/);
    if (match) browserVersion = match[1];
  } else if (/firefox|fxios/i.test(ua)) {
    browserName = 'Firefox';
    const match = ua.match(/Firefox\/([0-9.]+)/) || ua.match(/FxOS\/([0-9.]+)/);
    if (match) browserVersion = match[1];
  } else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) {
    browserName = 'Safari';
    const match = ua.match(/Version\/([0-9.]+)/);
    if (match) browserVersion = match[1];
  } else if (/edge|edg/i.test(ua)) {
    browserName = 'Edge';
    const match = ua.match(/Edg(?:e)?\/([0-9.]+)/);
    if (match) browserVersion = match[1];
  }

  const isAndroid = osName === 'Android';
  const isChrome = browserName === 'Chrome';
  const isHTTPS = window.location.protocol === 'https:';

  // Screen metrics
  const screenResolution = `${window.screen.width} x ${window.screen.height}`;
  
  // Touch detection
  const touchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Language
  const language = navigator.language || 'en-US';

  // Check if fully supported
  let isIframe = false;
  try {
    isIframe = window.self !== window.top;
  } catch (e) {
    isIframe = true;
  }
  const readyToUse = hasNFC && isSecure && isAndroid && isChrome && !isIframe;

  return {
    webNfcSupported: hasNFC,
    secureContext: isSecure,
    permissionStatus: 'unknown', // Will be queried dynamically if browser permits
    browserName,
    browserVersion,
    osName,
    deviceType,
    isAndroid,
    isChrome,
    isHTTPS,
    screenResolution,
    touchSupported,
    language,
    isIframe,
    readyToUse,
  };
}

// vCard Generator
export function generateVCard(payload: NFCTemplate['payload']): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${payload.vcardName || 'NFC User'}`
  ];

  if (payload.vcardOrg) {
    lines.push(`ORG:${payload.vcardOrg}`);
  }
  if (payload.vcardPhone) {
    lines.push(`TEL;TYPE=CELL:${payload.vcardPhone}`);
  }
  if (payload.vcardEmail) {
    lines.push(`EMAIL;TYPE=PREF,INTERNET:${payload.vcardEmail}`);
  }
  if (payload.vcardUrl) {
    lines.push(`URL:${payload.vcardUrl}`);
  }
  if (payload.vcardAddress) {
    lines.push(`ADR;TYPE=WORK:;;${payload.vcardAddress};;;;`);
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

// Wi-Fi Config Generator (Android and universal scanner format)
export function generateWifiString(payload: NFCTemplate['payload']): string {
  const ssid = payload.wifiSsid || '';
  const pass = payload.wifiPassword || '';
  const auth = payload.wifiAuth || payload.wifiEncryption || 'WPA';
  const crypt = payload.wifiCrypt ? `E:${payload.wifiCrypt}` : '';
  const hidden = payload.wifiHidden ? 'H:true' : 'H:false';
  
  // Format: WIFI:S:SSID;T:WPA;P:PASSWORD;E:CRYPT;H:false;;
  return `WIFI:S:${ssid};T:${auth};P:${pass};${crypt ? crypt + ';' : ''}${hidden};;`;
}

// Wi-Fi WPS Binary Generator (application/vnd.wfa.wsc) for native Android Wi-Fi handovers
export function generateWifiBinary(payload: any): Uint8Array {
  const ssid = payload.wifiSsid || '';
  const pass = payload.wifiPassword || '';
  const authTypeStr = payload.wifiAuth || payload.wifiEncryption || 'WPA';
  const cryptTypeStr = payload.wifiCrypt || '';

  const encoder = new TextEncoder();
  
  // Helper to build a TLV block (Type-Length-Value)
  const buildTlv = (id: number, val: Uint8Array): Uint8Array => {
    const tlv = new Uint8Array(4 + val.length);
    // Attribute ID (2 bytes, big-endian)
    tlv[0] = (id >> 8) & 0xff;
    tlv[1] = id & 0xff;
    // Length (2 bytes, big-endian)
    tlv[2] = (val.length >> 8) & 0xff;
    tlv[3] = val.length & 0xff;
    tlv.set(val, 4);
    return tlv;
  };

  // 1. Build Credential inner TLVs
  const innerBlocks: Uint8Array[] = [];

  // Network Index: ID 0x1026, 1 byte, value 1
  innerBlocks.push(buildTlv(0x1026, new Uint8Array([0x01])));

  // SSID: ID 0x1045, string bytes
  innerBlocks.push(buildTlv(0x1045, encoder.encode(ssid)));

  // Auth Type: ID 0x1003, 2 bytes (big-endian)
  // Value mapping:
  // Open = 0x0001, WPAPSK = 0x0002, Shared = 0x0004, WPA = 0x0008, WPA2 = 0x0010, WPA2PSK = 0x0020
  // WPA3-SAE = 0x0040 (WPS auth type identifier)
  let authVal = 0x0020; // Default WPA2PSK
  const upperAuth = authTypeStr.toUpperCase();
  if (upperAuth === 'NONE' || upperAuth === 'OPEN') {
    authVal = 0x0001;
  } else if (upperAuth.includes('WEP')) {
    authVal = 0x0001; // WEP usually uses Open auth with WEP encryption in WPS
  } else if (upperAuth === 'WPAPSK' || upperAuth === 'WPA') {
    authVal = 0x0002;
  } else if (upperAuth === 'WPA2PSK' || upperAuth.includes('WPA2')) {
    authVal = 0x0020;
  } else if (upperAuth === 'WPA3PSK' || upperAuth.includes('WPA3') || upperAuth.includes('SAE')) {
    authVal = 0x0040; // WPA3 Personal (SAE)
  } else if (upperAuth.includes('WPA2WPA3') || upperAuth.includes('MIXED')) {
    authVal = 0x0022; // WPA2-PSK & WPA3-SAE mixed
  }
  const authBytes = new Uint8Array([ (authVal >> 8) & 0xff, authVal & 0xff ]);
  innerBlocks.push(buildTlv(0x1003, authBytes));

  // Encryption Type: ID 0x100f, 2 bytes (big-endian)
  // Value mapping:
  // None = 0x0001, WEP = 0x0002, TKIP = 0x0004, AES = 0x0008, AES/TKIP mixed = 0x000c
  let encVal = 0x0008; // Default AES
  const upperCrypt = cryptTypeStr.toUpperCase();
  if (upperCrypt === 'NONE') {
    encVal = 0x0001;
  } else if (upperCrypt === 'WEP') {
    encVal = 0x0002;
  } else if (upperCrypt === 'TKIP') {
    encVal = 0x0004;
  } else if (upperCrypt === 'AES' || upperCrypt.includes('CCMP')) {
    encVal = 0x0008;
  } else if (upperCrypt.includes('TKIP') && upperCrypt.includes('AES')) {
    encVal = 0x000c;
  }
  const encBytes = new Uint8Array([ (encVal >> 8) & 0xff, encVal & 0xff ]);
  innerBlocks.push(buildTlv(0x100f, encBytes));

  // Network Key (Password): ID 0x1027, string bytes
  // Only append Network Key if it's not open
  if (authVal !== 0x0001 || encVal === 0x0002) {
    innerBlocks.push(buildTlv(0x1027, encoder.encode(pass)));
  }

  // MAC Address: ID 0x1020, 6 bytes (wildcard FF:FF:FF:FF:FF:FF)
  innerBlocks.push(buildTlv(0x1020, new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff])));

  // Concatenate all inner blocks
  let innerLen = 0;
  for (const block of innerBlocks) {
    innerLen += block.length;
  }
  const innerPayload = new Uint8Array(innerLen);
  let offset = 0;
  for (const block of innerBlocks) {
    innerPayload.set(block, offset);
    offset += block.length;
  }

  // 2. Build Top-Level TLVs
  const topBlocks: Uint8Array[] = [];

  // Version: ID 0x104a, 1 byte, value 0x10 (WPS Version 1.0)
  topBlocks.push(buildTlv(0x104a, new Uint8Array([0x10])));

  // Credential Container: ID 0x100e, value is innerPayload
  topBlocks.push(buildTlv(0x100e, innerPayload));

  // Concatenate top level blocks
  let topLen = 0;
  for (const block of topBlocks) {
    topLen += block.length;
  }
  const topPayload = new Uint8Array(topLen);
  offset = 0;
  for (const block of topBlocks) {
    topPayload.set(block, offset);
    offset += block.length;
  }

  return topPayload;
}

// iCalendar Event Generator
export function generateCalendarString(payload: NFCTemplate['payload']): string {
  const title = payload.calendarTitle || 'NFC Event';
  const start = payload.calendarStart || new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const end = payload.calendarEnd || new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const loc = payload.calendarLocation || '';
  const desc = payload.calendarDesc || '';

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DTSTART:${start}`,
    `DTEND:${end}`
  ];

  if (loc) lines.push(`LOCATION:${loc}`);
  if (desc) lines.push(`DESCRIPTION:${desc}`);

  lines.push('END:VEVENT');
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

// Parses Wi-Fi string back to fields
export function parseWifiString(wifiStr: string): Partial<NFCTemplate['payload']> {
  const clean = wifiStr.replace(/^WIFI:/i, '');
  const parts = clean.split(';');
  const result: Partial<NFCTemplate['payload']> = {
    wifiSsid: '',
    wifiPassword: '',
    wifiEncryption: 'none',
    wifiAuth: '',
    wifiCrypt: '',
    wifiHidden: false
  };

  parts.forEach(part => {
    if (part.startsWith('S:')) {
      result.wifiSsid = part.substring(2);
    } else if (part.startsWith('P:')) {
      result.wifiPassword = part.substring(2);
    } else if (part.startsWith('T:')) {
      const enc = part.substring(2);
      result.wifiAuth = enc;
      const encUpper = enc.toUpperCase();
      if (encUpper === 'WEP') {
        result.wifiEncryption = 'WEP';
      } else if (encUpper.includes('WPA3') || encUpper === 'SAE') {
        result.wifiEncryption = 'WPA3';
      } else if (encUpper.includes('WPA2_WPA3') || encUpper.includes('WPA3_WPA2') || (encUpper.includes('WPA') && encUpper.includes('WPA3'))) {
        result.wifiEncryption = 'WPA2_WPA3';
      } else if (encUpper.startsWith('WPA')) {
        result.wifiEncryption = 'WPA';
      } else {
        result.wifiEncryption = 'none';
      }
    } else if (part.startsWith('E:')) {
      result.wifiCrypt = part.substring(2);
    } else if (part.startsWith('H:')) {
      result.wifiHidden = part.substring(2).toLowerCase() === 'true';
    }
  });

  return result;
}

// Parses vCard string back to contact fields
export function parseVCardString(vcardStr: string): Partial<NFCTemplate['payload']> {
  const lines = vcardStr.split('\n');
  const result: Partial<NFCTemplate['payload']> = {
    vcardName: '',
    vcardOrg: '',
    vcardPhone: '',
    vcardEmail: '',
    vcardUrl: '',
    vcardAddress: ''
  };

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('FN:')) {
      result.vcardName = trimmed.substring(3);
    } else if (trimmed.startsWith('ORG:')) {
      result.vcardOrg = trimmed.substring(4);
    } else if (trimmed.startsWith('TEL;')) {
      const idx = trimmed.indexOf(':');
      if (idx !== -1) result.vcardPhone = trimmed.substring(idx + 1);
    } else if (trimmed.startsWith('EMAIL;')) {
      const idx = trimmed.indexOf(':');
      if (idx !== -1) result.vcardEmail = trimmed.substring(idx + 1);
    } else if (trimmed.startsWith('URL:')) {
      result.vcardUrl = trimmed.substring(4);
    } else if (trimmed.startsWith('ADR;')) {
      const idx = trimmed.indexOf(':');
      if (idx !== -1) {
        const parts = trimmed.substring(idx + 1).split(';');
        // Combine address parts (removing empty ones)
        result.vcardAddress = parts.filter(p => p.trim() !== '').join(', ');
      }
    }
  });

  return result;
}
