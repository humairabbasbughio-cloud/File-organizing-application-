import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ROLE_PERMISSIONS_MAP } from '../data/initialData';
import { UserRole } from '../types';
import { Users, UserPlus, Shield, Check, AlertTriangle, UserCheck } from 'lucide-react';

export const RbacView: React.FC = () => {
  const { currentUser, users, updateUserRole, addUser, removeUser, hasPermission } = useAuth();
  const canManageUsers = hasPermission('users:manage');

  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('viewer');
  const [newUserDept, setNewUserDept] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    addUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      department: newUserDept || 'General Operations',
      status: 'active'
    });

    setNewUserName('');
    setNewUserEmail('');
    setNewUserDept('');
    setShowAddModal(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'data_manager':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'auditor':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
              Role-Based Access Control (RBAC) System
            </h2>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-1">
            Enforce least-privilege security controls across Admin, Data Manager, Auditor, and Viewer roles.
          </p>
        </div>

        {canManageUsers && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Provision New User</span>
          </button>
        )}
      </div>

      {!canManageUsers && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            You are viewing RBAC configurations in read-only mode. Switch to an <strong>Admin</strong> user account in the top right menu to provision users or modify role assignments.
          </span>
        </div>
      )}

      {/* User Management Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider dark:text-slate-300 light:text-slate-700">
            Provisioned System Accounts ({users.length})
          </h3>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 light:border-slate-200">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-300 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Department</th>
                <th className="p-3">Assigned Role</th>
                <th className="p-3">Last Active</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                          <span>{u.name}</span>
                          {u.id === currentUser.id && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                              Active You
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">{u.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3 text-slate-300">{u.department || 'N/A'}</td>

                  <td className="p-3">
                    {canManageUsers && u.id !== currentUser.id ? (
                      <select
                        value={u.role}
                        onChange={e => updateUserRole(u.id, e.target.value as UserRole)}
                        className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none"
                      >
                        <option value="admin">System Administrator</option>
                        <option value="data_manager">Data Manager</option>
                        <option value="auditor">Auditor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase border ${getRoleBadgeColor(
                          u.role
                        )}`}
                      >
                        {u.role.replace('_', ' ')}
                      </span>
                    )}
                  </td>

                  <td className="p-3 font-mono text-slate-400 text-[11px]">
                    {new Date(u.lastActive).toLocaleString()}
                  </td>

                  <td className="p-3 text-right">
                    {canManageUsers && u.id !== currentUser.id && (
                      <button
                        onClick={() => removeUser(u.id)}
                        className="text-red-400 hover:text-red-300 text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Revoke Access
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permission Matrix */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider dark:text-slate-300 light:text-slate-700">
          Role Permission Capabilities Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROLE_PERMISSIONS_MAP.map(roleItem => (
            <div
              key={roleItem.role}
              className={`p-4 rounded-xl border space-y-3 ${
                currentUser.role === roleItem.role
                  ? 'bg-slate-800/90 border-blue-500 shadow-lg'
                  : 'bg-slate-800/40 border-slate-700/80 dark:bg-slate-800/40 light:bg-slate-50 light:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                    {roleItem.title}
                  </span>
                </div>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase border ${getRoleBadgeColor(
                    roleItem.role
                  )}`}
                >
                  {roleItem.role}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
                {roleItem.description}
              </p>

              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                  Granted Privileges ({roleItem.permissions.length})
                </div>
                <div className="space-y-1">
                  {roleItem.permissions.map(perm => (
                    <div
                      key={perm}
                      className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{perm}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-purple-400" />
                Provision New User Account
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  placeholder="e.g. David Miller"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  placeholder="e.g. david@company.com"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Department</label>
                <input
                  type="text"
                  value={newUserDept}
                  onChange={e => setNewUserDept(e.target.value)}
                  placeholder="e.g. Finance & Operations"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assign Role</label>
                <select
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none"
                >
                  <option value="admin">Admin (Full Access)</option>
                  <option value="data_manager">Data Manager (Organize & Backup)</option>
                  <option value="auditor">Auditor (Read-Only Logs & GDPR)</option>
                  <option value="viewer">Viewer (Read-Only Scanner)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold cursor-pointer shadow"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
