import React, { useState } from 'react';
import { 
  History, 
  Trash2, 
  Star, 
  Download, 
  Search, 
  AlertCircle, 
  CheckCircle, 
  Eye, 
  X,
  FileSpreadsheet,
  Info,
  RefreshCw
} from 'lucide-react';
import { NFCHistoryEntry } from '../types';

interface HistoryViewProps {
  history: NFCHistoryEntry[];
  onToggleFavorite: (id: string) => void;
  onDeleteEntry: (id: string) => void;
  onClearHistory: () => void;
  onShowToast: (message: string) => void;
}

export default function HistoryView({ 
  history, 
  onToggleFavorite, 
  onDeleteEntry, 
  onClearHistory,
  onShowToast
}: HistoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [opFilter, setOpFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Modal for displaying details
  const [activeDetails, setActiveDetails] = useState<NFCHistoryEntry | null>(null);

  // Export progress states
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingJSON, setIsExportingJSON] = useState(false);

  // Filter list
  const filteredHistory = history.filter(item => {
    const matchesSearch = item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.recordType && item.recordType.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (item.errorMessage && item.errorMessage.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesOp = opFilter === 'All' || item.operation === opFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter.toLowerCase();

    return matchesSearch && matchesOp && matchesStatus;
  });

  // Export as JSON file
  const handleExportJSON = () => {
    if (history.length === 0) return;
    setIsExportingJSON(true);
    onShowToast("Generating activity logs JSON archive...");
    
    setTimeout(() => {
      try {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "nfc_writer_activity_history.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        onShowToast("Download started! Saved nfc_writer_activity_history.json");
      } catch (err) {
        onShowToast("Failed to compile history JSON.");
      } finally {
        setIsExportingJSON(false);
      }
    }, 900);
  };

  // Export as CSV file
  const handleExportCSV = () => {
    if (history.length === 0) return;
    setIsExportingCSV(true);
    onShowToast("Converting database index to CSV structures...");
    
    setTimeout(() => {
      try {
        const headers = ['ID', 'Timestamp', 'Operation', 'Status', 'Record Type', 'Summary', 'Error Message'];
        const rows = history.map(item => [
          item.id,
          new Date(item.timestamp).toISOString(),
          item.operation,
          item.status,
          item.recordType || 'N/A',
          `"${item.summary.replace(/"/g, '""')}"`,
          item.errorMessage ? `"${item.errorMessage.replace(/"/g, '""')}"` : ''
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
          + headers.join(",") + "\n" 
          + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "nfc_writer_history_logs.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
        onShowToast("Download started! Saved nfc_writer_history_logs.csv");
      } catch (err) {
        onShowToast("Failed to compile history CSV.");
      } finally {
        setIsExportingCSV(false);
      }
    }, 900);
  };

  return (
    <div className="space-y-6">
      
      {/* Header operations and titles */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-900/30 border border-gray-800/40 rounded-xl p-5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            <span>NFC Activity Log History</span>
          </h2>
          <p className="text-xs text-gray-400">
            Secure client-side records of all scanned NDEF registers and written memory payloads.
          </p>
        </div>

        {/* Action controls */}
        {history.length > 0 && (
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              type="button"
              disabled={isExportingCSV || isExportingJSON}
              onClick={handleExportCSV}
              className={`flex-1 md:flex-none px-3.5 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-[11px] font-bold text-gray-300 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-all ${isExportingCSV ? 'opacity-50 cursor-wait' : ''}`}
            >
              {isExportingCSV ? (
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              )}
              <span>{isExportingCSV ? 'Processing...' : 'Export CSV'}</span>
            </button>

            <button
              type="button"
              disabled={isExportingCSV || isExportingJSON}
              onClick={handleExportJSON}
              className={`flex-1 md:flex-none px-3.5 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-[11px] font-bold text-gray-300 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-all ${isExportingJSON ? 'opacity-50 cursor-wait' : ''}`}
            >
              {isExportingJSON ? (
                <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
              ) : (
                <Download className="w-4 h-4 text-blue-400" />
              )}
              <span>{isExportingJSON ? 'Compiling...' : 'Export JSON'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if(confirm("Are you sure you want to purge all local activity history logs permanently? This cannot be undone.")) {
                  onClearHistory();
                  onShowToast("Activity logs purged successfully.");
                }
              }}
              className="flex-1 md:flex-none px-3.5 py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 hover:border-red-500/30 text-[11px] font-bold text-red-400 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear Logs
            </button>
          </div>
        )}
      </div>

      {/* Filter and query toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search records by summary name, type or error..."
            className="w-full pl-9 pr-4 py-2 text-xs glass-input rounded-xl text-gray-200"
          />
        </div>

        <div>
          <select
            value={opFilter}
            onChange={(e) => setOpFilter(e.target.value)}
            className="w-full p-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-gray-300 focus:outline-none"
          >
            <option value="All">All Operations</option>
            <option value="Read">Read Operations</option>
            <option value="Write">Write Operations</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-gray-300 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Success">Success Logs</option>
            <option value="Failed">Failed Logs</option>
          </select>
        </div>
      </div>

      {/* List logs render block */}
      <div className="glass-panel rounded-xl overflow-hidden border border-gray-800/80">
        {filteredHistory.length === 0 ? (
          <div className="py-16 text-center text-gray-400 space-y-3 p-4">
            <History className="w-10 h-10 text-gray-600 mx-auto" />
            <div>
              <p className="font-semibold text-sm">No activity records found.</p>
              <p className="text-xs text-gray-500 mt-0.5">Use the scanner or writer terminals to capture and log transactions.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-850">
            {filteredHistory.map((item) => (
              <div 
                key={item.id} 
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-900/10 transition-colors"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="mt-1 shrink-0">
                    {item.status === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-200 select-text truncate">{item.summary}</span>
                      {item.recordType && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-gray-900 text-blue-400 border border-gray-800 rounded font-mono uppercase font-bold shrink-0">
                          {item.recordType}
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-gray-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span>{new Date(item.timestamp).toLocaleString()}</span>
                      <span>•</span>
                      <span className="uppercase text-gray-400 font-semibold">{item.operation}</span>
                      {item.errorMessage && (
                        <>
                          <span>•</span>
                          <span className="text-red-400/95 font-mono truncate max-w-xs">Err: {item.errorMessage}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {item.details && (
                    <button
                      type="button"
                      onClick={() => setActiveDetails(item)}
                      className="p-1.5 hover:bg-gray-850 text-gray-400 hover:text-blue-400 rounded-md transition-colors cursor-pointer"
                      title="Inspect NDEF Data"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => { onToggleFavorite(item.id); onShowToast(item.isFavorite ? "Removed from favorites" : "Added to favorites"); }}
                    className="p-1.5 hover:bg-gray-850 rounded-md transition-colors cursor-pointer"
                    title="Toggle Favorite"
                  >
                    <Star className={`w-4 h-4 ${item.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-gray-500 hover:text-gray-300'}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => { onDeleteEntry(item.id); onShowToast("Log entry deleted"); }}
                    className="p-1.5 hover:bg-red-950/20 text-gray-500 hover:text-red-400 rounded-md transition-colors cursor-pointer"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Inspector popup modal */}
      {activeDetails && (
        <div id="inspector-overlay" className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start pb-2 border-b border-gray-800">
              <h3 className="text-sm font-bold text-gray-200">Inspect Log Record Structures</h3>
              <button 
                type="button"
                onClick={() => setActiveDetails(null)}
                className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-3 text-[11px] text-gray-400 pb-2 border-b border-gray-900">
                <div>Log ID: <span className="font-mono text-gray-300">{activeDetails.id}</span></div>
                <div>Status: <span className={activeDetails.status === 'success' ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>{activeDetails.status.toUpperCase()}</span></div>
                <div>Timestamp: <span className="text-gray-300">{new Date(activeDetails.timestamp).toLocaleString()}</span></div>
                <div>Operation: <span className="uppercase text-blue-400 font-semibold">{activeDetails.operation}</span></div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-400">Captured Details</label>
                <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg overflow-x-auto font-mono text-[10px] text-gray-300 max-h-56 leading-relaxed select-text">
                  {(() => {
                    try {
                      return <pre className="whitespace-pre-wrap">{JSON.stringify(JSON.parse(activeDetails.details || '{}'), null, 2)}</pre>;
                    } catch(e) {
                      return <pre className="whitespace-pre-wrap">{activeDetails.details}</pre>;
                    }
                  })()}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveDetails(null)}
              className="w-full py-2 bg-gray-900 hover:bg-gray-850 border border-gray-800 text-xs font-semibold text-gray-400 rounded-lg cursor-pointer"
            >
              Dismiss Inspector
            </button>
          </div>
        </div>
      )}

      {/* Security Info Banner */}
      <div className="bg-gray-900/10 border border-gray-800/30 rounded-xl p-4 flex gap-3 text-xs text-gray-500 leading-relaxed">
        <Info className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
        <p>
          All activity history data is retained strictly on your physical machine utilizing safe sandboxed client-side <strong className="text-gray-400">LocalStorage</strong> buffers. None of your logs, credentials, or scanned payload packages are ever transmitted to any external server.
        </p>
      </div>

    </div>
  );
}
