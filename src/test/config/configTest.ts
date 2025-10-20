import * as vscode from 'vscode';
import { XmlFormatter } from '../../formatters/xmlFormatter';
import { ConfigManager } from '../../utils/config';

export function testConfiguration() {
    console.log('=== Testing XML Formatter Configuration ===');

    // Test XML content
    const testXml = `<?xml version="1.0" encoding="UTF-8"?>
<odoo><data><record id="test" model="test.model"><field name="name">Test</field><field name="active">true</field></record></data></odoo>`;

    try {
        // Test 1: Default configuration
        console.log('\n1. Default configuration:');
        const defaultOptions = ConfigManager.getFormatterOptions();
        console.log('Default options:', JSON.stringify(defaultOptions, null, 2));

        const formatter1 = new XmlFormatter(defaultOptions);
        const formatted1 = formatter1.formatXml(testXml);
        console.log('Formatted with default options:');
        console.log(formatted1);

        // Test 2: Tabs instead of spaces
        console.log('\n2. Tab indentation:');
        const tabOptions = { ...defaultOptions, indentType: 'tabs' as const, indentSize: 1 };
        const formatter2 = new XmlFormatter(tabOptions);
        const formatted2 = formatter2.formatXml(testXml);
        console.log('Formatted with tabs:');
        console.log(formatted2);

        // Test 3: Different indent size
        console.log('\n3. 4-space indentation:');
        const fourSpaceOptions = { ...defaultOptions, indentSize: 4 };
        const formatter3 = new XmlFormatter(fourSpaceOptions);
        const formatted3 = formatter3.formatXml(testXml);
        console.log('Formatted with 4 spaces:');
        console.log(formatted3);

        // Test 4: Show all configuration
        console.log('\n4. All configuration values:');
        const allConfig = ConfigManager.getAllConfig();
        console.log('All config:', JSON.stringify(allConfig, null, 2));

        console.log('\n=== Configuration tests completed ===');
        return true;

    } catch (error) {
        console.error('Configuration test failed:', error);
        return false;
    }
}

/**
 * Demonstrate how to programmatically update configuration
 */
export async function demonstrateConfigUpdate() {
    console.log('\n=== Demonstrating Configuration Update ===');

    try {
        // Get current value
        const currentIndentSize = vscode.workspace.getConfiguration('odoo-utils').get('indentSize');
        console.log('Current indent size:', currentIndentSize);

        // Update configuration (this is just for demonstration)
        console.log('You can update configuration using:');
        console.log('await ConfigManager.updateConfig("indentSize", 4);');

        // Show how to get updated options
        const options = ConfigManager.getFormatterOptions();
        console.log('Current formatter options:', JSON.stringify(options, null, 2));

        return true;
    } catch (error) {
        console.error('Config update demonstration failed:', error);
        return false;
    }
}

/**
 * Test configuration change logging
 */
export async function testConfigurationChangeLogging() {
    console.log('\n=== Testing Configuration Change Logging ===');

    try {
        // Show current settings
        console.log('Current settings before change:');
        const currentConfig = ConfigManager.getAllConfig();
        console.log(JSON.stringify(currentConfig, null, 2));

        // Simulate configuration change by getting current value and explaining what happens
        console.log('\nTo test configuration change logging:');
        console.log('1. Open VS Code Settings (Ctrl/Cmd + ,)');
        console.log('2. Search for "odoo-utils"');
        console.log('3. Change any setting (e.g., indent size from 2 to 4)');
        console.log('4. Check the "odoo-utils Settings" Output panel');
        console.log('5. You should see a log entry with all current settings');

        // Show what the log message would contain
        console.log('\nExample log message format:');
        console.log('=== odoo-utils Settings Log ===');
        console.log('Trigger: Configuration changed by user');
        console.log('Timestamp: [current time]');
        console.log('Current Configuration: [all 8 settings]');
        console.log('Raw config object: [JSON format]');

        return true;

    } catch (error) {
        console.error('Configuration change logging test failed:', error);
        return false;
    }
}