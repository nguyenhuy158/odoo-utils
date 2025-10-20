export interface XmlFormatterOptions {
    indentSize: number;
    indentType: 'spaces' | 'tabs';
    tabSize?: number;  // Added for backwards compatibility
    maxLineLength: number;
    preserveAttributes: boolean;
    formatAttributes: boolean;
    sortAttributes: boolean;
    selfClosingTags: boolean;
    closeTagOnNewLine: boolean;
    preserveComments: boolean;
    maximumBlankLines: number;
}