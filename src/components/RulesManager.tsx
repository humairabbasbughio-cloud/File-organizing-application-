import React, { useState } from 'react';
import { useOrganizer } from '../context/OrganizerContext';
import { useAuth } from '../context/AuthContext';
import { Sliders, Plus, X, Folder, AlertTriangle, ShieldCheck } from 'lucide-react';

export const RulesManager: React.FC = () => {
  const {
    categories,
    rule,
    setRule,
    addCategoryExtension,
    removeCategoryExtension,
    updateCategoryFolderName
  } = useOrganizer();

  const { hasPermission } = useAuth();
  const canManage = hasPermission('rules:manage');

  const [newExts, setNewExts] = useState<Record<string, string>>({});

  const handleAddExt = (catId: string) => {
    const val = newExts[catId];
    if (val && val.trim()) {
      addCategoryExtension(catId, val);
      setNewExts(prev => ({ ...prev, [catId]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
              Categorization & Extension Rules Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-1">
            Configure how DriveSort Guard identifies file types and maps them to target subfolder locations.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400 dark:bg-slate-800 dark:border-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Non-Destructive Guarantee Active</span>
        </div>
      </div>

      {!canManage && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            You are currently viewing rules in read-only mode. Switch to <strong>Data Manager</strong> or <strong>Admin</strong> in the top menu to modify extension mappings or target folder names.
          </span>
        </div>
      )}

      {/* Sorting Mode Selector */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider dark:text-slate-300 light:text-slate-700">
          Organization Execution Mode
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label
            className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
              rule.mode === 'category_folders'
                ? 'bg-blue-600/15 border-blue-500 text-blue-200 font-medium'
                : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:bg-slate-800 dark:bg-slate-800/60 dark:border-slate-700 light:bg-slate-50 light:border-slate-300'
            }`}
          >
            <input
              type="radio"
              name="mode"
              checked={rule.mode === 'category_folders'}
              onChange={() => canManage && setRule(r => ({ ...r, mode: 'category_folders' }))}
              disabled={!canManage}
              className="mt-1"
            />
            <div>
              <div className="text-xs font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                Subfolder Category Relocation (Recommended)
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 mt-0.5">
                Creates organized category subfolders (e.g., <code className="text-blue-300">D:\Data\Images</code>, <code className="text-emerald-300">D:\Data\Documents</code>) and moves matching files into them safely.
              </p>
            </div>
          </label>

          <label
            className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
              rule.mode === 'virtual_index_only'
                ? 'bg-purple-600/15 border-purple-500 text-purple-200 font-medium'
                : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:bg-slate-800 dark:bg-slate-800/60 dark:border-slate-700 light:bg-slate-50 light:border-slate-300'
            }`}
          >
            <input
              type="radio"
              name="mode"
              checked={rule.mode === 'virtual_index_only'}
              onChange={() => canManage && setRule(r => ({ ...r, mode: 'virtual_index_only' }))}
              disabled={!canManage}
              className="mt-1"
            />
            <div>
              <div className="text-xs font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                In-Place Virtual Catalog & Indexing Only
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 mt-0.5">
                Leaves all files in their exact current location without moving any file on disk, generating a categorized virtual index catalog instead.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Categories & Extensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 light:border-slate-200">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <h4 className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                  {cat.name}
                </h4>
              </div>

              {/* Editable Target Folder Name */}
              <div className="flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] text-slate-400">Folder:</span>
                <input
                  type="text"
                  value={cat.folderName}
                  onChange={e =>
                    canManage && updateCategoryFolderName(cat.id, e.target.value)
                  }
                  disabled={!canManage}
                  className="w-28 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-blue-300 font-mono text-xs focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 light:bg-slate-100 light:border-slate-300 light:text-blue-600 font-semibold"
                />
              </div>
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
              {cat.description}
            </p>

            {/* Extension Pills */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 light:text-slate-500 uppercase tracking-wider block">
                Mapped Extensions ({cat.extensions.length})
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1">
                {cat.extensions.map(ext => (
                  <span
                    key={ext}
                    className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs flex items-center gap-1.5 dark:bg-slate-800 dark:border-slate-700 light:bg-slate-100 light:border-slate-300 light:text-slate-800"
                  >
                    <span>{ext}</span>
                    {canManage && cat.id !== 'other' && (
                      <button
                        onClick={() => removeCategoryExtension(cat.id, ext)}
                        className="text-slate-400 hover:text-red-400 transition-colors"
                        title="Remove extension"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Add New Extension */}
            {canManage && cat.id !== 'other' && (
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. .m4v or png"
                  value={newExts[cat.id] || ''}
                  onChange={e =>
                    setNewExts(prev => ({ ...prev, [cat.id]: e.target.value }))
                  }
                  onKeyDown={e => e.key === 'Enter' && handleAddExt(cat.id)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 light:bg-slate-100 light:border-slate-300 light:text-slate-900"
                />
                <button
                  onClick={() => handleAddExt(cat.id)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
