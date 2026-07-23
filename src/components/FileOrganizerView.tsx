import React, { useState } from 'react';
import { useOrganizer } from '../context/OrganizerContext';
import { useAuth } from '../context/AuthContext';
import { formatBytes } from '../utils/organizer';
import {
  FolderSearch,
  CheckCircle2,
  HardDrive,
  RefreshCw,
  Zap,
  ShieldCheck,
  Upload,
  FolderPlus,
  FileCode,
  FileText,
  Image,
  Film,
  Music,
  Archive,
  Table,
  Cpu,
  Folder,
  Search,
  Filter,
  AlertTriangle
} from 'lucide-react';

export const FileOrganizerView: React.FC = () => {
  const {
    targetDrivePath,
    setTargetDrivePath,
    files,
    categories,
    rule,
    stats,
    isScanning,
    isOrganizing,
    scanTargetDrive,
    selectRealDirectory,
    handleDroppedFiles,
    organizeFilesNow,
    resetToDemoFiles,
    hasRealDirectoryAccess,
    realDirectoryName
  } = useOrganizer();

  const { hasPermission } = useAuth();
  const canOrganize = hasPermission('files:organize');

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [organizeSuccessMessage, setOrganizeSuccessMessage] = useState<string | null>(null);

  // Category Icon Resolver
  const renderCategoryIcon = (iconName: string, color: string) => {
    const props = { className: 'w-4 h-4', style: { color } };
    switch (iconName) {
      case 'Image':
        return <Image {...props} />;
      case 'FileText':
        return <FileText {...props} />;
      case 'Table':
        return <Table {...props} />;
      case 'Film':
        return <Film {...props} />;
      case 'Music':
        return <Music {...props} />;
      case 'Archive':
        return <Archive {...props} />;
      case 'Code':
        return <FileCode {...props} />;
      case 'Cpu':
        return <Cpu {...props} />;
      default:
        return <Folder {...props} />;
    }
  };

  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.extension.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.proposedPath.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOrganizeClick = async () => {
    if (!canOrganize) return;
    const result = await organizeFilesNow();
    setOrganizeSuccessMessage(
      `Successfully organized ${result.organizedCount} files (${formatBytes(result.bytesCount)}) into category subfolders under '${targetDrivePath}'!`
    );
    setTimeout(() => setOrganizeSuccessMessage(null), 8000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleDroppedFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-6">
      {/* Non-Destructive Protection Notice */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 flex items-start gap-3.5 shadow-lg">
        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900">
              Zero-Deletion Non-Destructive Data Guarantee
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Safe Operation
            </span>
          </div>
          <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 mt-1 leading-relaxed">
            DriveSort Guard scans files on your PC drive (e.g. <code className="px-1.5 py-0.5 rounded bg-slate-800 text-blue-300 font-mono text-[11px]">D:\Data</code>) and categorizes them safely. The system <strong>never deletes or modifies file contents</strong>. Files are safely moved into category subfolders (<code className="px-1.5 py-0.5 rounded bg-slate-800 text-purple-300 font-mono text-[11px]">Images/</code>, <code className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono text-[11px]">Documents/</code>, <code className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-[11px]">Videos/</code>) or virtually indexed in-place.
          </p>
        </div>
      </div>

      {/* Target Drive Control Bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase tracking-wider mb-1.5">
              Target Drive Directory / Folder Path
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <HardDrive className="w-4 h-4 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={targetDrivePath}
                  onChange={e => setTargetDrivePath(e.target.value)}
                  placeholder="e.g. D:\Data or C:\Users\YourName\Downloads"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 light:bg-slate-50 light:border-slate-300 light:text-slate-900"
                />
              </div>
              
              {/* Choose Local Folder via Web FileSystem Directory Picker */}
              <button
                onClick={selectRealDirectory}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
                title="Select actual local PC folder from C: or D: drive"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Select PC Folder</span>
              </button>

              <button
                onClick={scanTargetDrive}
                disabled={isScanning}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs flex items-center gap-2 transition-all shrink-0 cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 light:bg-slate-100 light:border-slate-300 light:text-slate-800"
              >
                <RefreshCw className={`w-4 h-4 text-blue-400 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Scanning...' : 'Scan Directory'}</span>
              </button>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={resetToDemoFiles}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors cursor-pointer dark:bg-slate-800 dark:border-slate-700 light:bg-slate-100 light:border-slate-300 light:text-slate-700"
              title="Reset workspace to default demo file list"
            >
              Reset Demo
            </button>

            <button
              onClick={handleOrganizeClick}
              disabled={!canOrganize || isOrganizing || stats.pendingCount === 0}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
                canOrganize && stats.pendingCount > 0 && !isOrganizing
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <Zap className={`w-4 h-4 ${isOrganizing ? 'animate-pulse text-amber-300' : 'text-amber-400'}`} />
              <span>
                {isOrganizing
                  ? 'Organizing Files...'
                  : stats.pendingCount === 0
                  ? 'All Files Organized'
                  : `Organize ${stats.pendingCount} File(s) Now`}
              </span>
            </button>
          </div>
        </div>

        {/* Organize Success Toast Banner */}
        {organizeSuccessMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{organizeSuccessMessage}</span>
          </div>
        )}

        {!canOrganize && (
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Your active role (<strong>{hasPermission('files:scan') ? 'Auditor / Viewer' : 'Restricted'}</strong>) can scan and view files, but requires <strong>Data Manager</strong> or <strong>Admin</strong> privileges to perform folder movements. Use the top user role switcher to test Admin capabilities.
            </span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
          <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 light:text-slate-500 uppercase tracking-wider">
            Total Files
          </div>
          <div className="text-2xl font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 mt-1">
            {stats.totalFiles}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Size: {formatBytes(stats.totalBytes)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
          <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
            Pending Move
          </div>
          <div className="text-2xl font-bold text-amber-300 mt-1">
            {stats.pendingCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Awaiting folder routing
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
            Organized
          </div>
          <div className="text-2xl font-bold text-emerald-300 mt-1">
            {stats.organizedCount}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-0.5">
            Categorized & moved
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
          <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
            Categorized
          </div>
          <div className="text-2xl font-bold text-blue-300 mt-1">
            {stats.categorizedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Rule match found
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md col-span-2 sm:col-span-1 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
          <div className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
            Target Folders
          </div>
          <div className="text-2xl font-bold text-purple-300 mt-1">
            {categories.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Active categories
          </div>
        </div>
      </div>

      {/* Category Breakdown Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
        <div className="text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2.5">
          Category Distribution Summary
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const data = stats.categoryBreakdown[cat.id] || { count: 0, bytes: 0 };
            return (
              <div
                key={cat.id}
                onClick={() => setCategoryFilter(categoryFilter === cat.id ? 'all' : cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 cursor-pointer transition-all ${
                  categoryFilter === cat.id
                    ? 'ring-2 ring-blue-500 font-bold bg-slate-800 text-white'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300 light:bg-slate-100 light:border-slate-300 light:text-slate-800'
                }`}
              >
                {renderCategoryIcon(cat.iconName, cat.color)}
                <span>{cat.name}</span>
                <span
                  className="px-1.5 py-0.2 rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: cat.color }}
                >
                  {data.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* File Import Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="p-6 rounded-2xl border-2 border-dashed border-slate-700 hover:border-blue-500/80 bg-slate-900/50 hover:bg-slate-900/80 transition-all text-center space-y-2 dark:bg-slate-900/50 light:bg-slate-50 light:border-slate-300"
      >
        <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center">
          <Upload className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
            Drag and Drop Local Files Here to Test Categorization
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500 mt-0.5">
            Files added here will be automatically assigned to target folders (<code className="text-blue-300">Images</code>, <code className="text-emerald-300">Documents</code>, <code className="text-purple-300">Videos</code>) according to rules.
          </p>
        </div>
      </div>

      {/* File Inventory & Proposed Organization Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
        {/* Table Filters & Search Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FolderSearch className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
              File Catalog & Proposed Path Movements
            </h3>
            <span className="text-xs text-slate-400 font-normal">
              ({filteredFiles.length} of {files.length} items)
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search file name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 light:bg-slate-100 light:border-slate-300 light:text-slate-900"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none dark:bg-slate-800 dark:border-slate-700 light:bg-slate-100 light:border-slate-300 light:text-slate-800"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="organized">Organized</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700/80 text-[11px] font-semibold text-slate-300 uppercase tracking-wider dark:bg-slate-800/80 light:bg-slate-100 light:text-slate-700 light:border-slate-200">
                <th className="py-3 px-4">File Name & Type</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Detected Category</th>
                <th className="py-3 px-4">Original Location</th>
                <th className="py-3 px-4">Proposed Target Folder</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300 dark:divide-slate-800/60 light:divide-slate-200 light:text-slate-800">
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No files found matching current filters. Try resetting search or scanning drive.
                  </td>
                </tr>
              ) : (
                filteredFiles.map(file => {
                  const categoryObj = categories.find(c => c.id === file.category) || categories.find(c => c.id === 'other');
                  return (
                    <tr
                      key={file.id}
                      className="hover:bg-slate-800/40 transition-colors dark:hover:bg-slate-800/40 light:hover:bg-slate-50"
                    >
                      <td className="py-3 px-4 font-medium text-slate-100 dark:text-slate-100 light:text-slate-900 max-w-xs truncate">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">
                            {file.extension || '.file'}
                          </span>
                          <span title={file.name}>{file.name}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-400 dark:text-slate-400 light:text-slate-600">
                        {formatBytes(file.size)}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className="px-2.5 py-1 rounded-md text-[11px] font-medium inline-flex items-center gap-1.5"
                          style={{
                            backgroundColor: `${categoryObj?.color}15`,
                            color: categoryObj?.color,
                            border: `1px solid ${categoryObj?.color}30`
                          }}
                        >
                          {categoryObj && renderCategoryIcon(categoryObj.iconName, categoryObj.color)}
                          {categoryObj?.name || 'Misc'}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-xs truncate">
                        {file.originalPath}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-blue-300 dark:text-blue-300 light:text-blue-600 max-w-xs truncate font-semibold">
                        {file.proposedPath}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {file.status === 'organized' || file.status === 'indexed' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Organized
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
