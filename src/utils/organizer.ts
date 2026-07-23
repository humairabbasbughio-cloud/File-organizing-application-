import { FileCategory, FileItem, OrganizationRule } from '../types';

/**
 * Normalizes file extension (e.g., "png" -> ".png")
 */
export function normalizeExtension(ext: string): string {
  if (!ext) return '';
  let cleaned = ext.trim().toLowerCase();
  if (!cleaned.startsWith('.')) {
    cleaned = '.' + cleaned;
  }
  return cleaned;
}

/**
 * Format byte size into readable string (KB, MB, GB)
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Determines file category based on extension and category list
 */
export function detectCategoryForExtension(
  extension: string,
  categories: FileCategory[]
): string {
  const normExt = normalizeExtension(extension);
  for (const cat of categories) {
    if (cat.id === 'other') continue;
    if (cat.extensions.includes(normExt)) {
      return cat.id;
    }
  }
  return 'other';
}

/**
 * Calculates non-destructive proposed path for a file
 */
export function calculateProposedPath(
  file: FileItem,
  rule: OrganizationRule,
  categories: FileCategory[]
): string {
  const categoryId = detectCategoryForExtension(file.extension, categories);
  const categoryObj = categories.find(c => c.id === categoryId) || categories.find(c => c.id === 'other');
  const categoryFolder = categoryObj ? categoryObj.folderName : 'Misc';

  const baseFolder = rule.targetDriveFolder.replace(/[/\\]+$/, ''); // Strip trailing slash

  if (rule.mode === 'virtual_index_only') {
    return file.originalPath; // Unchanged path
  }

  // Windows style backslash vs Posix style forward slash check
  const separator = baseFolder.includes('\\') ? '\\' : '/';

  return `${baseFolder}${separator}${categoryFolder}${separator}${file.name}`;
}

/**
 * Calculates organization preview statistics
 */
export function calculateOrganizationStats(files: FileItem[]) {
  const totalFiles = files.length;
  const totalBytes = files.reduce((acc, f) => acc + f.size, 0);
  const categorizedCount = files.filter(f => f.category !== 'other').length;
  const pendingCount = files.filter(f => f.status === 'pending').length;
  const organizedCount = files.filter(f => f.status === 'organized' || f.status === 'indexed').length;

  const categoryBreakdown: Record<string, { count: number; bytes: number }> = {};

  files.forEach(file => {
    if (!categoryBreakdown[file.category]) {
      categoryBreakdown[file.category] = { count: 0, bytes: 0 };
    }
    categoryBreakdown[file.category].count += 1;
    categoryBreakdown[file.category].bytes += file.size;
  });

  return {
    totalFiles,
    totalBytes,
    categorizedCount,
    pendingCount,
    organizedCount,
    categoryBreakdown
  };
}
