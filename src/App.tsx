/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Scan, 
  PenTool, 
  FileText, 
  History as HistoryIcon, 
  Settings as SettingsIcon, 
  Compass, 
  BookOpen, 
  Bookmark, 
  ShieldAlert,
  Flame,
  LayoutGrid,
  Menu,
  X,
  Smartphone,
  Download,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

import { NFCSettings, NFCTemplate, NFCHistoryEntry, NFCCompatibilityReport } from './types';
import { runCompatibilityCheck } from './data';

// Components
import CompatibilityBanner from './components/CompatibilityBanner';
import HomeView from './components/HomeView';
import ReadView from './components/ReadView';
import WriteView from './components/WriteView';
import TemplatesView from './components/TemplatesView';
import HistoryView from './components/HistoryView';
import ToolsView from './components/ToolsView';
import SettingsView from './components/SettingsView';
import HelpView from './components/HelpView';
import AboutView from './components/AboutView';
import LegalView from './components/LegalView';
import DocumentationView from './components/DocumentationView';

export default function App() {
  // Page Routing (Synced with Location Hash)
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // States
  const [compatibility, setCompatibility] = useState<NFCCompatibilityReport>(runCompatibilityCheck());
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Load Settings from LocalStorage
  const [settings, setSettings] = useState<NFCSettings>(() => {
    const saved = localStorage.getItem('nfc_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      theme: 'dark',
      accentColor: '#3b82f6',
      animationEnabled: true,
      autoSaveHistory: true,
      autoVerifyWrites: true,
      vibrationFeedback: true
    };
  });

  // Load Custom Templates
  const [customTemplates, setCustomTemplates] = useState<NFCTemplate[]>(() => {
    const saved = localStorage.getItem('nfc_custom_templates');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  // Load Activity History Logs
  const [history, setHistory] = useState<NFCHistoryEntry[]>(() => {
    const saved = localStorage.getItem('nfc_history_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(prev => prev === message ? null : prev);
    }, 2000);
  };

  // Compatibility Dynamic Assessment on start
  useEffect(() => {
    setCompatibility(runCompatibilityCheck());
  }, []);

  // Listen to PWA Installation Triggers
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Handle Hash-routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validPages = ['home', 'read', 'write', 'templates', 'history', 'tools', 'settings', 'help', 'about', 'legal', 'documentation'];
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      } else if (!hash) {
        setCurrentPage('home');
      } else {
        setCurrentPage('404');
      }
      setSidebarOpen(false);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    // Trigger initially
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Sync settings theme to document
  useEffect(() => {
    const root = document.documentElement;
    // Apply Light/Dark modes
    if (settings.theme === 'light') {
      root.classList.add('light-mode-active');
      root.style.setProperty('--color-primary-500', settings.accentColor);
      document.body.style.backgroundColor = '#f9fafb';
      document.body.style.color = '#111827';
    } else {
      root.classList.remove('light-mode-active');
      root.style.setProperty('--color-primary-500', settings.accentColor);
      document.body.style.backgroundColor = '#030712';
      document.body.style.color = '#f3f4f6';
    }
    localStorage.setItem('nfc_settings', JSON.stringify(settings));
  }, [settings]);

  // Sync Custom Templates to LocalStorage
  useEffect(() => {
    localStorage.setItem('nfc_custom_templates', JSON.stringify(customTemplates));
  }, [customTemplates]);

  // Sync History Logs to LocalStorage
  useEffect(() => {
    localStorage.setItem('nfc_history_logs', JSON.stringify(history));
  }, [history]);

  // Helper: Navigation Trigger
  const handleNavigate = (page: string) => {
    window.location.hash = page;
    setSidebarOpen(false);
  };

  // Helper: Install PWA
  const handleInstallPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted PWA installation');
        }
        setDeferredPrompt(null);
      });
    }
  };

  // Handler: Add history activity
  const handleAddHistory = (entry: Omit<NFCHistoryEntry, 'id' | 'timestamp'>) => {
    if (!settings.autoSaveHistory) return;

    const newLog: NFCHistoryEntry = {
      ...entry,
      id: 'log-' + Math.random().toString(36).substring(2, 11),
      timestamp: Date.now()
    };
    
    setHistory(prev => [newLog, ...prev].slice(0, 50)); // cap at 50 logs

    if (settings.vibrationFeedback && 'vibrate' in navigator) {
      try {
        navigator.vibrate(entry.status === 'success' ? 100 : [100, 50, 100]);
      } catch (e) {}
    }
  };

  // Handler: Toggle favorite history log
  const handleToggleFavorite = (id: string) => {
    setHistory(prev => prev.map(item => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item));
  };

  // Handler: Delete history entry
  const handleDeleteEntry = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  // Handler: Save custom Template
  const handleSaveTemplate = (template: NFCTemplate) => {
    setCustomTemplates(prev => [template, ...prev]);
  };

  // Handler: Delete custom Template
  const handleDeleteTemplate = (id: string) => {
    setCustomTemplates(prev => prev.filter(item => item.id !== id));
  };

  // Handler: Import custom templates
  const handleImportTemplates = (imported: NFCTemplate[]) => {
    setCustomTemplates(prev => {
      // Avoid duplicated IDs
      const existingIds = new Set(prev.map(t => t.id));
      const filtered = imported.filter(t => !existingIds.has(t.id));
      return [...filtered, ...prev];
    });
  };

  // Handler: Select a template to program/write immediately
  const handleSelectTemplate = (template: NFCTemplate) => {
    // Navigate to write page, and we will preset inputs
    handleNavigate('write');
    // We can simulate load preset by letting WriteView listen or load from memory.
    // For a cleaner integration, we will trigger loadPresetTemplate in write view
    // by placing selected template inside a temporary storage or state, or passing it down.
    setSelectedPreset(template);
  };

  const [selectedPreset, setSelectedPreset] = useState<NFCTemplate | null>(null);

  // Handler: Reset App back to zero
  const handleResetAllData = () => {
    localStorage.removeItem('nfc_settings');
    localStorage.removeItem('nfc_custom_templates');
    localStorage.removeItem('nfc_history_logs');
    setSettings({
      theme: 'dark',
      accentColor: '#3b82f6',
      animationEnabled: true,
      autoSaveHistory: true,
      autoVerifyWrites: true,
      vibrationFeedback: true
    });
    setCustomTemplates([]);
    setHistory([]);
    setCompatibility(runCompatibilityCheck());
    handleNavigate('home');
    alert("NFC Writer memory successfully purged and reset.");
  };

  // Sync loaded preset with WriteView
  const handleLoadPresetToForm = (tmpl: NFCTemplate) => {
    setSelectedPreset(null);
  };

  // Check if current hosting domain is authorized
  const [domainAuthorized, setDomainAuthorized] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isAuthorized = 
        hostname === 'nfc.aiue.se' || 
        hostname === 'www.nfc.aiue.se';
      setDomainAuthorized(isAuthorized);
    }
  }, []);

  if (!domainAuthorized) {
    return (
      <div className="min-h-screen bg-[#030712] text-gray-100 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-gray-950 border border-red-500/10 rounded-2xl p-8 space-y-6 text-center shadow-2xl shadow-red-500/5">
          <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight text-white uppercase font-mono">
              Deployment Locked
            </h1>
            <p className="text-xs text-gray-400 leading-relaxed">
              This instance of the NFC Writer suite has been deployed on an unauthorized domain. Unauthorized distribution of this build is prohibited to ensure security and maintain contactless transaction integrity.
            </p>
          </div>

          <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-850/50 space-y-2.5">
            <div className="text-[10px] uppercase tracking-wider font-bold text-gray-500 font-mono">
              Detected Origin
            </div>
            <div className="text-xs font-mono text-red-400 bg-red-950/20 py-1.5 px-3 rounded-lg border border-red-900/20 break-all">
              {typeof window !== 'undefined' ? window.location.origin : 'unknown'}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <a
              href="https://nfc.aiue.se/"
              className="block w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all text-center"
            >
              Access Official Suite
            </a>
            <div className="text-[10px] text-gray-500 leading-normal">
              Only authentic builds served via <a href="https://nfc.aiue.se" target="_blank" rel="noreferrer" className="font-semibold text-gray-400 font-mono hover:underline">nfc.aiue.se</a> or <a href="https://www.nfc.aiue.se" target="_blank" rel="noreferrer" className="font-semibold text-gray-400 font-mono hover:underline">www.nfc.aiue.se</a> are cryptographically trusted to compile contactless records.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${settings.theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-[#030712] text-gray-100'}`}>
      
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-5 py-4 bg-gray-950/80 border-b border-gray-800/80 sticky top-0 z-40 backdrop-blur-md">
        <button
          type="button"
          onClick={() => handleNavigate('home')}
          className="flex items-center gap-2 text-white font-bold tracking-tight text-sm select-none"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center border border-blue-500/20 shadow shadow-blue-500/25">
            <Scan className="w-4 h-4 text-white animate-pulse" />
          </div>
          <span>NFC Writer</span>
        </button>

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`p-1.5 hover:bg-gray-900 rounded-lg text-gray-400 hover:text-white cursor-pointer relative transition-colors ${
            sidebarOpen ? 'z-51 text-white bg-gray-900' : 'z-40'
          }`}
          aria-label={sidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Backdrop Overlay - Clicking outside closes the sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-45 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Side Navigation Bar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-950 border-r border-gray-850/65 flex flex-col justify-between z-50 md:sticky md:top-0 h-screen transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        {/* Upper Sidebar Brand & Navigation Links */}
        <div className="space-y-6 p-5">
          <div className="flex items-center justify-between pb-4 border-b border-gray-900">
            <button
              type="button"
              onClick={() => handleNavigate('home')}
              className="flex items-center gap-2.5 text-white font-black tracking-tight text-lg select-none cursor-pointer"
            >
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-500/20">
                <Scan className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="text-left">
                <div className="font-bold leading-none text-sm">NFC Writer</div>
                <span className="text-[10px] text-gray-500 font-semibold font-mono tracking-wide mt-0.5 block">SUITE v1.1.16</span>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { id: 'home', label: 'Terminal Home', icon: LayoutGrid },
              { id: 'read', label: 'Read NFC Tag', icon: Scan },
              { id: 'write', label: 'Write NFC Tag', icon: PenTool },
              { id: 'templates', label: 'NDEF Templates', icon: FileText },
              { id: 'documentation', label: 'Documentation', icon: BookOpen },
              { id: 'tools', label: 'System Utilities', icon: Compass },
              { id: 'history', label: 'Activity Logs', icon: HistoryIcon },
              { id: 'settings', label: 'Preferences', icon: SettingsIcon },
            ].map((link) => {
              const IconComp = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  type="button"
                  key={link.id}
                  onClick={() => handleNavigate(link.id)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${isActive ? 'bg-blue-600 text-white shadow shadow-blue-600/35 font-bold' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/50'}`}
                >
                  <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Lower Sidebar Information & Help Links */}
        <div className="p-5 border-t border-gray-900 space-y-4">
          <div className="space-y-0.5">
            {[
              { id: 'help', label: 'Help & FAQs', icon: BookOpen },
              { id: 'about', label: 'About Project', icon: Bookmark },
              { id: 'legal', label: 'Terms & Privacy', icon: ShieldAlert },
            ].map((link) => {
              const IconComp = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  type="button"
                  key={link.id}
                  onClick={() => handleNavigate(link.id)}
                  className={`w-full px-3 py-2 rounded-lg text-[11px] font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${isActive ? 'bg-gray-900 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  <IconComp className="w-3.5 h-3.5 shrink-0" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Hardware Compatibility Badge */}
          <div className="p-3 bg-gray-900/40 rounded-xl border border-gray-850/50 space-y-1.5 text-center text-[10px]">
            <div className="flex items-center gap-1.5 justify-center">
              <Smartphone className="w-3.5 h-3.5 text-gray-500" />
              <span className="font-semibold text-gray-400">NFC Active Status</span>
            </div>
            <div className={`font-black uppercase tracking-wider ${compatibility.readyToUse ? 'text-emerald-400' : 'text-amber-500'}`}>
              {compatibility.readyToUse ? 'COMPATIBLE' : 'LIMITED MODE'}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 p-5 md:p-8 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
        
        {/* Sticky Global Compatibility Alert */}
        {currentPage !== 'tools' && currentPage !== 'legal' && (
          <CompatibilityBanner 
            report={compatibility} 
            onNavigateToTools={() => handleNavigate('tools')} 
          />
        )}

        {/* Modular View Routing Router Switch */}
        {currentPage === 'home' && (
          <HomeView
            report={compatibility}
            recentHistory={history}
            onNavigate={handleNavigate}
            deferredPrompt={deferredPrompt}
            onInstallPWA={handleInstallPWA}
          />
        )}

        {currentPage === 'read' && (
          <ReadView
            report={compatibility}
            onAddHistory={handleAddHistory}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'write' && (
          <WriteView
            report={compatibility}
            customTemplates={customTemplates}
            onAddHistory={handleAddHistory}
            onSaveTemplate={handleSaveTemplate}
            selectedPreset={selectedPreset}
            onClearPreset={() => setSelectedPreset(null)}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'templates' && (
          <TemplatesView
            customTemplates={customTemplates}
            onSelectTemplate={handleSelectTemplate}
            onSaveTemplate={handleSaveTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            onImportTemplates={handleImportTemplates}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'history' && (
          <HistoryView
            history={history}
            onToggleFavorite={handleToggleFavorite}
            onDeleteEntry={handleDeleteEntry}
            onClearHistory={() => setHistory([])}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'tools' && (
          <ToolsView
            report={compatibility}
            onRefreshDiagnostics={() => setCompatibility(runCompatibilityCheck())}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={(newSets) => setSettings(prev => ({ ...prev, ...newSets }))}
            onResetAllData={handleResetAllData}
          />
        )}

        {currentPage === 'help' && <HelpView />}
        {currentPage === 'about' && <AboutView />}
        {currentPage === 'legal' && <LegalView />}
        {currentPage === 'documentation' && <DocumentationView />}

        {/* State: 404 fallback */}
        {currentPage === '404' && (
          <div className="py-20 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto animate-bounce" />
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-gray-200">Sector Address Not Found</h3>
              <p className="text-xs text-gray-500">The page path you are loading is corrupted or does not exist.</p>
            </div>
            <button
              type="button"
              onClick={() => handleNavigate('home')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              Return Home
            </button>
          </div>
        )}

        {/* Unified Frame Footer */}
        <footer className="pt-12 pb-4 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <div>
            &copy; 2026 NFC Writer. Hosted at: <a href="https://nfc.aiue.se/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400 font-mono">https://nfc.aiue.se/</a>
          </div>
          <div className="flex items-center gap-3">
            <span>Version v1.1.16 (Production)</span>
            <span>•</span>
            <button type="button" onClick={() => handleNavigate('legal')} className="hover:text-blue-400 cursor-pointer">Privacy & Terms</button>
          </div>
        </footer>

        {/* Floating Toast Notification */}
        {toast && (
          <div className="fixed bottom-5 right-5 bg-blue-600 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2 border border-blue-500/20 backdrop-blur-md animate-bounce">
            <CheckCircle className="w-4 h-4" />
            <span>{toast}</span>
          </div>
        )}

      </main>
    </div>
  );
}
