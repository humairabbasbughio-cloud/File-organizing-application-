import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useOrganizer } from '../context/OrganizerContext';
import { Shield, Moon, Sun, HardDrive, User, ChevronDown, CheckCircle, Lock } from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, users, switchUser } = useAuth();
  const { targetDrivePath, hasRealDirectoryAccess, realDirectoryName } = useOrganizer();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

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
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-lg transition-colors dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200 light:text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-md text-white">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white dark:text-white light:text-slate-900">
                DriveSort Guard
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
                <Lock className="w-3 h-3" /> Non-Destructive
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">
              PC Drive File Categorizer & Security Hub
            </p>
          </div>
        </div>

        {/* Active Drive Badge */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs font-mono text-slate-300 dark:bg-slate-800/80 dark:text-slate-300 light:bg-slate-100 light:text-slate-700 light:border-slate-300">
          <HardDrive className="w-4 h-4 text-blue-400" />
          <span>
            Drive Path:{' '}
            <strong className="text-blue-300 light:text-blue-600">
              {hasRealDirectoryAccess ? `D:\\${realDirectoryName}` : targetDrivePath}
            </strong>
          </span>
          {hasRealDirectoryAccess ? (
            <span className="ml-1 text-emerald-400 flex items-center gap-1 text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded">
              <CheckCircle className="w-2.5 h-2.5" /> Real Local Access
            </span>
          ) : (
            <span className="ml-1 text-slate-400 text-[10px] bg-slate-700/50 px-1.5 py-0.5 rounded">
              Simulated D:\ Drive
            </span>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors dark:bg-slate-800 dark:border-slate-700 light:bg-slate-100 light:text-slate-700 light:border-slate-300"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all text-left dark:bg-slate-800 dark:border-slate-700 light:bg-slate-100 light:border-slate-300"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800 leading-tight">
                  {currentUser.name}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-medium border uppercase tracking-wider ${getRoleBadgeColor(
                      currentUser.role
                    )}`}
                  >
                    {currentUser.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Role Switcher Dropdown */}
            {showUserDropdown && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl py-2 z-50 dark:bg-slate-800 dark:border-slate-700 light:bg-white light:border-slate-200 light:shadow-xl"
                onMouseLeave={() => setShowUserDropdown(false)}
              >
                <div className="px-3 py-2 border-b border-slate-700/80 light:border-slate-100">
                  <p className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                    Quick Role Switcher (RBAC)
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Test different permission levels
                  </p>
                </div>
                <div className="max-h-56 overflow-y-auto p-1">
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        u.id === currentUser.id
                          ? 'bg-blue-600/20 text-blue-300 font-semibold'
                          : 'hover:bg-slate-700/60 text-slate-300 light:text-slate-700 light:hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <div>
                          <div className="font-medium text-slate-200 dark:text-slate-200 light:text-slate-800">
                            {u.name}
                          </div>
                          <div className="text-[10px] text-slate-400">{u.email}</div>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono border uppercase ${getRoleBadgeColor(
                          u.role
                        )}`}
                      >
                        {u.role.replace('_', ' ')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
