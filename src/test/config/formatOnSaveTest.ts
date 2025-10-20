import * as vscode from 'vscode';

/**
 * Test format on save functionality
 */
export function testFormatOnSave() {
    console.log('=== Testing Format On Save ===');

    try {
        // Show current format on save setting
        const config = vscode.workspace.getConfiguration('odoo-utils');
        const formatOnSave = config.get<boolean>('formatOnSave', false);

        console.log(`Current formatOnSave setting: ${formatOnSave}`);

        if (!formatOnSave) {
            console.log('⚠️  Format on save is disabled. To test:');
            console.log('1. Open VS Code Settings (Ctrl+,)');
            console.log('2. Search "odoo-utils"');
            console.log('3. Enable "Format On Save"');
            console.log('4. Or add to settings.json: "odoo-utils.formatOnSave": true');
        } else {
            console.log('✅ Format on save is enabled!');
        }

        console.log('\nTo test format on save:');
        console.log('1. Create/open an XML file');
        console.log('2. Add unformatted XML content:');
        console.log('   <root><child>content</child></root>');
        console.log('3. Save the file (Ctrl+S)');
        console.log('4. XML should be automatically formatted');

        console.log('\nExpected behavior:');
        console.log('- Before save: <root><child>content</child></root>');
        console.log('- After save:');
        console.log('  <root>');
        console.log('    <child>content</child>');
        console.log('  </root>');

        // Show XML language association
        console.log('\nXML file detection:');
        console.log('- Files with .xml extension');
        console.log('- Files with languageId = "xml"');
        console.log('- Common Odoo XML files: views, data, security, etc.');

        return true;

    } catch (error) {
        console.error('Format on save test failed:', error);
        return false;
    }
}

/**
 * Demonstrate format on save settings
 */
export function demonstrateFormatOnSaveSettings() {
    console.log('\n=== Format On Save Settings Guide ===');

    console.log('To enable format on save, add to VS Code settings:');
    console.log('');
    console.log('Option 1 - Extension-specific (recommended):');
    console.log('{');
    console.log('  "odoo-utils.formatOnSave": true');
    console.log('}');
    console.log('');
    console.log('Option 2 - Per language:');
    console.log('{');
    console.log('  "[xml]": {');
    console.log('    "editor.formatOnSave": true,');
    console.log('    "editor.defaultFormatter": "nguyenhuy158.odoo-utils"');
    console.log('  }');
    console.log('}');
    console.log('');
    console.log('Option 3 - Combined (best):');
    console.log('{');
    console.log('  "odoo-utils.formatOnSave": true,');
    console.log('  "[xml]": {');
    console.log('    "editor.formatOnSave": true,');
    console.log('    "editor.defaultFormatter": "nguyenhuy158.odoo-utils"');
    console.log('  }');
    console.log('}');
}