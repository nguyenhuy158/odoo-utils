# Change Log

All notable changes to the "odoo-utils" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

### Added
- **Smart Validation**: Comprehensive XML validation before formatting
  - Validates XML syntax using XMLValidator from fast-xml-parser
  - Shows detailed error messages with line number and column
  - Displays problematic line content (truncated to 20 chars)
  - User-friendly warning popups in Vietnamese
  - Prevents formatting when XML is invalid
  - Checks if file content is actually XML before processing
- **Highlight Error Range**: Visual error highlighting in editor
  - **Red background highlight** on error lines
  - **Red left border** for easy identification
  - **Auto-scroll** to error location
  - **Overview ruler marker** for quick navigation
  - **Auto-clear** after configurable duration (default: 5s)
  - **Smart clearing**: Auto-clears when editing or switching files
  - New setting: `odoo-utils.highlightErrorDuration` (1000-30000ms)
- Unit tests for Smart Validation feature
- Documentation: SMART-VALIDATION.md
- Test files: test-smart-validation.js, test-validation-demo.xml

### Changed
- Updated formatXmlDocument() to validate XML and highlight errors
- Updated formatDocument command to show detailed validation errors with highlighting
- Enhanced validateXml() to return detailed error information (line, column, content)
- Added document change and editor change listeners to auto-clear highlights

## [0.0.8] - 2025-10-17

### Added
- **Odoo Tag Spacing**: New feature to automatically add blank lines between important Odoo tags
  - Added `odooTagSpacing` setting (default: `true`) to enable/disable the feature
  - Added `odooSpacingTags` setting with default tags: `['record', 'menuitem', 'template', 'function', 'delete', 'report']`
  - Tags in the spacing list will have at least one blank line after them
  - Improves readability for large Odoo XML files
  - Fully customizable - add or remove tags from the list based on your workflow
- Comprehensive test suite for Odoo tag spacing functionality
- Documentation and examples in README

### Changed
- Updated default formatting behavior for Odoo XML files to include tag spacing

## [0.0.7] - 2025-10-16

### Added
- **Comment Preservation**: New `preserveComments` option to control XML comment handling (default: `true`)
  - When `true`: Comments are preserved and properly formatted
  - When `false`: Comments are automatically removed during formatting

### Fixed
- **Quote Entity Handling**: Fixed issue where single quotes (`'`) in XPath expressions and Odoo domains were being converted to `&apos;` entities
- **Smart Quote Selection**: Attributes containing double quotes now automatically use single-quote wrapping for better readability
- Text content entities (`&apos;` and `&quot;`) are now properly decoded for cleaner output

### Examples
Before fix:
```xml
<xpath expr="//field[@name=&apos;partner_id&apos;]" position="before"/>
<field name="domain">[(&apos;name&apos;, &apos;=&apos;, &apos;test&apos;)]</field>
```

After fix:
```xml
<xpath expr="//field[@name='partner_id']" position="before"/>
<field name="domain">[('name', '=', 'test')]</field>
```

## [0.0.4] - 2025-10-17

### Added
- **Attribute Sorting**: New `sortAttributes` option to sort attributes alphabetically
- **Smart Attribute Formatting**: Attributes are only broken into separate lines when line exceeds `maxLineLength`
- **Enhanced Logging**: Detailed output channel logging for debugging format on save issues
- **Test Commands**: New command `odoo-utils: Test Format On Save` for debugging
- **Auto-activation**: Extension now activates automatically when opening XML files

### Fixed
- Fixed format on save not working issue
- Improved attribute parsing for complex attribute values
- Better handling of nested quotes in attributes

### Changed
- Updated activation events to include `onLanguage:xml`
- Improved error messages and user feedback

## [0.0.3] - 2025-10-16

### Added
- Format on save functionality
- Configuration change logging
- Debug output commands

## [0.0.2] - 2025-10-15

### Added
- Configuration management system
- Multiple formatting options

## [0.0.1] - 2025-10-14

### Added
- Initial release
- Basic XML formatting support
- Odoo-specific formatting rules