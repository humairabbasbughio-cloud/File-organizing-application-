import React from 'react';
import { BookOpen, Terminal, Shield, Check, Copy, HardDrive, Cpu } from 'lucide-react';

export const DeploymentDocsView: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between gap-4 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
              Comprehensive Deployment & Installation Documentation
            </h2>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-1">
            Official setup and execution guide for local PC drives (D:\Data), Windows OS standalone launchers, macOS, and enterprise production environments.
          </p>
        </div>
      </div>

      {/* Section 1: Windows OS D: Drive Quick Start */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800 light:border-slate-200">
          <HardDrive className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
            1. Windows OS Setup & Execution Guide (D:\ Drive or custom partitions)
          </h3>
        </div>

        <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed">
          DriveSort Guard can run directly on your PC to categorize files in <code className="text-blue-300">D:\Data</code> or any downloaded directory without altering or deleting any file content.
        </p>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="font-bold text-slate-200 flex items-center justify-between">
              <span>Option A: Standalone Python Desktop GUI App (No Web Server Needed)</span>
              <button
                onClick={() => copyToClipboard('python organize_d_drive.py')}
                className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" /> Copy Command
              </button>
            </div>
            <p className="text-slate-400 text-[11px]">
              Extract the downloaded ZIP package, open Command Prompt or PowerShell in the folder, and run:
            </p>
            <pre className="p-3 rounded-lg bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto">
              python organize_d_drive.py
            </pre>
            <p className="text-slate-400 text-[11px]">
              A graphical desktop window will launch allowing you to choose your target folder (e.g. <code className="text-blue-300">D:\Data</code>), preview file scans, and safely organize files into subfolders.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="font-bold text-slate-200 flex items-center justify-between">
              <span>Option B: Windows Batch Launcher</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Simply double-click <code className="text-emerald-300">DriveSort_Windows_Launcher.bat</code> inside the extracted folder. It will detect your system environment and launch the file organizer app instantly.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="font-bold text-slate-200 flex items-center justify-between">
              <span>Option C: Native PowerShell CLI Command</span>
              <button
                onClick={() => copyToClipboard('.\\DriveSort_Windows_PowerShell.ps1 -TargetFolder "D:\\Data"')}
                className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" /> Copy Command
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto">
              Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass{'\n'}
              .\DriveSort_Windows_PowerShell.ps1 -TargetFolder "D:\Data" -DryRun
            </pre>
          </div>
        </div>
      </div>

      {/* Section 2: macOS Setup */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800 light:border-slate-200">
          <Terminal className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
            2. macOS Setup & Execution Guide
          </h3>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2 text-xs">
          <p className="text-slate-300">
            Double-click <code className="text-emerald-300">DriveSort_Mac_Installer.command</code> or run the bash script in Terminal:
          </p>
          <pre className="p-3 rounded-lg bg-slate-950 text-purple-300 font-mono text-xs overflow-x-auto">
            chmod +x organize_mac.sh DriveSort_Mac_Installer.command{'\n'}
            ./organize_mac.sh ~/Downloads
          </pre>
        </div>
      </div>

      {/* Section 3: Web Dashboard Express Production Server */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800 light:border-slate-200">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
            3. Node.js & Express Web Dashboard Production Deployment
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <p className="text-slate-300">
              To host the complete web management dashboard with RBAC, Audit Logging, and Encrypted Backups on your local network or server:
            </p>
            <pre className="p-3 rounded-lg bg-slate-950 text-blue-300 font-mono text-xs overflow-x-auto">
              # 1. Install dependencies{'\n'}
              npm install{'\n'}
              {'\n'}
              # 2. Build production assets & esbuild server.ts bundle{'\n'}
              npm run build{'\n'}
              {'\n'}
              # 3. Start production server on port 3000{'\n'}
              npm start
            </pre>
          </div>
        </div>
      </div>

      {/* Section 4: Security & GDPR Compliance Standards */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800 light:border-slate-200">
          <Shield className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
            4. Security Policy & GDPR Regulatory Compliance Summary
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
            <span className="font-bold text-emerald-400">Zero File Modification Guarantee</span>
            <p className="text-slate-400 text-[11px]">
              DriveSort Guard only performs file moves into category subfolders or virtual indexing. No file content is edited, trimmed, or deleted.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
            <span className="font-bold text-purple-400">Cryptographic Backups (AES-256)</span>
            <p className="text-slate-400 text-[11px]">
              Backups are encrypted locally using PBKDF2 key derivation and AES-GCM cipher before export.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
            <span className="font-bold text-blue-400">Role-Based Access Control</span>
            <p className="text-slate-400 text-[11px]">
              Access privileges are segmented into Admin, Data Manager, Auditor, and Viewer roles.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
            <span className="font-bold text-amber-400">Auditable System Trail</span>
            <p className="text-slate-400 text-[11px]">
              All file scans, folder moves, logins, and backups leave an immutable timestamped log.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
