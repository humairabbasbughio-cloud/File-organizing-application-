import React, { useState } from 'react';
import { useOrganizer } from '../context/OrganizerContext';
import { useAuth } from '../context/AuthContext';
import { GDPR_CHECKLIST } from '../data/initialData';
import { ShieldCheck, Download, Trash2, CheckCircle2, AlertCircle, FileText, Lock } from 'lucide-react';

export const GdprView: React.FC = () => {
  const { submitGdprExport, submitGdprErasure, gdprRequests } = useOrganizer();
  const { currentUser, hasPermission } = useAuth();

  const canExport = hasPermission('gdpr:export');
  const canErase = hasPermission('gdpr:erase');

  const [erasureReason, setErasureReason] = useState('');
  const [erasureSubmitted, setErasureSubmitted] = useState(false);

  const handleErasureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!erasureReason.trim()) return;
    submitGdprErasure(erasureReason);
    setErasureSubmitted(true);
    setErasureReason('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
              GDPR Data Protection & Subject Rights Suite
            </h2>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-1">
            Built-in compliance tools satisfying European Union General Data Protection Regulation (Regulation EU 2016/679) standards.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>EU GDPR Compliant</span>
        </div>
      </div>

      {/* GDPR Data Subject Rights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Right to Access & Data Portability (DSAR) */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 light:border-slate-200">
            <Download className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
              Right to Access & Data Portability (Art. 15 & 20)
            </h3>
          </div>

          <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed">
            Download a complete, machine-readable JSON archive containing all personal data, user account metadata, drive organization logs, and file catalog indexes associated with <strong className="text-blue-300">{currentUser.email}</strong>.
          </p>

          <button
            onClick={submitGdprExport}
            disabled={!canExport}
            className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${
              canExport
                ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Generate & Download DSAR Data Package</span>
          </button>
        </div>

        {/* Right to Erasure / Right to be Forgotten */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 light:border-slate-200">
            <Trash2 className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
              Right to Erasure / Anonymization (Art. 17)
            </h3>
          </div>

          <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed">
            Submit a formal request to permanently delete or anonymize user activity records, audit trail entries, and saved settings from system logs.
          </p>

          {erasureSubmitted ? (
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Right to Erasure request submitted successfully and logged for Data Protection Officer audit.</span>
            </div>
          ) : (
            <form onSubmit={handleErasureSubmit} className="space-y-3">
              <input
                type="text"
                required
                value={erasureReason}
                onChange={e => setErasureReason(e.target.value)}
                placeholder="Reason for erasure request (e.g. account closure)"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-red-500 dark:bg-slate-800 dark:border-slate-700 light:bg-slate-50 light:border-slate-300 light:text-slate-900"
              />
              <button
                type="submit"
                disabled={!canErase}
                className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${
                  canErase
                    ? 'bg-red-600/90 hover:bg-red-500 text-white cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span>Submit Erasure & Anonymization Request</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* GDPR Compliance Checklist Matrix */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider dark:text-slate-300 light:text-slate-700">
          EU GDPR Regulatory Compliance Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GDPR_CHECKLIST.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-2 dark:bg-slate-800/50 light:bg-slate-50 light:border-slate-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                    {item.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">
                  {item.complianceCode}
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* GDPR Log History */}
      {gdprRequests.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider dark:text-slate-300 light:text-slate-700">
            Subject Access Request (DSAR) Log History
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-300 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-3">Requested At</th>
                  <th className="p-3">User Email</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {gdprRequests.map(req => (
                  <tr key={req.id}>
                    <td className="p-3 font-mono text-slate-400">
                      {new Date(req.requestedAt).toLocaleString()}
                    </td>
                    <td className="p-3 text-slate-200">{req.userEmail}</td>
                    <td className="p-3 uppercase font-mono text-blue-300">{req.type}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase font-bold">
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{req.details}</td>
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
