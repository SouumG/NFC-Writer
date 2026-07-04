import React, { useState } from 'react';
import { BookOpen, HelpCircle, ChevronDown, ChevronUp, Cpu, Info, Key } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

export default function HelpView() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      q: "What is Web NFC and NDEF?",
      a: "Web NFC is a modern browser standard allowing web applications to read and write to Near Field Communication (NFC) tags. NDEF (NFC Data Exchange Format) is the standardized lightweight byte data layout used to store records such as URLs, phone triggers, vCards, or raw texts inside the tag sectors."
    },
    {
      q: "Which browsers and devices support NFC Writer?",
      a: "Web NFC is fully active on Google Chrome and Opera browsers running on Android mobile devices (with NFC hardware enabled). iPhones and desktop browsers do not expose direct NFC hardware channels to standard web browsers yet. However, on unsupported devices, you can still formulate configurations, design payload templates, and use our codecs or simulators."
    },
    {
      q: "What is the difference between NTAG213, NTAG215, and NTAG216?",
      a: "These are standard high frequency NFC chip models manufactured by NXP. The primary differentiator is memory register storage capacity: NTAG213 holds 144 bytes (137 bytes writable), NTAG215 holds 540 bytes (504 bytes writable, popular for Amiibo emulations), and NTAG216 holds 924 bytes (888 bytes writable, ideal for large vCard contact profiles)."
    },
    {
      q: "Can I lock an NFC tag to be read-only?",
      a: "Yes, physical NFC tags support memory locking bits. Once locked, a tag can never be rewritten or formatted. Our web applet accesses native read/write sectors, but avoids irreversible tag-locking features to prevent users from accidentally bricking their expensive tags."
    },
    {
      q: "How do I configure automation triggers (Tasker, MacroDroid)?",
      a: "To trigger native automation sequences, program an NFC tag with a custom text or JSON record containing trigger keys. You can configure MacroDroid or Tasker on the scanning device to recognize that specific NFC UID or NDEF record content, instantly firing local device automation hooks (toggling Bluetooth, volume, smart home commands, etc.)."
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-6">
      
      {/* Header title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-900/30 border border-gray-800/40 rounded-xl p-5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span>NFC Education & Help Center</span>
          </h2>
          <p className="text-xs text-gray-400">
            Learn standard contactless protocols, read about chip registers, or browse answers in our FAQ index.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Accordion FAQs */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 pb-2 border-b border-gray-800 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-blue-400" /> Frequently Asked Questions
          </h3>

          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="glass-panel rounded-xl overflow-hidden border border-gray-850/80 hover:border-gray-800/80 transition-colors"
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between text-xs font-semibold text-gray-200 select-none cursor-pointer"
              >
                <span>{faq.q}</span>
                {openIndex === idx ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
              </button>

              {openIndex === idx && (
                <div className="px-5 pb-4 text-xs text-gray-400 leading-relaxed border-t border-gray-900/40 pt-3 select-text">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Side: Educational chips specs */}
        <div className="space-y-6">
          
          <div className="glass-panel rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 pb-2 border-b border-gray-800 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-400" /> NDEF Record Limits
            </h3>

            <div className="text-[11px] text-gray-400 leading-relaxed space-y-3 select-text">
              <p>When compiling payloads to program NFC tag memories, keep byte limits in mind. Overfilling registers results in truncation or formatting failure:</p>
              
              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-2">
                  <span className="p-1 bg-blue-950 text-blue-400 border border-blue-900 rounded font-mono text-[9px] font-bold mt-0.5">TEXT</span>
                  <div className="text-[11px]">Plain text requires about 1 byte per ASCII character. Holds well on all chips.</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="p-1 bg-blue-950 text-blue-400 border border-blue-900 rounded font-mono text-[9px] font-bold mt-0.5">URL</span>
                  <div className="text-[11px]">Web NFC automatically compresses URL prefixes (e.g. "https://") to single-byte headers.</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="p-1 bg-blue-950 text-blue-400 border border-blue-900 rounded font-mono text-[9px] font-bold mt-0.5">vCARD</span>
                  <div className="text-[11px]">Business cards store extensive text fields. <strong className="text-gray-300">NTAG215</strong> or <strong className="text-gray-300">NTAG216</strong> are required to prevent memory overflows.</div>
                </li>
              </ul>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-5 space-y-3 flex gap-3.5 items-start">
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-gray-400">
              <span className="font-bold text-gray-200">Writing Tip:</span> To maximize read speeds on mobile phone scans, try using compressed URLs redirecting to hosted biography cards, rather than programming bloated full vCard blocks onto the tags.
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
