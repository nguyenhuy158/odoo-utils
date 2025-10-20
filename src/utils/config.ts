import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { XmlFormatterOptions } from '../formatters/types';

interface XmlFormatterRcConfig {
    tabSize?: number;
    useTabs?: boolean;
    alignAttributes?: boolean;
    keepCDATA?: boolean;
    emptyElementHandling?: 'selfClosing' | 'expand';
    maxLineLength?: number;
    sortAttributes?: boolean;
    preserveAttributes?: boolean;
    closeTagOnNewLine?: boolean;
    preserveComments?: boolean;
    maximumBlankLines?: number;
}

export class ConfigManager {
    private static readonly EXTENSION_ID = 'odoo-utils';
    private static readonly RC_FILE_NAME = '.xmlformatterrc';
    private static rcConfigCache: Map<string, XmlFormatterRcConfig | null> = new Map();

    /**
     * Find .xmlformatterrc file in workspace folders
     */
    private static findRcFile(): string | null {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            return null;
        }

        // Check each workspace folder for .xmlformatterrc
        for (const folder of workspaceFolders) {
            const rcPath = path.join(folder.uri.fsPath, this.RC_FILE_NAME);
            if (fs.existsSync(rcPath)) {
                return rcPath;
            }
        }

        return null;
    }

    /**
     * Load configuration from .xmlformatterrc file
     */
    private static loadRcConfig(): XmlFormatterRcConfig | null {
        const rcPath = this.findRcFile();
        if (!rcPath) {
            return null;
        }

        // Check cache
        if (this.rcConfigCache.has(rcPath)) {
            return this.rcConfigCache.get(rcPath) || null;
        }

        try {
            const content = fs.readFileSync(rcPath, 'utf-8');
            const config = JSON.parse(content) as XmlFormatterRcConfig;
            this.rcConfigCache.set(rcPath, config);
            return config;
        } catch (error) {
            console.error(`Failed to load ${this.RC_FILE_NAME}:`, error);
            this.rcConfigCache.set(rcPath, null);
            return null;
        }
    }

    /**
     * Clear RC config cache (useful when file changes)
     */
    public static clearRcCache(): void {
        this.rcConfigCache.clear();
    }

    /**
     * Map .xmlformatterrc config to XmlFormatterOptions
     */
    private static mapRcConfigToOptions(rcConfig: XmlFormatterRcConfig): Partial<XmlFormatterOptions> {
        const options: Partial<XmlFormatterOptions> = {};

        if (rcConfig.tabSize !== undefined) {
            options.indentSize = rcConfig.tabSize;
        }
        if (rcConfig.useTabs !== undefined) {
            options.indentType = rcConfig.useTabs ? 'tabs' : 'spaces';
        }
        if (rcConfig.alignAttributes !== undefined) {
            options.formatAttributes = rcConfig.alignAttributes;
        }
        if (rcConfig.emptyElementHandling !== undefined) {
            options.selfClosingTags = rcConfig.emptyElementHandling === 'selfClosing';
        }
        if (rcConfig.maxLineLength !== undefined) {
            options.maxLineLength = rcConfig.maxLineLength;
        }
        if (rcConfig.sortAttributes !== undefined) {
            options.sortAttributes = rcConfig.sortAttributes;
        }
        if (rcConfig.preserveAttributes !== undefined) {
            options.preserveAttributes = rcConfig.preserveAttributes;
        }
        if (rcConfig.closeTagOnNewLine !== undefined) {
            options.closeTagOnNewLine = rcConfig.closeTagOnNewLine;
        }
        if (rcConfig.preserveComments !== undefined) {
            options.preserveComments = rcConfig.preserveComments;
        }
        if (rcConfig.maximumBlankLines !== undefined) {
            options.maximumBlankLines = rcConfig.maximumBlankLines;
        }

        return options;
    }

    /**
     * Get XML formatter options with hierarchy:
     * 1. .xmlformatterrc (highest priority)
     * 2. Workspace settings
     * 3. User settings (lowest priority)
     */
    public static getFormatterOptions(): XmlFormatterOptions {
        // Load from VS Code settings (User + Workspace merged)
        const config = vscode.workspace.getConfiguration(this.EXTENSION_ID);

        const baseOptions: XmlFormatterOptions = {
            indentSize: config.get<number>('indentSize', 2),
            indentType: config.get<'spaces' | 'tabs'>('indentType', 'spaces'),
            maxLineLength: config.get<number>('maxLineLength', 120),
            preserveAttributes: config.get<boolean>('preserveAttributes', true),
            formatAttributes: config.get<boolean>('formatAttributes', false),
            sortAttributes: config.get<boolean>('sortAttributes', false),
            selfClosingTags: config.get<boolean>('selfClosingTags', true),
            closeTagOnNewLine: config.get<boolean>('closeTagOnNewLine', false),
            preserveComments: config.get<boolean>('preserveComments', true),
            maximumBlankLines: config.get<number>('maximumBlankLines', 0)
        };

        // Override with .xmlformatterrc if exists (highest priority)
        const rcConfig = this.loadRcConfig();
        if (rcConfig) {
            const rcOptions = this.mapRcConfigToOptions(rcConfig);
            return { ...baseOptions, ...rcOptions };
        }

        return baseOptions;
    }

    /**
     * Get format on save setting
     */
    public static getFormatOnSave(): boolean {
        const config = vscode.workspace.getConfiguration(this.EXTENSION_ID);
        return config.get<boolean>('formatOnSave', false);
    }

    /**
     * Get Odoo-specific formatting setting
     */
    public static getOdooSpecific(): boolean {
        const config = vscode.workspace.getConfiguration(this.EXTENSION_ID);
        return config.get<boolean>('odooSpecific', true);
    }

    /**
     * Update configuration value
     */
    public static async updateConfig(key: string, value: any, target?: vscode.ConfigurationTarget): Promise<void> {
        const config = vscode.workspace.getConfiguration(this.EXTENSION_ID);
        await config.update(key, value, target || vscode.ConfigurationTarget.Workspace);
    }

    /**
     * Get all configuration as object
     */
    public static getAllConfig(): { [key: string]: any } {
        const config = vscode.workspace.getConfiguration(this.EXTENSION_ID);
        return {
            indentSize: config.get('indentSize'),
            indentType: config.get('indentType'),
            maxLineLength: config.get('maxLineLength'),
            preserveAttributes: config.get('preserveAttributes'),
            formatAttributes: config.get('formatAttributes'),
            sortAttributes: config.get('sortAttributes'),
            selfClosingTags: config.get('selfClosingTags'),
            formatOnSave: config.get('formatOnSave'),
            odooSpecific: config.get('odooSpecific')
        };
    }
}