import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Upload, 
  Trash2, 
  PenTool, 
  ChevronRight, 
  BookOpen, 
  Compass, 
  Info,
  Layers,
  Plus
} from 'lucide-react';
import { NFCTemplate, NFCRecordType } from '../types';
import { BUILT_IN_TEMPLATES } from '../data';

interface TemplatesViewProps {
  customTemplates: NFCTemplate[];
  onSelectTemplate: (template: NFCTemplate) => void;
  onSaveTemplate: (template: NFCTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  onImportTemplates: (templates: NFCTemplate[]) => void;
}

export default function TemplatesView({ 
  customTemplates, 
  onSelectTemplate, 
  onSaveTemplate, 
  onDeleteTemplate, 
  onImportTemplates 
}: TemplatesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Combine built-in templates and user custom templates
  const allTemplates = [...customTemplates, ...BUILT_IN_TEMPLATES];

  // Derive unique categories
  const categories = ['All', 'Connectivity', 'Social & Business', 'Web Links', 'Communications', 'Utility', 'Social & Media', 'Professional Networks'];
  if (customTemplates.length > 0) {
    categories.push('User Custom');
  }

  // Filter lists based on selection
  const filteredTemplates = allTemplates.filter(tmpl => {
    const matchesSearch = tmpl.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tmpl.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tmpl.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'All') return matchesSearch;
    if (selectedCategory === 'User Custom') return matchesSearch && !tmpl.isBuiltIn;
    return matchesSearch && tmpl.category === selectedCategory;
  });

  // Export templates as JSON file downloads
  const handleExportTemplates = () => {
    if (customTemplates.length === 0) {
      alert("No user custom templates available to export. Create templates in the Write section first.");
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(customTemplates, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "nfc_writer_custom_templates.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import templates from local JSON files
  const handleImportTemplates = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          // Rudimentary validation
          const valid = imported.every(item => item.id && item.name && item.type && item.payload);
          if (valid) {
            onImportTemplates(imported);
            alert(`Successfully imported ${imported.length} custom templates!`);
          } else {
            alert("JSON Schema mismatch: Templates must have 'id', 'name', 'type', and 'payload' properties.");
          }
        } else {
          alert("Import failed: JSON must represent a structured array of templates.");
        }
      } catch (err) {
        alert("Parsing Error: Invalid JSON text format inside the template file.");
      }
    };
    reader.readAsText(file);
  };

  const triggerFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Search Header and Toolbars */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-900/30 border border-gray-800/40 rounded-xl p-5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span>NFC NDEF Templates Directory</span>
          </h2>
          <p className="text-xs text-gray-400">
            Browse through predefined templates or save/export your customized write profiles.
          </p>
        </div>

        {/* JSON Import/Export Actions */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImportTemplates} 
            accept=".json" 
            className="hidden" 
          />
          
          <button
            onClick={triggerFileSelector}
            className="flex-1 md:flex-none px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-[11px] font-bold text-gray-300 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" /> Import JSON
          </button>

          <button
            onClick={handleExportTemplates}
            className="flex-1 md:flex-none px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-[11px] font-bold text-gray-300 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Custom
          </button>
        </div>
      </div>

      {/* Categories Toolbar filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search templates by name, record type, or keywords..."
            className="w-full pl-10 pr-4 py-2.5 text-xs glass-input rounded-xl text-gray-200"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1.5 sm:pb-0 scrollbar-none">
          {categories.slice(0, 4).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-[10px] font-semibold rounded-lg shrink-0 cursor-pointer border transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-900/40 text-gray-400 border-gray-800/80 hover:text-gray-200'}`}
            >
              {cat}
            </button>
          ))}
          {categories.length > 4 && (
            <select
              value={categories.includes(selectedCategory) && categories.indexOf(selectedCategory) >= 4 ? selectedCategory : 'More'}
              onChange={(e) => {
                if (e.target.value !== 'More') setSelectedCategory(e.target.value);
              }}
              className="px-2 py-1.5 bg-gray-900/40 text-gray-400 border border-gray-800/80 rounded-lg text-[10px] font-semibold focus:outline-none"
            >
              <option disabled value="More">More Categories</option>
              {categories.slice(4).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Grid: Visual Cards of templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-gray-800 rounded-2xl bg-gray-950/20 text-gray-400 space-y-3">
            <BookOpen className="w-10 h-10 text-gray-600 mx-auto" />
            <div>
              <p className="font-semibold text-sm">No templates matched search criteria.</p>
              <p className="text-xs text-gray-500 mt-0.5">Try resetting the category filter or searching different terms.</p>
            </div>
          </div>
        ) : (
          filteredTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="glass-panel rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/5 transition-all group"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-gray-900 text-blue-400 rounded-full border border-gray-800">
                    {tmpl.type}
                  </span>
                  
                  {!tmpl.isBuiltIn && (
                    <button
                      onClick={() => onDeleteTemplate(tmpl.id)}
                      className="p-1.5 hover:bg-red-950/20 text-gray-500 hover:text-red-400 rounded-md transition-colors cursor-pointer"
                      title="Delete Custom Template"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-gray-100 group-hover:text-blue-300 transition-colors line-clamp-1">{tmpl.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed min-h-[2.5rem]">{tmpl.description}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-900/60 flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium text-[10px]">{tmpl.isBuiltIn ? 'System Template' : 'User Template'}</span>
                <button
                  onClick={() => onSelectTemplate(tmpl)}
                  className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer flex items-center gap-1"
                >
                  <span>Load Template</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Informative Tip */}
      <div className="bg-blue-950/10 border border-blue-500/10 rounded-xl p-4 flex gap-3 text-xs text-gray-400 leading-relaxed">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-gray-200">NDEF Writing automation:</span>
          <p className="mt-0.5">
            You can load any template directly into the NDEF writer, configure individual variable fields, and program multiple tags with the same payload structure quickly.
          </p>
        </div>
      </div>

    </div>
  );
}
