import JSZip from 'jszip';

export async function generateProjectZipBundle(): Promise<Blob> {
  const zip = new JSZip();

  // Root files
  zip.file(
    'package.json',
    JSON.stringify(
      {
        name: 'drivesort-guard',
        version: '1.0.0',
        private: true,
        type: 'module',
        scripts: {
          dev: 'tsx server.ts',
          build: 'vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs',
          start: 'node dist/server.cjs',
          'run:windows': 'python organize_d_drive.py',
          'run:mac': 'bash organize_mac.sh'
        },
        dependencies: {
          express: '^4.21.2',
          react: '^19.0.1',
          'react-dom': '^19.0.1',
          'lucide-react': '^0.546.0',
          jszip: '^3.10.1',
          motion: '^12.23.24',
          dotenv: '^17.2.3'
        },
        devDependencies: {
          vite: '^6.2.3',
          tsx: '^4.21.0',
          typescript: '~5.8.2',
          '@types/express': '^4.17.21',
          '@types/node': '^22.14.0',
          '@tailwindcss/vite': '^4.1.14',
          tailwindcss: '^4.1.14',
          esbuild: '^0.25.0'
        }
      },
      null,
      2
    )
  );

  // README Deployment guide
  zip.file(
    'README_DEPLOYMENT.md',
    `# DriveSort Guard - Standalone File Organizer & Security Hub
Deployment & Execution Manual for Windows OS, macOS, and Server Environments.

## Features
- Non-destructive file categorization (Zero deletion / modification guarantee).
- Organize files in-place or into category subfolders (Images, Documents, Videos, Audio, Archives, Code, Executables).
- Role-Based Access Control (Admin, Data Manager, Auditor, Viewer).
- Immutable Audit Logging for GDPR compliance (Art. 30 & Art. 32).
- AES-256 Encrypted Data Backup & Restore solution.
- Standalone Windows & macOS local drive scripts + Desktop GUI app.

---

## 1. Quick Start on Windows (D: Drive or any Folder)
Option A - Standalone Python GUI (No web server required):
1. Double click \`organize_d_drive.py\` or run:
   \`\`\`cmd
   python organize_d_drive.py
   \`\`\`
2. Select target folder (e.g. \`D:\\Data\`).
3. Click "Scan Files" then "Organize Files into Subfolders".

Option B - Windows Executable Launcher Batch Script:
1. Double click \`DriveSort_Windows_Launcher.bat\`.
2. It will launch the interactive organizer directly on your C: or D: drive.

Option C - PowerShell Script:
1. Open PowerShell and run:
   \`\`\`powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   .\\DriveSort_Windows_PowerShell.ps1 -TargetFolder "D:\\Data" -DryRun
   \`\`\`

---

## 2. Quick Start on macOS
1. Open Terminal in this directory.
2. Grant execution permission:
   \`\`\`bash
   chmod +x organize_mac.sh DriveSort_Mac_Installer.command
   \`\`\`
3. Double click \`DriveSort_Mac_Installer.command\` or run:
   \`\`\`bash
   ./organize_mac.sh ~/Downloads
   \`\`\`

---

## 3. Web Dashboard Setup (Node.js & Express)
1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
2. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`
3. Access in browser at \`http://localhost:3000\`.

---

## 4. GDPR Data Protection & Compliance
- **Art. 5(1)(f) Integrity**: Non-destructive move rules ensure files are never overwritten or altered.
- **Art. 15 Right of Access**: Export DSAR logs from the GDPR tab.
- **Art. 17 Right to be Forgotten**: Anonymize audit logs upon request.
- **Art. 32 Security**: AES-256 encrypted backups safeguard metadata at rest.
`
  );

  // Standalone Python Tkinter GUI Application
  zip.file(
    'organize_d_drive.py',
    `# DriveSort Guard - Standalone Python Desktop GUI Application
# Non-Destructive File Organizer for Windows & macOS

import os
import shutil
import sys
import datetime
import json
import tkinter as tk
from tkinter import filedialog, messagebox, ttk

# Category mapping
CATEGORY_EXTENSIONS = {
    "Images": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico", ".raw", ".heic"],
    "Documents": [".pdf", ".doc", ".docx", ".txt", ".rtf", ".odt", ".md", ".epub"],
    "Spreadsheets": [".xls", ".xlsx", ".csv", ".ods", ".tsv"],
    "Videos": [".mp4", ".mkv", ".avi", ".mov", ".wmv", ".flv", ".webm"],
    "Audio": [".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a"],
    "Archives": [".zip", ".rar", ".7z", ".tar", ".gz", ".iso"],
    "Code": [".py", ".js", ".ts", ".html", ".css", ".json", ".java", ".cpp", ".c", ".sh", ".ps1"],
    "Executables": [".exe", ".msi", ".dmg", ".app", ".deb", ".apk"]
}

class DriveSortApp:
    def __init__(self, root):
        self.root = root
        self.root.title("DriveSort Guard - Standalone File Organizer")
        self.root.geometry("820x600")
        self.root.configure(bg="#0F172A")
        
        self.target_dir = tk.StringVar(value=os.path.abspath("D:\\Data") if os.path.exists("D:\\Data") else os.path.expanduser("~"))
        
        # Header
        header = tk.Frame(root, bg="#1E293B", padding=15)
        header.pack(fill="x")
        title = tk.Label(header, text="🛡️ DriveSort Guard - Standalone Desktop Organizer", font=("Segoe UI", 16, "bold"), fg="#F8FAFC", bg="#1E293B")
        title.pack(anchor="w")
        sub = tk.Label(header, text="Non-Destructive File Categorization | Zero File Deletion Guarantee", font=("Segoe UI", 10), fg="#94A3B8", bg="#1E293B")
        sub.pack(anchor="w")
        
        # Directory Selector
        dir_frame = tk.Frame(root, bg="#0F172A", pady=15, padx=15)
        dir_frame.pack(fill="x")
        
        lbl = tk.Label(dir_frame, text="Target Drive / Directory Path:", font=("Segoe UI", 11, "bold"), fg="#E2E8F0", bg="#0F172A")
        lbl.pack(anchor="w", pady=(0, 5))
        
        input_box = tk.Frame(dir_frame, bg="#0F172A")
        input_box.pack(fill="x")
        
        entry = tk.Entry(input_box, textvariable=self.target_dir, font=("Consolas", 11), bg="#1E293B", fg="#F8FAFC", insertbackground="white", bd=1, relief="solid")
        entry.pack(side="left", fill="x", expand=True, ipady=6, padx=(0, 10))
        
        btn_browse = tk.Button(input_box, text="Browse Directory", command=self.browse_dir, font=("Segoe UI", 10, "bold"), bg="#3B82F6", fg="white", bd=0, padx=15, pady=6, cursor="hand2")
        btn_browse.pack(side="right")
        
        # Action Buttons
        btn_frame = tk.Frame(root, bg="#0F172A", padx=15, pady=10)
        btn_frame.pack(fill="x")
        
        btn_scan = tk.Button(btn_frame, text="🔍 Scan Directory", command=self.scan_files, font=("Segoe UI", 11, "bold"), bg="#10B981", fg="white", bd=0, padx=20, pady=8, cursor="hand2")
        btn_scan.pack(side="left", padx=(0, 10))
        
        btn_organize = tk.Button(btn_frame, text="⚡ Organize Files Now", command=self.organize_files, font=("Segoe UI", 11, "bold"), bg="#8B5CF6", fg="white", bd=0, padx=20, pady=8, cursor="hand2")
        btn_organize.pack(side="left")
        
        # Output Log Box
        log_frame = tk.Frame(root, bg="#0F172A", padx=15, pady=10)
        log_frame.pack(fill="both", expand=True)
        
        log_lbl = tk.Label(log_frame, text="Activity Log & Audit Records:", font=("Segoe UI", 11, "bold"), fg="#E2E8F0", bg="#0F172A")
        log_lbl.pack(anchor="w", pady=(0, 5))
        
        self.log_text = tk.Text(log_frame, font=("Consolas", 10), bg="#1E293B", fg="#38BDF8", bd=1, relief="solid", wrap="word")
        self.log_text.pack(fill="both", expand=True)
        
        self.log_message("System initialized. Select target folder (e.g. D:\\Data) and click Scan Directory.")

    def log_message(self, msg):
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.log_text.insert(tk.END, f"[{timestamp}] {msg}\\n")
        self.log_text.see(tk.END)

    def browse_dir(self):
        selected = filedialog.askdirectory(initialdir=self.target_dir.get())
        if selected:
            self.target_dir.set(selected)
            self.log_message(f"Selected directory: {selected}")

    def get_category(self, ext):
        ext = ext.lower()
        for cat, ext_list in CATEGORY_EXTENSIONS.items():
            if ext in ext_list:
                return cat
        return "Misc"

    def scan_files(self):
        folder = self.target_dir.get()
        if not os.path.exists(folder):
            messagebox.showerror("Error", f"Directory does not exist: {folder}")
            return
        
        self.log_message(f"Scanning directory: {folder} ...")
        count = 0
        cat_counts = {}
        for root_dir, dirs, files in os.walk(folder):
            # Skip category subfolders if already organized
            dirs[:] = [d for d in dirs if d not in CATEGORY_EXTENSIONS and d != "Misc"]
            for f in files:
                ext = os.path.splitext(f)[1]
                cat = self.get_category(ext)
                cat_counts[cat] = cat_counts.get(cat, 0) + 1
                count += 1
                
        self.log_message(f"Scan Complete! Found {count} total files.")
        for cat, num in cat_counts.items():
            self.log_message(f"  • {cat}: {num} file(s)")

    def organize_files(self):
        folder = self.target_dir.get()
        if not os.path.exists(folder):
            messagebox.showerror("Error", f"Directory does not exist: {folder}")
            return
            
        confirm = messagebox.askyesno("Confirm Organization", f"Organize files in '{folder}' into category folders?\\nNote: Files will be safely moved into subfolders without altering content.")
        if not confirm:
            return

        moved_count = 0
        skipped_count = 0
        
        try:
            items = os.listdir(folder)
            for item in items:
                item_path = os.path.join(folder, item)
                if os.path.isfile(item_path):
                    ext = os.path.splitext(item)[1]
                    cat = self.get_category(ext)
                    target_folder = os.path.join(folder, cat)
                    
                    if not os.path.exists(target_folder):
                        os.makedirs(target_folder, exist_ok=True)
                        self.log_message(f"Created category directory: {target_folder}")
                        
                    target_path = os.path.join(target_folder, item)
                    if not os.path.exists(target_path):
                        shutil.move(item_path, target_path)
                        self.log_message(f"Moved: {item} ➔ {cat}\\{item}")
                        moved_count += 1
                    else:
                        skipped_count += 1
                        
            self.log_message(f"SUCCESS: Successfully organized {moved_count} file(s). Skipped {skipped_count} existing files.")
            messagebox.showinfo("Complete", f"Successfully organized {moved_count} file(s) into category subfolders!")
        except Exception as e:
            self.log_message(f"ERROR: {str(e)}")
            messagebox.showerror("Error", str(e))

if __name__ == "__main__":
    root = tk.Tk()
    app = DriveSortApp(root)
    root.mainloop()
`
  );

  // Windows Executable Batch Launcher
  zip.file(
    'DriveSort_Windows_Launcher.bat',
    `@echo off
title DriveSort Guard - Windows File Organizer Launcher
echo ========================================================
echo   DriveSort Guard - Windows Standalone Organizer Launcher
echo ========================================================
echo.
echo Checking Python environment...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH.
    echo Opening Web-based local server alternative...
    npm run dev
    pause
    exit /b
)

echo Launching DriveSort Guard Desktop Application...
python organize_d_drive.py
pause
`
  );

  // PowerShell Script
  zip.file(
    'DriveSort_Windows_PowerShell.ps1',
    `# DriveSort Guard - Non-Destructive PowerShell Organizer
param (
    [string]$TargetFolder = "D:\\Data",
    [switch]$DryRun = $false
)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  DriveSort Guard - PowerShell Organizer" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Target Directory: $TargetFolder" -ForegroundColor Yellow

if (-not (Test-Path -Path $TargetFolder)) {
    Write-Host "Error: Target directory '$TargetFolder' does not exist." -ForegroundColor Red
    exit
}

$CategoryMap = @{
    "Images"       = @(".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp")
    "Documents"    = @(".pdf", ".doc", ".docx", ".txt", ".rtf", ".md")
    "Spreadsheets" = @(".xls", ".xlsx", ".csv", ".ods")
    "Videos"       = @(".mp4", ".mkv", ".avi", ".mov", ".wmv")
    "Audio"        = @(".mp3", ".wav", ".flac", ".aac")
    "Archives"     = @(".zip", ".rar", ".7z", ".tar", ".gz")
    "Code"         = @(".py", ".js", ".ts", ".html", ".css", ".json", ".ps1")
    "Executables"  = @(".exe", ".msi", ".dmg")
}

function Get-Category($ext) {
    foreach ($cat in $CategoryMap.Keys) {
        if ($CategoryMap[$cat] -contains $ext.ToLower()) {
            return $cat
        }
    }
    return "Misc"
}

$files = Get-ChildItem -Path $TargetFolder -File

Write-Host "Found $($files.Count) file(s) to process." -ForegroundColor Green

foreach ($file in $files) {
    $cat = Get-Category $file.Extension
    $destDir = Join-Path -Path $TargetFolder -ChildPath $cat
    $destPath = Join-Path -Path $destDir -ChildPath $file.Name

    if ($DryRun) {
        Write-Host "[DRY RUN] Would move '$($file.Name)' -> '$cat\\$($file.Name)'" -ForegroundColor Gray
    } else {
        if (-not (Test-Path -Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir | Out-Null
            Write-Host "Created Category Folder: $cat" -ForegroundColor DarkCyan
        }
        if (-not (Test-Path -Path $destPath)) {
            Move-Item -Path $file.FullName -Destination $destPath
            Write-Host "Moved: $($file.Name) -> $cat\\$($file.Name)" -ForegroundColor Green
        } else {
            Write-Host "Skipped (Exists): $($file.Name)" -ForegroundColor Yellow
        }
    }
}

Write-Host "Organization complete! Zero files modified or deleted." -ForegroundColor Cyan
`
  );

  // macOS Command Script
  zip.file(
    'organize_mac.sh',
    `#!/usr/bin/env bash
# DriveSort Guard - macOS Shell File Organizer
TARGET_DIR="\${1:-\$HOME/Downloads}"

echo "=========================================="
echo "  DriveSort Guard - macOS File Organizer  "
echo "=========================================="
echo "Target Directory: \$TARGET_DIR"

if [ ! -d "\$TARGET_DIR" ]; then
  echo "Error: Directory \$TARGET_DIR does not exist."
  exit 1
fi

python3 -c "
import os, shutil

target = os.path.expanduser('$TARGET_DIR')
ext_map = {
    'Images': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    'Documents': ['.pdf', '.docx', '.doc', '.txt', '.pages', '.md'],
    'Spreadsheets': ['.xlsx', '.csv', '.numbers'],
    'Videos': ['.mp4', '.mkv', '.mov'],
    'Audio': ['.mp3', '.m4a', '.wav'],
    'Archives': ['.zip', '.rar', '.7z', '.tar', '.gz'],
    'Code': ['.py', '.js', '.ts', '.sh', '.html', '.css', '.json'],
    'Executables': ['.dmg', '.app', '.pkg']
}

def get_cat(ext):
    ext = ext.lower()
    for cat, exts in ext_map.items():
        if ext in exts:
            return cat
    return 'Misc'

moved = 0
for f in os.listdir(target):
    full_path = os.path.join(target, f)
    if os.path.isfile(full_path) and not f.startswith('.'):
        ext = os.path.splitext(f)[1]
        cat = get_cat(ext)
        cat_dir = os.path.join(target, cat)
        os.makedirs(cat_dir, exist_ok=True)
        dest = os.path.join(cat_dir, f)
        if not os.path.exists(dest):
            shutil.move(full_path, dest)
            print(f'Moved: {f} -> {cat}/{f}')
            moved += 1

print(f'Successfully organized {moved} file(s) into category subfolders.')
"
`
  );

  // macOS Launcher Command
  zip.file(
    'DriveSort_Mac_Installer.command',
    `#!/bin/bash
DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"
chmod +x organize_mac.sh
echo "DriveSort Guard macOS Launcher"
python3 organize_d_drive.py || bash organize_mac.sh "$HOME/Downloads"
read -p "Press enter to exit..."
`
  );

  // Return generated Zip Blob
  return await zip.generateAsync({ type: 'blob' });
}
