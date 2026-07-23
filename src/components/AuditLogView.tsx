import React, { useState } from 'react';
import { useOrganizer } from '../context/OrganizerContext';
import { useAuth } from '../context/AuthContext';
import { FileSpreadsheet, Download, Search, CheckCircle2, AlertTriangle, ShieldCheck, Filter } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = useOrganizer();
  const { hasPermission } = useAuth();

  const canView = hasPermission('logs:view');
  const canExport = hasPermission('logs:export');

  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;

    return matchesSearch && matchesAction && matchesStatus;
  });

  const handleExportCsv = () => {
    const headers = ['ID', 'Timestamp', 'User Name', 'User Email', 'Role', 'Action', 'Status', 'Details', 'IP Address'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      `"${l.userName}"`,
      l.userEmail,
      l.userRole,
      l.action,
      l.status,
      `"${l.details.replace(/"/g, '""')}"`,
      l.ipAddress || '127.0.0.1'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DriveSort_Audit_Logs_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DriveSort_Audit_Logs_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
              Immutable User Activity & Audit Trail Records
            </h2>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-1">
            Complete compliance trail logging every user login, folder scan, file organization move, backup creation, and GDPR export (GDPR Art. 30 & 32 compliant).
          </p>
        </div>

        {canExport && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 light:bg-slate-100 light:border-slate-300 light:text-slate-800"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportJson}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        )}
      </div>

      {!canView ? (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center py-12 space-y-2 dark:bg-slate-900 light:bg-white">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">
            Access Restricted
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Viewing system audit logs requires <strong>Auditor</strong>, <strong>Data Manager</strong>, or <strong>Admin</strong> permissions. Switch roles using the top right account menu.
          </p>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by user, action, or log details..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 light:bg-slate-100 light:border-slate-300 light:text-slate-900"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Action:</span>
              </div>
              <select
                value={actionFilter}
                onChange={e => setActionFilter(e.target.value)}
                className="px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none dark:bg-slate-800 dark:border-slate-700 light:bg-slate-100 light:border-slate-300 light:text-slate-800"
              >
                <option value="all">All Actions</option>
                <option value="USER_LOGIN">USER_LOGIN</option>
                <option value="FILE_SCAN">FILE_SCAN</option>
                <option value="FILE_ORGANIZE">FILE_ORGANIZE</option>
                <option value="RULE_UPDATE">RULE_UPDATE</option>
                <option value="BACKUP_CREATED">BACKUP_CREATED</option>
                <option value="BACKUP_RESTORED">BACKUP_RESTORED</option>
                <option value="GDPR_EXPORT">GDPR_EXPORT</option>
                <option value="GDPR_ERASURE_REQUEST">GDPR_ERASURE_REQUEST</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none dark:bg-slate-800 dark:border-slate-700 light:bg-slate-100 light:border-slate-300 light:text-slate-800"
              >
                <option value="all">All Statuses</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="WARNING">WARNING</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 light:border-slate-200">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-300 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User & Role</th>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Activity Description</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No audit logs match current search filters.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <div className="font-medium text-slate-200">{log.userName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {log.userEmail} ({log.userRole})
                        </div>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700 font-mono text-[10px] font-bold">
                          {log.action}
                        </span>
                      </td>

                      <td className="p-3 text-slate-300 max-w-md">
                        {log.details}
                      </td>

                      <td className="p-3 text-center whitespace-nowrap">
                        {log.status === 'SUCCESS' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> SUCCESS
                          </span>
                        ) : log.status === 'WARNING' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            WARNING
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                            FAILED
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
