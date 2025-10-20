# odoo-utils

A VS Code extension for formatting XML files, specifically designed for Odoo development workflows.

## Features

- **Smart XML Formatting**: Automatically format XML with proper indentation and structure
- **Smart Validation**: Validate XML before formatting with detailed error messages
  - Shows line number and content where error occurs
  - **Highlights error line** with red background in editor
  - **Auto-scrolls** to error location
  - Prevents formatting invalid XML files
  - User-friendly error popups with Vietnamese support
  - Customizable highlight duration
- **Format on Save**: Optionally format XML files automatically when saving
- **Flexible Configuration Hierarchy**: Support for `.xmlformatterrc` file, workspace settings, and user settings
- **Attribute Management**:
  - Break long lines with many attributes into separate lines
  - Sort attributes alphabetically for consistent code style
  - Preserve or reorganize attribute order based on your preferences
- **Intelligent Quote Handling**: Preserves single and double quotes in XPath expressions and Odoo domains without converting to HTML entities
- **Odoo-Specific Formatting**: Special formatting rules for Odoo XML files
- **Customizable Settings**: Flexible configuration options for indentation, line length, and more

## Configuration Hierarchy

The extension supports a three-level configuration hierarchy (from highest to lowest priority):

1. **`.xmlformatterrc`** (highest priority) - Project-specific configuration file
2. **Workspace Settings** - VS Code workspace settings
3. **User Settings** (lowest priority) - Global VS Code user settings

### .xmlformatterrc File

Create a `.xmlformatterrc` file in your workspace root to override VS Code settings:

```json
{
  "tabSize": 2,
  "useTabs": false,
  "alignAttributes": true,
  "keepCDATA": true,
  "emptyElementHandling": "selfClosing",
  "maxLineLength": 120,
  "sortAttributes": true,
  "closeTagOnNewLine": false,
  "preserveComments": true,
  "odooTagSpacing": true,
  "odooSpacingTags": ["record", "menuitem", "template"]
}
```

**Available .xmlformatterrc Options:**
- `tabSize` (number): Indentation size → maps to `indentSize`
- `useTabs` (boolean): Use tabs instead of spaces → maps to `indentType`
- `alignAttributes` (boolean): Format attributes on separate lines → maps to `formatAttributes`
- `emptyElementHandling` ("selfClosing" | "expand"): Self-closing tag behavior → maps to `selfClosingTags`
- `maxLineLength` (number): Maximum line length
- `sortAttributes` (boolean): Sort attributes alphabetically
- `closeTagOnNewLine` (boolean): Put closing tag on new line
- `preserveComments` (boolean): Preserve XML comments
- `odooTagSpacing` (boolean): Add blank lines between Odoo tags
- `odooSpacingTags` (string[]): List of tags to add spacing for

The `.xmlformatterrc` file is automatically watched for changes. When you modify it, the configuration will be reloaded immediately.

## Extension Settings

This extension contributes the following settings:

### Indentation Settings
* `odoo-utils.indentSize`: Number of spaces or tabs for indentation (default: `2`, range: 1-8)
* `odoo-utils.indentType`: Type of indentation to use - `spaces` or `tabs` (default: `spaces`)

### Line Length & Attributes
* `odoo-utils.maxLineLength`: Maximum line length before wrapping (default: `120`, range: 80-200)
* `odoo-utils.formatAttributes`: Format attributes on separate lines when line exceeds maxLineLength (default: `false`)
  - When enabled, tags with total line length > maxLineLength will have attributes on separate lines
  - Each attribute gets its own line with proper indentation
* `odoo-utils.closeTagOnNewLine`: Put closing tag `/>` on a new line for multi-line formatted tags (default: `false`)
  - Only affects tags formatted on multiple lines (when formatAttributes is true and line exceeds maxLineLength)
  - When `false`: `/>` stays on same line as last attribute
  - When `true`: `/>` goes on new line with same indentation as opening `<`
* `odoo-utils.sortAttributes`: Sort attributes alphabetically by name (default: `false`)
* `odoo-utils.preserveAttributes`: Preserve attribute order and formatting (default: `true`)

### General Settings
* `odoo-utils.selfClosingTags`: Use self-closing tags for empty elements (default: `true`)
* `odoo-utils.formatOnSave`: Automatically format XML files when saving (default: `false`)
* `odoo-utils.odooSpecific`: Enable Odoo-specific XML formatting rules (default: `true`)
* `odoo-utils.preserveComments`: Preserve XML comments during formatting (default: `true`)
  - When `true`: Comments are kept and properly formatted
  - When `false`: Comments are removed during formatting

### Odoo Tag Spacing (New!)
* `odoo-utils.odooTagSpacing`: Add blank lines between important Odoo tags (default: `true`)
* `odoo-utils.odooSpacingTags`: List of Odoo XML tags that should have blank lines between them (default: `['record', 'menuitem', 'template', 'function', 'delete', 'report']`)
  - When enabled, tags in this list will automatically have at least one blank line after them
  - Improves readability for large Odoo XML files
  - Customize the list to include only the tags important to your workflow

### Smart Validation Settings
* `odoo-utils.highlightErrorDuration`: Duration in milliseconds to highlight error lines (default: `5000`, range: 1000-30000)
  - Controls how long error lines are highlighted with red background
  - Auto-clears when editing document or switching files
  - Set higher value for more time to read the error

## Usage

### Commands

Access these commands via Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`):

- `odoo-utils: Format Document` - Format the current XML document
- `odoo-utils: Test Formatter` - Run formatter tests
- `odoo-utils: Show Configuration` - Display current configuration
- `odoo-utils: Debug Output Channel` - Open debug output panel
- `odoo-utils: Test Format On Save` - Test format on save functionality

### Example: Closing Tag Position for Long Lines

When a line with multiple attributes exceeds `maxLineLength`, the formatter automatically breaks it into multiple lines. The `closeTagOnNewLine` setting controls where the closing `/>` is placed:

**Original (long line):**
```xml
<field name="mobile" widget="phone" options="{'enable_sms': true, 'country_code': 'VN'}" placeholder="Enter mobile number" required="True"/>
```

**With `closeTagOnNewLine: false` (default):**
```xml
<field
    name="mobile"
    widget="phone"
    options="{'enable_sms': true, 'country_code': 'VN'}"
    placeholder="Enter mobile number"
    required="True"/>
```

**With `closeTagOnNewLine: true`:**
```xml
<field
    name="mobile"
    widget="phone"
    options="{'enable_sms': true, 'country_code': 'VN'}"
    placeholder="Enter mobile number"
    required="True"
/>
```

**This also works for opening tags (not self-closing):**

```xml
<!-- With closeTagOnNewLine: false -->
<xpath
    expr="//button[@name='action_view_delivery']"
    position="attributes"
    mode="extension">
    <attribute name="invisible">1</attribute>
</xpath>

<!-- With closeTagOnNewLine: true -->
<xpath
    expr="//button[@name='action_view_delivery']"
    position="attributes"
    mode="extension"
>
    <attribute name="invisible">1</attribute>
</xpath>
```

**Note:** This setting only affects tags that are formatted on multiple lines due to exceeding `maxLineLength`. Short single-line tags are not affected.

### Example: Attribute Sorting

**Before (with `sortAttributes: true`):**
```xml
<record id="test_record" model="test.model" active="true" name="Test" priority="high">
```

**After:**
```xml
<record
  active="true"
  id="test_record"
  model="test.model"
  name="Test"
  priority="high">
```

### Example: Quote Preservation in XPath and Odoo Domains

The formatter intelligently handles quotes in XPath expressions and Odoo domains, avoiding unnecessary HTML entity conversion:

**Before formatting:**
```xml
<xpath expr="//field[@name='partner_id']" position="before">
    <field name="domain">[('name', '=', 'test')]</field>
</xpath>
```

**After formatting** (quotes are preserved, not converted to `&apos;`):
```xml
<xpath expr="//field[@name='partner_id']" position="before">
    <field name="domain">[('name', '=', 'test')]</field>
</xpath>
```

The formatter automatically:
- Preserves `'` in double-quoted attributes (doesn't convert to `&apos;`)
- Uses single quotes for attributes containing double quotes for better readability
- Decodes unnecessary entities in text content

### Example: Smart Validation

The Smart Validation feature validates XML before formatting and shows detailed error messages with visual highlighting:

**Invalid XML (missing closing tag):**
```xml
<field name="email"
<!-- Missing closing tag -->
```

**What happens:**
1. ⚠️ Popup warning appears with error details
2. 🔴 **Error line is highlighted with red background**
3. 📍 **Editor auto-scrolls to the error location**
4. ❌ Error message shows: "Expected closing tag 'field' (cột 5)"

**Error Popup:**
```
⚠️ XML không hợp lệ - Không thể format

📍 Dòng 10:
"<field name="email..."

❌ Lỗi: Expected closing tag 'field' (cột 5)
```

**Visual Features:**
- Red background highlight on error line
- Red border on the left side
- Red marker in overview ruler (scrollbar area)
- Auto-clear after 5 seconds (customizable)
- Clears immediately when you edit the document

Benefits:
- Prevents formatting invalid XML
- Shows exact line number and column of error
- Displays problematic line content (first 20 chars)
- **Visual highlighting makes error easy to spot**
- **Auto-scroll saves time searching for error**
- No file changes when validation fails

For more details, see [SMART-VALIDATION.md](SMART-VALIDATION.md)

### Example: Odoo Tag Spacing

The Odoo Tag Spacing feature automatically adds blank lines between important Odoo tags for better readability:

**Before formatting:**
```xml
<odoo>
    <data>
        <record id="model_1" model="ir.model">
            <field name="name">Model 1</field>
        </record>
        <record id="model_2" model="ir.model">
            <field name="name">Model 2</field>
        </record>
        <menuitem id="menu_1" name="Menu 1"/>
        <menuitem id="menu_2" name="Menu 2"/>
    </data>
</odoo>
```

**After formatting** (with `odooTagSpacing: true`):
```xml
<odoo>
  <data>
    <record id="model_1" model="ir.model">
      <field name="name">Model 1</field>
    </record>

    <record id="model_2" model="ir.model">
      <field name="name">Model 2</field>
    </record>

    <menuitem id="menu_1" name="Menu 1"/>

    <menuitem id="menu_2" name="Menu 2"/>
  </data>
</odoo>
```

You can customize which tags should have spacing by modifying the `odoo-utils.odooSpacingTags` setting.

## Requirements

- VS Code version 1.102.0 or higher

## Known Issues

- Complex nested JSON in attributes may need special handling
- Very large XML files (>10MB) may have performance impacts

## Release Notes

### 0.0.4

- Added attribute sorting feature (`sortAttributes`)
- Improved attribute formatting based on line length
- Enhanced debug logging and output channel
- Better format on save support

### 0.0.3

- Added format on save functionality
- Improved configuration management
- Added test commands

### 0.0.1

- Initial release
- Basic XML formatting support

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
