import React, { useState } from 'react';
import { useOrganizer } from '../context/OrganizerContext';
import { useAuth } from '../context/AuthContext';
import { Lock, Download, KeyRound, AlertTriangle, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { EncryptedBackupPayload } from '../types';

export const EncryptedBackupView: React.FC = () => {
  const { createEncryptedBackup, restoreFromEncryptedBackup, backupHistory } = useOrganizer();
  const { hasPermission } = useAuth();

  const canCreate = hasPermission('backup:create');
  const canRestore = hasPermission('backup:restore');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [latestPayload, setLatestPayload] = useState<EncryptedBackupPayload | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Restore state
  const [restoreJsonInput, setRestoreJsonInput] = useState('');
  const [restorePassword, setRestorePassword] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreMsg, setRestoreMsg] = useState<string | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  const handleCreateBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password.length < 6) {
      setErrorMsg('Master encryption password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Encryption passwords do not match.');
      return;
    }

    setIsCreating(true);
    try {
      const payload = await createEncryptedBackup(password);
      setLatestPayload(payload);
      setSuccessMsg('AES-256 Encrypted backup successfully created!');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setErrorMsg('Failed to create backup: ' + err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDownloadPayload = (payload: EncryptedBackupPayload) => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DriveSort_Backup_AES256_${payload.timestamp.replace(/[:.]/g, '-')}.enc.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRestoreError(null);
    setRestoreMsg(null);

    if (!restoreJsonInput.trim() || !restorePassword.trim()) {
      setRestoreError('Please provide both the backup JSON payload and decryption password.');
      return;
    }

    setIsRestoring(true);
    try {
      const payload: EncryptedBackupPayload = JSON.parse(restoreJsonInput);
      const success = await restoreFromEncryptedBackup(payload, restorePassword);
      if (success) {
        setRestoreMsg('Backup decrypted and state restored successfully!');
        setRestoreJsonInput('');
        setRestorePassword('');
      } else {
        setRestoreError('Decryption failed. Please verify the password and backup file format.');
      }
    } catch (err: any) {
      setRestoreError('Invalid JSON backup file payload.');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        const text = event.target?.result as string;
        setRestoreJsonInput(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
              AES-256 Encrypted Backup & Restore Solution
            </h2>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-1">
            Safeguard your file catalog metadata, category mapping, and organization rules with client-side AES-GCM 256-bit cryptography and PBKDF2 salt derivation.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-purple-300 dark:bg-slate-800 dark:border-slate-700">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>PBKDF2 SHA-256 Key Derivation</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Encrypted Backup Form */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
          <div className="flex items-center gap-2 border-b border-slate-800 light:border-slate-200 pb-3">
            <KeyRound className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
              Create New Encrypted Backup
            </h3>
          </div>

          {!canCreate ? (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Creating backups requires <strong>Data Manager</strong> or <strong>Admin</strong> privileges.</span>
            </div>
          ) : (
            <form onSubmit={handleCreateBackup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-1">
                  Master Decryption Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter secure password (min 6 chars)"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 light:bg-slate-50 light:border-slate-300 light:text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 light:bg-slate-50 light:border-slate-300 light:text-slate-900"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isCreating}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>{isCreating ? 'Encrypting & Generating Backup...' : 'Generate AES-256 Encrypted Backup'}</span>
              </button>
            </form>
          )}

          {latestPayload && (
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3 dark:bg-slate-800/80 light:bg-slate-100 light:border-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Latest Backup Package Ready
                </span>
                <span className="text-[10px] font-mono text-slate-400">{latestPayload.algorithm}</span>
              </div>
              <div className="text-[11px] font-mono text-slate-300 space-y-1">
                <p>Created: {new Date(latestPayload.timestamp).toLocaleString()}</p>
                <p className="truncate">Checksum: {latestPayload.checksum}</p>
              </div>
              <button
                onClick={() => handleDownloadPayload(latestPayload)}
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Encrypted .enc.json File</span>
              </button>
            </div>
          )}
        </div>

        {/* Restore Backup Form */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-800 light:border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                Restore System State from Encrypted Backup
              </h3>
            </div>
          </div>

          {!canRestore ? (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Restoring backups requires <strong>Admin</strong> privileges.</span>
            </div>
          ) : (
            <form onSubmit={handleRestoreSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-1">
                  Upload Backup File (.enc.json)
                </label>
                <input
                  type="file"
                  accept=".json,.enc"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-blue-300 hover:file:bg-slate-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-1">
                  Or Paste Encrypted JSON Payload
                </label>
                <textarea
                  rows={3}
                  value={restoreJsonInput}
                  onChange={e => setRestoreJsonInput(e.target.value)}
                  placeholder='{"version": "1.0.0", "algorithm": "AES-256-GCM", ...}'
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 light:bg-slate-50 light:border-slate-300 light:text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-1">
                  Decryption Master Password
                </label>
                <input
                  type="password"
                  value={restorePassword}
                  onChange={e => setRestorePassword(e.target.value)}
                  placeholder="Enter password used during backup creation"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 light:bg-slate-50 light:border-slate-300 light:text-slate-900"
                />
              </div>

              {restoreError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{restoreError}</span>
                </div>
              )}

              {restoreMsg && (
                <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{restoreMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isRestoring}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isRestoring ? 'animate-spin' : ''}`} />
                <span>{isRestoring ? 'Decrypting Payload...' : 'Verify Password & Restore State'}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Backup History Table */}
      {backupHistory.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider dark:text-slate-300 light:text-slate-700">
            Active Session Encrypted Backup History ({backupHistory.length})
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800 light:border-slate-200">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-300 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Created At</th>
                  <th className="p-3">Algorithm</th>
                  <th className="p-3">Created By</th>
                  <th className="p-3">SHA-256 Checksum</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {backupHistory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-slate-200">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono text-[10px]">
                        {item.algorithm}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{item.createdBy}</td>
                    <td className="p-3 font-mono text-blue-300 text-[11px] truncate max-w-xs">
                      {item.checksum}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDownloadPayload(item)}
                        className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
