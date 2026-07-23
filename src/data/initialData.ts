import { FileCategory, OrganizationRule, User, RolePermissions, AuditLog, FileItem } from '../types';

export const DEFAULT_CATEGORIES: FileCategory[] = [
  {
    id: 'images',
    name: 'Images',
    folderName: 'Images',
    iconName: 'Image',
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico', '.tiff', '.raw', '.heic'],
    color: '#3B82F6', // Blue
    description: 'Photos, graphics, diagrams, screenshots, and vector illustrations.'
  },
  {
    id: 'documents',
    name: 'Documents',
    folderName: 'Documents',
    iconName: 'FileText',
    extensions: ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt', '.md', '.epub', '.pages'],
    color: '#10B981', // Emerald green
    description: 'Text documents, manuals, PDF reports, notes, and ebooks.'
  },
  {
    id: 'spreadsheets',
    name: 'Spreadsheets',
    folderName: 'Spreadsheets',
    iconName: 'Table',
    extensions: ['.xls', '.xlsx', '.csv', '.ods', '.tsv', '.numbers'],
    color: '#059669', // Dark green
    description: 'Excel sheets, financial records, CSV data, and analytics tables.'
  },
  {
    id: 'videos',
    name: 'Videos',
    folderName: 'Videos',
    iconName: 'Film',
    extensions: ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.webm', '.m4v'],
    color: '#8B5CF6', // Purple
    description: 'Movies, screen recordings, clips, video tutorials, and webinars.'
  },
  {
    id: 'audio',
    name: 'Audio & Music',
    folderName: 'Audio',
    iconName: 'Music',
    extensions: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a', '.wma'],
    color: '#EC4899', // Pink
    description: 'Music tracks, podcasts, voice recordings, and sound effects.'
  },
  {
    id: 'archives',
    name: 'Archives & Compressed',
    folderName: 'Archives',
    iconName: 'Archive',
    extensions: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.iso'],
    color: '#F59E0B', // Amber
    description: 'Zip archives, ISO images, compressed backup bundles.'
  },
  {
    id: 'code',
    name: 'Source Code & Scripts',
    folderName: 'Code',
    iconName: 'Code',
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.py', '.java', '.cpp', '.c', '.html', '.css', '.json', '.sh', '.ps1', '.sql'],
    color: '#06B6D4', // Cyan
    description: 'Development source files, scripts, configurations, and queries.'
  },
  {
    id: 'executables',
    name: 'Programs & Executables',
    folderName: 'Executables',
    iconName: 'Cpu',
    extensions: ['.exe', '.msi', '.dmg', '.app', '.deb', '.rpm', '.apk'],
    color: '#EF4444', // Red
    description: 'Installers, desktop executables, system tools, and packages.'
  },
  {
    id: 'other',
    name: 'Uncategorized & Misc',
    folderName: 'Misc',
    iconName: 'Folder',
    extensions: [],
    color: '#6B7280', // Gray
    description: 'Miscellaneous files that do not match existing extensions.'
  }
];

export const ROLE_PERMISSIONS_MAP: RolePermissions[] = [
  {
    role: 'admin',
    title: 'System Administrator',
    description: 'Full administrative access to organize files, manage users, configure RBAC, audit logs, GDPR compliance, and system backups.',
    permissions: [
      'files:scan',
      'files:organize',
      'rules:manage',
      'backup:create',
      'backup:restore',
      'users:manage',
      'logs:view',
      'logs:export',
      'gdpr:export',
      'gdpr:erase',
      'packages:download'
    ]
  },
  {
    role: 'data_manager',
    title: 'Data Manager',
    description: 'Can scan and organize local drive folders, adjust rule mapping, and create encrypted backups.',
    permissions: [
      'files:scan',
      'files:organize',
      'rules:manage',
      'backup:create',
      'logs:view',
      'packages:download'
    ]
  },
  {
    role: 'auditor',
    title: 'Security & Compliance Auditor',
    description: 'Read-only access to immutable audit trails, GDPR compliance logs, and file indexing activity.',
    permissions: [
      'logs:view',
      'logs:export',
      'gdpr:export'
    ]
  },
  {
    role: 'viewer',
    title: 'Read-Only Viewer',
    description: 'Can view organized drive structures, categories, and file catalogs without execution privileges.',
    permissions: [
      'files:scan'
    ]
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u-admin-01',
    name: 'Alexander Wright',
    email: 'admin@drivesort.local',
    role: 'admin',
    department: 'IT Operations & Security',
    lastActive: new Date().toISOString(),
    createdAt: '2026-01-10T08:30:00Z',
    status: 'active'
  },
  {
    id: 'u-mgr-02',
    name: 'Sarah Chen',
    email: 'manager@drivesort.local',
    role: 'data_manager',
    department: 'Data Management',
    lastActive: new Date(Date.now() - 3600000).toISOString(),
    createdAt: '2026-02-01T10:00:00Z',
    status: 'active'
  },
  {
    id: 'u-audit-03',
    name: 'Marcus Vance',
    email: 'auditor@drivesort.local',
    role: 'auditor',
    department: 'Compliance & GDPR Audit',
    lastActive: new Date(Date.now() - 7200000).toISOString(),
    createdAt: '2026-02-15T14:20:00Z',
    status: 'active'
  },
  {
    id: 'u-view-04',
    name: 'Elena Rostova',
    email: 'viewer@drivesort.local',
    role: 'viewer',
    department: 'General Staff',
    lastActive: new Date(Date.now() - 86400000).toISOString(),
    createdAt: '2026-03-01T09:15:00Z',
    status: 'active'
  }
];

export const DEFAULT_ORGANIZATION_RULE: OrganizationRule = {
  id: 'rule-default',
  name: 'Standard Drive Category Sorting',
  enabled: true,
  mode: 'category_folders',
  targetDriveFolder: 'D:\\Data',
  categoryMappings: {
    images: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    documents: ['.pdf', '.docx', '.txt', '.rtf', '.md'],
    spreadsheets: ['.xlsx', '.csv', '.xls'],
    videos: ['.mp4', '.mkv', '.mov'],
    audio: ['.mp3', '.flac', '.wav'],
    archives: ['.zip', '.7z', '.rar'],
    code: ['.js', '.ts', '.py', '.json'],
    executables: ['.exe', '.msi', '.dmg']
  },
  createSubfolders: true,
  preservePathStructure: false,
  nonDestructiveStrict: true
};

export const INITIAL_MOCK_FILES: FileItem[] = [
  {
    id: 'f-01',
    name: 'Q2_Financial_Report_2026.pdf',
    size: 4520000,
    extension: '.pdf',
    category: 'documents',
    originalPath: 'D:\\Data\\Q2_Financial_Report_2026.pdf',
    proposedPath: 'D:\\Data\\Documents\\Q2_Financial_Report_2026.pdf',
    lastModified: '2026-07-10T14:22:00Z',
    checksum: 'a8f9c1e2b3d4...',
    status: 'pending'
  },
  {
    id: 'f-02',
    name: 'Project_Architecture_Diagram.png',
    size: 2840000,
    extension: '.png',
    category: 'images',
    originalPath: 'D:\\Data\\Project_Architecture_Diagram.png',
    proposedPath: 'D:\\Data\\Images\\Project_Architecture_Diagram.png',
    lastModified: '2026-07-15T10:11:00Z',
    checksum: 'b9d8e7f6a5c4...',
    status: 'pending'
  },
  {
    id: 'f-03',
    name: 'Client_Contracts_Export.xlsx',
    size: 1980000,
    extension: '.xlsx',
    category: 'spreadsheets',
    originalPath: 'D:\\Data\\Client_Contracts_Export.xlsx',
    proposedPath: 'D:\\Data\\Spreadsheets\\Client_Contracts_Export.xlsx',
    lastModified: '2026-07-18T16:45:00Z',
    checksum: 'c1d2e3f4a5b6...',
    status: 'pending'
  },
  {
    id: 'f-04',
    name: 'Product_Demo_Walkthrough.mp4',
    size: 184000000,
    extension: '.mp4',
    category: 'videos',
    originalPath: 'D:\\Data\\Product_Demo_Walkthrough.mp4',
    proposedPath: 'D:\\Data\\Videos\\Product_Demo_Walkthrough.mp4',
    lastModified: '2026-07-02T11:30:00Z',
    checksum: 'd4e5f6a7b8c9...',
    status: 'pending'
  },
  {
    id: 'f-05',
    name: 'Podcast_Episode_42_Audio.mp3',
    size: 32500000,
    extension: '.mp3',
    category: 'audio',
    originalPath: 'D:\\Data\\Podcast_Episode_42_Audio.mp3',
    proposedPath: 'D:\\Data\\Audio\\Podcast_Episode_42_Audio.mp3',
    lastModified: '2026-06-28T09:05:00Z',
    checksum: 'e5f6a7b8c9d0...',
    status: 'pending'
  },
  {
    id: 'f-06',
    name: 'Database_Backup_20260701.zip',
    size: 94000000,
    extension: '.zip',
    category: 'archives',
    originalPath: 'D:\\Data\\Database_Backup_20260701.zip',
    proposedPath: 'D:\\Data\\Archives\\Database_Backup_20260701.zip',
    lastModified: '2026-07-01T00:00:00Z',
    checksum: 'f6a7b8c9d0e1...',
    status: 'pending'
  },
  {
    id: 'f-07',
    name: 'data_processing_script.py',
    size: 14200,
    extension: '.py',
    category: 'code',
    originalPath: 'D:\\Data\\data_processing_script.py',
    proposedPath: 'D:\\Data\\Code\\data_processing_script.py',
    lastModified: '2026-07-20T18:14:00Z',
    checksum: 'a1b2c3d4e5f6...',
    status: 'pending'
  },
  {
    id: 'f-08',
    name: 'Node_JS_v22_Installer.msi',
    size: 31000000,
    extension: '.msi',
    category: 'executables',
    originalPath: 'D:\\Data\\Node_JS_v22_Installer.msi',
    proposedPath: 'D:\\Data\\Executables\\Node_JS_v22_Installer.msi',
    lastModified: '2026-05-12T13:22:00Z',
    checksum: 'b2c3d4e5f6a7...',
    status: 'pending'
  },
  {
    id: 'f-09',
    name: 'Team_Meeting_Notes.txt',
    size: 8400,
    extension: '.txt',
    category: 'documents',
    originalPath: 'D:\\Data\\Team_Meeting_Notes.txt',
    proposedPath: 'D:\\Data\\Documents\\Team_Meeting_Notes.txt',
    lastModified: '2026-07-21T09:40:00Z',
    checksum: 'c3d4e5f6a7b8...',
    status: 'pending'
  },
  {
    id: 'f-10',
    name: 'Banner_Hero_4k.webp',
    size: 1240000,
    extension: '.webp',
    category: 'images',
    originalPath: 'D:\\Data\\Banner_Hero_4k.webp',
    proposedPath: 'D:\\Data\\Images\\Banner_Hero_4k.webp',
    lastModified: '2026-07-19T21:15:00Z',
    checksum: 'd4e5f6a7b8c9...',
    status: 'pending'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-101',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    userId: 'u-admin-01',
    userName: 'Alexander Wright',
    userEmail: 'admin@drivesort.local',
    userRole: 'admin',
    action: 'USER_LOGIN',
    details: 'User authenticated successfully with MFA verification.',
    status: 'SUCCESS',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'log-102',
    timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
    userId: 'u-mgr-02',
    userName: 'Sarah Chen',
    userEmail: 'manager@drivesort.local',
    userRole: 'data_manager',
    action: 'FILE_SCAN',
    details: 'Initiated non-destructive drive scan on target: D:\\Data (10 files identified).',
    status: 'SUCCESS',
    ipAddress: '192.168.1.88'
  },
  {
    id: 'log-103',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    userId: 'u-admin-01',
    userName: 'Alexander Wright',
    userEmail: 'admin@drivesort.local',
    userRole: 'admin',
    action: 'BACKUP_CREATED',
    details: 'Generated AES-256 encrypted backup archive (Checksum: SHA256-e3b0c442...).',
    status: 'SUCCESS',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'log-104',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    userId: 'u-audit-03',
    userName: 'Marcus Vance',
    userEmail: 'auditor@drivesort.local',
    userRole: 'auditor',
    action: 'GDPR_EXPORT',
    details: 'Exported Data Subject Access Report (DSAR) for compliance audit.',
    status: 'SUCCESS',
    ipAddress: '192.168.1.102'
  }
];

export const GDPR_CHECKLIST = [
  {
    id: 'gdpr-1',
    title: 'Zero-Data-Modification & No Unsolicited Deletion Guarantee',
    description: 'Data files remain 100% intact with strict non-destructive move/index operations.',
    status: 'Pass',
    complianceCode: 'Art. 5(1)(f) - Integrity & Confidentiality'
  },
  {
    id: 'gdpr-2',
    title: 'Local Standalone Processing & Data Isolation',
    description: 'No drive file content or user personal records are transmitted to third-party telemetry servers.',
    status: 'Pass',
    complianceCode: 'Art. 25 - Data Protection by Design'
  },
  {
    id: 'gdpr-3',
    title: 'AES-256 Encrypted Data Backups',
    description: 'Categorized file index and user credentials are cryptographically protected at rest.',
    status: 'Pass',
    complianceCode: 'Art. 32 - Security of Processing'
  },
  {
    id: 'gdpr-4',
    title: 'Role-Based Access Control (RBAC) & Principle of Least Privilege',
    description: 'System actions are restricted according to assigned user roles (Admin, Data Manager, Auditor, Viewer).',
    status: 'Pass',
    complianceCode: 'Art. 32(1)(b) - Access Control'
  },
  {
    id: 'gdpr-5',
    title: 'Immutable User Activity & Audit Trails',
    description: 'Every file scan, category move, backup generation, and user role change is logged with timestamping.',
    status: 'Pass',
    complianceCode: 'Art. 30 - Records of Processing Activities'
  },
  {
    id: 'gdpr-6',
    title: 'Right to Access & Data Portability (DSAR)',
    description: 'Users can download a complete JSON/ZIP export of their activity, preferences, and file catalog.',
    status: 'Pass',
    complianceCode: 'Art. 15 & 20 - Data Subject Access & Portability'
  },
  {
    id: 'gdpr-7',
    title: 'Right to Erasure (Anonymization)',
    description: 'Users can request complete deletion/anonymization of user audit logs and stored profiles.',
    status: 'Pass',
    complianceCode: 'Art. 17 - Right to be Forgotten'
  }
];
