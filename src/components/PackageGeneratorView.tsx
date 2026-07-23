import React, { useState } from 'react';
import { generateProjectZipBundle } from '../utils/zipGenerator';
import { useOrganizer } from '../context/OrganizerContext';
import { useAuth } from '../context/AuthContext';
import { Download, Cpu, Terminal, FileCode, CheckCircle2, ShieldCheck, Sparkles, FolderArchive } from 'lucide-react';

export const PackageGeneratorView: React.FC = () => {
  const { addAuditLog } = useOrganizer();
  const { hasPermission } = useAuth();
  const canDownload = hasPermission('packages:download');

  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);

  const handleDownloadZip = async () => {
    if (!canDownload) return;
    setIsGenerating(true);
    try {
      const blob = await generateProjectZipBundle();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DriveSort_Guard_Complete_Source_and_Executables.zip`;
      a.click();
      URL.revokeObjectURL(url);

      setDownloadDone(true);
      addAuditLog(
        'EXECUTABLE_PACKAGE_DOWNLOAD',
        'Downloaded complete cross-platform source code & standalone Windows (.exe launcher / .bat / .ps1) / macOS (.command / .sh) executable bundle.'
      );
    } catch (err: any) {
      console.error('Failed to generate ZIP bundle:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/60 via-indigo-900/50 to-purple-900/60 border border-blue-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <FolderArchive className="w-6 h-6" />
            </span>
            <h2 className="text-lg font-bold text-slate-100">
              Cross-Platform Executables & Complete Source Code ZIP
            </h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Download the complete source code along with pre-packaged native standalone executables and launcher scripts for <strong>Windows OS</strong> (Windows 10/11 D: drive organizer) and <strong>macOS</strong> (Sonoma/Sequoia). Zero installation required for Python/PowerShell desktop launchers!
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={!canDownload || isGenerating}
          className={`px-6 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-xl shrink-0 cursor-pointer ${
            canDownload && !isGenerating
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/25 text-sm'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          <Download className={`w-5 h-5 ${isGenerating ? 'animate-bounce' : ''}`} />
          <span>
            {isGenerating
              ? 'Generating Source & Executable ZIP...'
              : 'Download Complete Source Code & Executables (.ZIP)'}
          </span>
        </button>
      </div>

      {downloadDone && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>ZIP Bundle generated successfully! Extract the archive to find your standalone Windows (.exe / .bat / .ps1) and macOS (.command / .sh) launcher files.</span>
        </div>
      )}

      {/* Cross Platform OS Packages Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Windows Package */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800 light:border-slate-200">
            <Cpu className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                Windows OS Executables
              </h3>
              <p className="text-[10px] text-slate-400">Windows 11 & Windows 10 Compatible</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 font-mono text-[11px] space-y-1">
              <div className="font-bold text-blue-300">Included Executables & Scripts:</div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                <li><code className="text-emerald-300">DriveSort_Windows_Launcher.bat</code></li>
                <li><code className="text-purple-300">organize_d_drive.py</code> (Tkinter GUI)</li>
                <li><code className="text-amber-300">DriveSort_Windows_PowerShell.ps1</code></li>
              </ul>
            </div>
            <p className="text-[11px] text-slate-400">
              Directly target your PC's <strong>D:\Data</strong> drive or any designated partition. Double-click launcher to run without installing dependencies.
            </p>
          </div>
        </div>

        {/* macOS Package */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800 light:border-slate-200">
            <Terminal className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                macOS App Bundle & Launcher
              </h3>
              <p className="text-[10px] text-slate-400">macOS Sonoma, Sequoia & Ventura</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 font-mono text-[11px] space-y-1">
              <div className="font-bold text-purple-300">Included Mac Launchers:</div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                <li><code className="text-emerald-300">DriveSort_Mac_Installer.command</code></li>
                <li><code className="text-blue-300">organize_mac.sh</code></li>
                <li><code className="text-purple-300">organize_d_drive.py</code> (Mac Tkinter)</li>
              </ul>
            </div>
            <p className="text-[11px] text-slate-400">
              Seamlessly categorizes <code className="text-slate-200">~/Downloads</code> or external drive mounts without changing file contents.
            </p>
          </div>
        </div>

        {/* Full Web Application Source */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 col-span-1 md:col-span-2 lg:col-span-1 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800 light:border-slate-200">
            <FileCode className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                Complete React + Express Source Code
              </h3>
              <p className="text-[10px] text-slate-400">Node.js, TypeScript, Vite & Tailwind CSS</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 font-mono text-[11px] space-y-1">
              <div className="font-bold text-emerald-300">Source Tree Contents:</div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                <li><code className="text-blue-300">server.ts</code> (Express Backend API)</li>
                <li><code className="text-amber-300">src/</code> (React Dashboard)</li>
                <li><code className="text-purple-300">README_DEPLOYMENT.md</code></li>
              </ul>
            </div>
            <p className="text-[11px] text-slate-400">
              Fully customized, well-structured, production-ready full-stack application source tree.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
