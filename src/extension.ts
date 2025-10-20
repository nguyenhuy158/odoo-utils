import * as vscode from "vscode";
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
 * Check for duplicate functions in current document
 */
async function checkDuplicatesCommand(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage('No active Python file to check');
        return;
    }

    const document = editor.document;
    if (document.languageId !== 'python') {
        vscode.window.showWarningMessage('Please open a Python file to check for duplicates');
        return;
    }

    const analyzer = new DuplicateFunctionAnalyzer();
    const content = document.getText();
    const functions = analyzer.findFunctions(content);
    const duplicates = analyzer.findDuplicates(functions);

    const output = getOutputChannel();
    output.clear();
    output.appendLine(`[${new Date().toLocaleTimeString()}] Checking duplicates in: ${document.fileName}`);

    if (duplicates.length === 0) {
        output.appendLine('✅ No duplicate functions found!');
        vscode.window.showInformationMessage('No duplicate functions found!');
    } else {
        output.appendLine(`⚠️ Found ${duplicates.length} duplicate function(s):`);

        for (const duplicate of duplicates) {
            output.appendLine(`\n📍 Function '${duplicate.name}' appears ${duplicate.occurrences.length} times:`);
            for (let i = 0; i < duplicate.occurrences.length; i++) {
                const occurrence = duplicate.occurrences[i];
                output.appendLine(`   ${i + 1}. Line ${occurrence.startLine + 1}-${occurrence.endLine + 1}`);
            }
        }

        vscode.window.showWarningMessage(
            `Found ${duplicates.length} duplicate function(s). Check Output panel for details.`,
            'Show Output'
        ).then(selection => {
            if (selection === 'Show Output') {
                output.show();
            }
        });
    }
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