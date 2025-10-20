import { XmlFormatterOptions } from '../formatters/types';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Load configuration from .xmlformatterrc file with strict validation
 * Throws error if file missing or any required option is missing/invalid
 */
function loadConfigFromFile(): Partial<XmlFormatterOptions> {
    const configPath = path.join(__dirname, '../../.xmlformatterrc');

    if (!fs.existsSync(configPath)) {
        throw new Error(`Required config file not found: ${configPath}`);
    }

    let rcConfig: any;
    try {
        const configContent = fs.readFileSync(configPath, 'utf8');
        rcConfig = JSON.parse(configContent);
    } catch (error) {
        throw new Error(`Failed to parse .xmlformatterrc: ${error}`);
    }

    // Required options validation
    const requiredOptions = [
        'tabSize', 'useTabs', 'maxLineLength', 'preserveAttributes',
        'formatAttributes', 'sortAttributes', 'selfClosingTags',
        'closeTagOnNewLine', 'preserveComments', 'maximumBlankLines'
    ];

    for (const option of requiredOptions) {
        if (rcConfig[option] === undefined || rcConfig[option] === null) {
            throw new Error(`Missing required option in .xmlformatterrc: ${option}`);
        }
    }

    // Type validation
    if (typeof rcConfig.tabSize !== 'number' || rcConfig.tabSize < 1) {
        throw new Error(`Invalid tabSize in .xmlformatterrc: must be positive number`);
    }
    if (typeof rcConfig.useTabs !== 'boolean') {
        throw new Error(`Invalid useTabs in .xmlformatterrc: must be boolean`);
    }

    // Map to XmlFormatterOptions with strict types
    return {
        indentSize: rcConfig.tabSize,
        indentType: rcConfig.useTabs ? 'tabs' : 'spaces',
        maxLineLength: rcConfig.maxLineLength,
        preserveAttributes: rcConfig.preserveAttributes,
        formatAttributes: rcConfig.formatAttributes,
        sortAttributes: rcConfig.sortAttributes,
        selfClosingTags: rcConfig.selfClosingTags,
        closeTagOnNewLine: rcConfig.closeTagOnNewLine,
        preserveComments: rcConfig.preserveComments,
        maximumBlankLines: rcConfig.maximumBlankLines
    };
}

/**
 * Global test configuration loaded from .xmlformatterrc file
 */
export const DEFAULT_TEST_CONFIG = loadConfigFromFile();

/**
 * Helper function to merge custom config with default test config
 * @param customConfig Custom configuration to override defaults
 * @returns Merged configuration
 */
export function getTestConfig(customConfig?: Partial<XmlFormatterOptions>): Partial<XmlFormatterOptions> {
    return {
        ...DEFAULT_TEST_CONFIG,
        ...customConfig
    };
}
