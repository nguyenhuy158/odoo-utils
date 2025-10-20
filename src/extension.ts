import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { DuplicateFunctionAnalyzer } from "./duplicateChecker";

let outputChannel: vscode.OutputChannel;

/**
 * Get or create output channel
 */
function getOutputChannel(): vscode.OutputChannel {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel("Odoo Utils");
    }
    return outputChannel;
}

/**
 * Get all subdirectories from a directory (non-recursive, only direct children)
 */
async function getSubdirectories(dirPath: string): Promise<string[]> {
    const subdirs: string[] = [];
    
    try {
        const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
            if (entry.isDirectory()) {
                // Skip common directories to ignore
                if (entry.name === 'node_modules' || entry.name === '.git' ||
                    entry.name === '__pycache__' || entry.name === '.venv' ||
                    entry.name === 'venv' || entry.name.startsWith('.')) {
                    continue;
                }
                subdirs.push(path.join(dirPath, entry.name));
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
    }
    
    return subdirs;
}

/**
 * Get all Python files recursively from a directory
 */
async function getAllPythonFiles(dirPath: string): Promise<string[]> {
    const pythonFiles: string[] = [];
    
    async function scanDirectory(dir: string): Promise<void> {
        try {
            const entries = await fs.promises.readdir(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                
                if (entry.isDirectory()) {
                    // Skip common directories to ignore
                    if (entry.name === 'node_modules' || entry.name === '.git' ||
                        entry.name === '__pycache__' || entry.name === '.venv' ||
                        entry.name === 'venv') {
                        continue;
                    }
                    await scanDirectory(fullPath);
                } else if (entry.isFile() && entry.name.endsWith('.py')) {
                    pythonFiles.push(fullPath);
                }
            }
        } catch (error) {
            // Skip directories we don't have permission to read
            console.error(`Error reading directory ${dir}:`, error);
        }
    }
    
    await scanDirectory(dirPath);
    return pythonFiles;
}

/**
 * Check for duplicate functions in all Python files in selected folder
 */
async function checkDuplicatesCommand(): Promise<void> {
    const output = getOutputChannel();
    output.clear();
    output.show();
    output.appendLine(`[${new Date().toLocaleTimeString()}] Starting duplicate check...`);

    // Determine the base directory
    let baseDir: string;
    let baseDirLabel: string;
    
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
        // If there's a workspace, use it as base
        baseDir = vscode.workspace.workspaceFolders[0].uri.fsPath;
        baseDirLabel = path.basename(baseDir);
    } else {
        // If no workspace, use $HOME
        const homeDir = process.env.HOME || process.env.USERPROFILE;
        if (!homeDir) {
            vscode.window.showErrorMessage('Cannot determine home directory');
            return;
        }
        baseDir = homeDir;
        baseDirLabel = '~ (Home)';
    }

    // Get subdirectories
    const subdirs = await getSubdirectories(baseDir);
    
    // Create quick pick items
    interface FolderPickItem extends vscode.QuickPickItem {
        folderPath: string;
    }
    
    const items: FolderPickItem[] = [
        {
            label: `📁 ${baseDirLabel}`,
            description: baseDir,
            detail: 'Check this folder',
            folderPath: baseDir
        }
    ];
    
    // Add subdirectories
    for (const subdir of subdirs) {
        items.push({
            label: `📂 ${path.basename(subdir)}`,
            description: path.relative(baseDir, subdir),
            detail: 'Check this subfolder',
            folderPath: subdir
        });
    }

    // Show quick pick
    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select a folder to check for duplicate Python functions',
        matchOnDescription: true,
        matchOnDetail: false
    });

    if (!selected) {
        output.appendLine('❌ No folder selected. Operation cancelled.');
        vscode.window.showInformationMessage('Folder selection cancelled.');
        return;
    }

    const selectedFolder = selected.folderPath;
    output.appendLine(`📁 Selected folder: ${selectedFolder}`);
    output.appendLine('🔍 Scanning for Python files...');

    // Get all Python files
    const pythonFiles = await getAllPythonFiles(selectedFolder);
    
    if (pythonFiles.length === 0) {
        output.appendLine('⚠️ No Python files found in the selected folder.');
        vscode.window.showInformationMessage('No Python files found in the selected folder.');
        return;
    }

    output.appendLine(`📄 Found ${pythonFiles.length} Python file(s)`);
    output.appendLine('');

    const analyzer = new DuplicateFunctionAnalyzer();
    let totalFiles = 0;
    let filesWithDuplicates = 0;
    const filesWithDuplicatesList: { file: string; duplicates: any[] }[] = [];

    // Process each file
    for (const filePath of pythonFiles) {
        totalFiles++;
        
        try {
            const content = await fs.promises.readFile(filePath, 'utf-8');
            const functions = analyzer.findFunctions(content);
            const duplicates = analyzer.findDuplicates(functions);

            if (duplicates.length > 0) {
                filesWithDuplicates++;
                filesWithDuplicatesList.push({
                    file: filePath,
                    duplicates: duplicates
                });
            }
        } catch (error) {
            output.appendLine(`❌ Error reading file ${filePath}: ${error}`);
        }
    }

    // Summary
    output.appendLine('');
    output.appendLine('='.repeat(80));
    output.appendLine('📊 SUMMARY');
    output.appendLine('='.repeat(80));
    output.appendLine(`Total Python files scanned: ${totalFiles}`);
    output.appendLine(`Files with duplicates: ${filesWithDuplicates}`);
    output.appendLine('');

    if (filesWithDuplicates > 0) {
        output.appendLine('📋 FILES WITH DUPLICATE FUNCTIONS:');
        output.appendLine('');

        for (const item of filesWithDuplicatesList) {
            const relativePath = path.relative(selectedFolder, item.file);
            output.appendLine(`📄 ${relativePath}`);
            
            for (const duplicate of item.duplicates) {
                output.appendLine(`   ⚠️ Function '${duplicate.name}' appears ${duplicate.occurrences.length} times:`);
                for (let i = 0; i < duplicate.occurrences.length; i++) {
                    const occurrence = duplicate.occurrences[i];
                    output.appendLine(`      ${i + 1}. Line ${occurrence.startLine + 1}-${occurrence.endLine + 1}`);
                }
            }
            output.appendLine('');
        }

        vscode.window.showWarningMessage(
            `Found duplicates in ${filesWithDuplicates} file(s) out of ${totalFiles}. Check Output panel for details.`,
            'Show Output'
        ).then(selection => {
            if (selection === 'Show Output') {
                output.show();
            }
        });
    } else {
        output.appendLine('✅ No duplicate functions found in any files!');
        vscode.window.showInformationMessage(`Scanned ${totalFiles} files. No duplicates found!`);
    }

    output.appendLine('='.repeat(80));
    output.appendLine(`[${new Date().toLocaleTimeString()}] Check completed.`);
}

/**
 * This method is called when your extension is activated
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Odoo Utils extension is now active!');

    // Register command
    const checkDuplicatesCmd = vscode.commands.registerCommand(
        'odoo-utils.checkDuplicates',
        checkDuplicatesCommand
    );

    context.subscriptions.push(checkDuplicatesCmd);

    getOutputChannel().appendLine(`[${new Date().toLocaleTimeString()}] Odoo Utils activated`);
}

/**
 * This method is called when your extension is deactivated
 */
export function deactivate() {
    if (outputChannel) {
        outputChannel.dispose();
    }
}