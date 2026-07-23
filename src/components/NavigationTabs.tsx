import React from 'react';
import {
  FolderArchive,
  Sliders,
  Lock,
  Users,
  FileSpreadsheet,
  ShieldCheck,
  Download,
  BookOpen
} from 'lucide-react';

export type TabId =
  | 'organizer'
  | 'rules'
  | 'backup'
  | 'rbac'
  | 'audit'
  | 'gdpr'
  | 'packages'
  | 'docs';

interface NavigationTabsProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: 'organizer' as TabId,
      label: 'Drive Organizer',
      icon: FolderArchive,
      badge: 'Main'
    },
    {
      id: 'rules' as TabId,
      label: 'Sorting Rules',
      icon: Sliders
    },
    {
      id: 'backup' as TabId,
      label: 'Encrypted Backup',
      icon: Lock
    },
    {
      id: 'rbac' as TabId,
      label: 'RBAC Access',
      icon: Users
    },
    {
      id: 'audit' as TabId,
      label: 'Audit Logs',
      icon: FileSpreadsheet
    },
    {
      id: 'gdpr' as TabId,
      label: 'GDPR Suite',
      icon: ShieldCheck
    },
    {
      id: 'packages' as TabId,
      label: 'Executables & ZIP',
      icon: Download,
      highlight: true
    },
    {
      id: 'docs' as TabId,
      label: 'Deployment Docs',
      icon: BookOpen
    }
  ];

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 backdrop-blur sticky top-[61px] z-30 transition-colors dark:bg-slate-900/90 dark:border-slate-800 light:bg-slate-100 light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 dark:text-slate-400 dark:hover:text-slate-200 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-200/60'
                } ${tab.highlight && !isActive ? 'text-blue-400 border border-blue-500/30 bg-blue-500/10' : ''}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.highlight ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-800 text-slate-400'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
