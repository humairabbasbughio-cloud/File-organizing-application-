import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OrganizerProvider, useOrganizer } from './context/OrganizerContext';
import { useTheme } from './context/ThemeContext';
import {
  FolderArchive,
  Sliders,
  Lock,
  Users,
  FileSpreadsheet,
  ShieldCheck,
  Download,
  BookOpen,
  Search,
  Sun,
  Moon,
  User,
  ChevronDown,
  HardDrive,
  Menu,
  X
} from 'lucide-react';
import { FileOrganizerView } from './components/FileOrganizerView';
import { RulesManager } from './components/RulesManager';
import { EncryptedBackupView } from './components/EncryptedBackupView';
import { RbacView } from './components/RbacView';
import { AuditLogView } from './components/AuditLogView';
import { GdprView } from './components/GdprView';
import { PackageGeneratorView } from './components/PackageGeneratorView';
import { DeploymentDocsView } from './components/DeploymentDocsView';

export type TabId =
  | 'organizer'
  | 'rules'
  | 'backup'
  | 'rbac'
  | 'audit'
  | 'gdpr'
  | 'packages'
  | 'docs';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabId>('organizer');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { currentUser, users, switchUser } = useAuth();
  const { targetDrivePath, hasRealDirectoryAccess, realDirectoryName } = useOrganizer();

  const navItems = [
    { id: 'organizer' as TabId, label: 'Dashboard & Explorer', icon: FolderArchive, badge: 'D:' },
    { id: 'rules' as TabId, label: 'Sorting Rules', icon: Sliders },
    { id: 'backup' as TabId, label: 'Encrypted Backups', icon: Lock },
    { id: 'audit' as TabId, label: 'System Audit Logs', icon: FileSpreadsheet },
    { id: 'rbac' as TabId, label: 'User Access (RBAC)', icon: Users },
    { id: 'gdpr' as TabId, label: 'GDPR Compliance', icon: ShieldCheck },
    { id: 'packages' as TabId, label: 'Executables & Source ZIP', icon: Download, highlight: true },
    { id: 'docs' as TabId, label: 'Deployment Guide', icon: BookOpen },
  ];

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

  const renderActiveView = () => {
    switch (activeTab) {
      case 'organizer':
        return <FileOrganizerView />;
      case 'rules':
        return <RulesManager />;
      case 'backup':
        return <EncryptedBackupView />;
      case 'rbac':
        return <RbacView />;
      case 'audit':
        return <AuditLogView />;
      case 'gdpr':
        return <GdprView />;
      case 'packages':
        return <PackageGeneratorView />;
      case 'docs':
        return <DeploymentDocsView />;
      default:
        return <FileOrganizerView />;
    }
  };

  return (
    <div className="min-h-screen h-full flex flex-col md:flex-row bg-slate-900 font-sans text-slate-200 transition-colors dark:bg-slate-900 dark:text-slate-200 light:bg-slate-100 light:text-slate-900">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between z-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white shadow">
            FS
          </div>
          <h1 className="text-base font-bold tracking-tight text-white">
            DriveSort <span className="text-indigo-400">Pro</span>
          </h1>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded bg-slate-700 text-slate-200 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation - High Density Theme */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:flex w-full md:w-64 flex-shrink-0 flex-col border-r border-slate-700 bg-slate-800 z-40 dark:bg-slate-800 dark:border-slate-700 light:bg-white light:border-slate-200`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-700/80 hidden md:flex items-center space-x-3 light:border-slate-200">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white shadow-md">
            FS
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white dark:text-white light:text-slate-900 leading-tight">
              DriveSort <span className="text-indigo-400 font-extrabold">Pro</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono leading-none mt-0.5">
              D:\ Drive Security Hub
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-semibold dark:bg-indigo-600/20 dark:text-indigo-300 light:bg-indigo-50 light:text-indigo-700 light:border-indigo-300'
                    : 'text-slate-400 hover:bg-slate-700/60 hover:text-white dark:text-slate-400 dark:hover:bg-slate-700/60 light:text-slate-600 light:hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-slate-900/60 text-indigo-300 border border-indigo-500/20">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Badge */}
        <div className="p-4 mt-auto border-t border-slate-700/80 light:border-slate-200">
          <div className="flex items-center space-x-2 mb-1.5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider dark:text-slate-300 light:text-slate-700">
              GDPR Compliant
            </span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-500 light:text-slate-400">
            v2.4.1 Build 20260722 • Zero-Deletion
          </div>
        </div>
      </aside>

      {/* Main Content View Container */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Bar */}
        <header className="h-16 border-b border-slate-700 flex items-center justify-between px-4 sm:px-8 bg-slate-800 sticky top-0 z-30 shadow-md dark:bg-slate-800 dark:border-slate-700 light:bg-white light:border-slate-200">
          {/* Quick Search */}
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 w-64 sm:w-80 dark:bg-slate-900 dark:border-slate-700 light:bg-slate-50 light:border-slate-300">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search drive records & rules..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-200 w-full outline-none focus:ring-0 dark:text-slate-200 light:text-slate-900 placeholder:text-slate-500"
            />
          </div>

          {/* Active Drive Badge & User Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Target Drive Badge */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-700 text-xs font-mono text-indigo-300 dark:bg-slate-900 dark:border-slate-700 light:bg-slate-100 light:text-indigo-800">
              <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
              <span className="truncate max-w-[180px]">
                {hasRealDirectoryAccess ? `D:\\${realDirectoryName}` : targetDrivePath}
              </span>
              {hasRealDirectoryAccess ? (
                <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-1 py-0.2 rounded border border-emerald-500/30">
                  REAL
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 bg-slate-800 px-1 py-0.2 rounded border border-slate-700">
                  SIM
                </span>
              )}
            </div>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-xs text-slate-300 border border-slate-600 transition-colors cursor-pointer dark:bg-slate-700 dark:border-slate-600 light:bg-slate-100 light:border-slate-300 light:text-slate-800"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <div className="h-6 w-[1px] bg-slate-700 light:bg-slate-300"></div>

            {/* User Profile & Role Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-3 text-left focus:outline-none cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold leading-none text-slate-200 dark:text-slate-200 light:text-slate-800">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-indigo-400 font-mono uppercase mt-0.5">
                    {currentUser.role.replace('_', ' ')}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-700 border border-indigo-500 flex items-center justify-center font-bold text-xs text-indigo-300 shadow">
                  {currentUser.name.charAt(0)}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Switcher Dropdown */}
              {showUserDropdown && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl py-2 z-50 dark:bg-slate-800 dark:border-slate-700 light:bg-white light:border-slate-200 light:shadow-xl"
                  onMouseLeave={() => setShowUserDropdown(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-700/80 light:border-slate-100">
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Role Switcher (RBAC)
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Select account to test permissions
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
                            ? 'bg-indigo-600/20 text-indigo-300 font-semibold'
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
        </header>

        {/* View Content Area */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {renderActiveView()}
        </div>

        {/* App Footer */}
        <footer className="bg-slate-800/80 border-t border-slate-700 text-slate-400 py-3 px-6 text-xs mt-auto dark:bg-slate-800/80 dark:border-slate-700 light:bg-slate-100 light:border-slate-200">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
                DriveSort Pro
              </span>
              <span className="text-slate-600">•</span>
              <span>Zero-Deletion Guarantee</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-400 font-mono">
              <span>Windows D:\ & macOS</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                AES-256
              </span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <OrganizerProvider>
          <AppContent />
        </OrganizerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
