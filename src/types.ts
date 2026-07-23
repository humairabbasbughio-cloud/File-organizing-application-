export type UserRole = 'admin' | 'data_manager' | 'auditor' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  lastActive: string;
  createdAt: string;
  status: 'active' | 'suspended';
}

export type Permission =
  | 'files:scan'
  | 'files:organize'
  | 'rules:manage'
  | 'backup:create'
  | 'backup:restore'
  | 'users:manage'
  | 'logs:view'
  | 'logs:export'
  | 'gdpr:export'
  | 'gdpr:erase'
  | 'packages:download';

export interface RolePermissions {
  role: UserRole;
  title: string;
  description: string;
  permissions: Permission[];
}

export interface FileCategory {
  id: string;
  name: string; // e.g., 'Images', 'Documents', 'Videos', 'Audio', 'Spreadsheets', 'Archives', 'Executables', 'Code', 'Other'
  folderName: string; // Target folder name, e.g., 'Images'
  iconName: string;
  extensions: string[]; // e.g., ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
  color: string;
  description: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: number; // in bytes
  extension: string;
  category: string; // Category ID or name
  originalPath: string; // e.g. "D:\Data\vacation.jpg" or "D:/Data/vacation.jpg"
  proposedPath: string; // e.g. "D:\Data\Images\vacation.jpg"
  lastModified: string;
  checksum?: string;
  status: 'pending' | 'organized' | 'indexed' | 'skipped';
  isRealLocal?: boolean;
  fileHandle?: any; // DirectoryHandle / FileHandle for real browser FileSystem API
}

export interface OrganizationRule {
  id: string;
  name: string;
  enabled: boolean;
  mode: 'category_folders' | 'date_subfolders' | 'virtual_index_only';
  targetDriveFolder: string; // e.g., "D:\Data"
  categoryMappings: Record<string, string[]>; // categoryId -> extensions list
  createSubfolders: boolean;
  preservePathStructure: boolean;
  nonDestructiveStrict: true; // Guaranteed true
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  action:
    | 'USER_LOGIN'
    | 'USER_LOGOUT'
    | 'FILE_SCAN'
    | 'FILE_ORGANIZE'
    | 'RULE_UPDATE'
    | 'BACKUP_CREATED'
    | 'BACKUP_RESTORED'
    | 'USER_ROLE_CHANGE'
    | 'GDPR_EXPORT'
    | 'GDPR_ERASURE_REQUEST'
    | 'EXECUTABLE_PACKAGE_DOWNLOAD';
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  ipAddress?: string;
}

export interface EncryptedBackupPayload {
  version: string;
  timestamp: string;
  createdBy: string;
  algorithm: 'AES-256-GCM';
  salt: string; // Base64 salt
  iv: string; // Base64 IV
  cipherText: string; // Base64 encrypted JSON string of categories, file catalog, rules
  checksum: string; // SHA-256 hash
}

export interface GdprRequest {
  id: string;
  userEmail: string;
  type: 'export' | 'erasure' | 'rectification';
  requestedAt: string;
  status: 'pending' | 'completed' | 'rejected';
  completedAt?: string;
  details: string;
}

export interface SystemStats {
  totalFilesCount: number;
  totalStorageBytes: number;
  categorizedCount: number;
  categoriesCount: number;
  lastScanTime?: string;
  lastBackupTime?: string;
}
