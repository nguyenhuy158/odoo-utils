# odoo-utils Extension - Development TODO

## 🎯 Project Overview
VS Code Extension for formatting XML files, specifically designed for Odoo development workflows.

## 📋 Development Roadmap

### Phase 1: Core Implementation
- [x] **1. Implement XML parser and formatter**
  - [x] Research and choose XML library (xml2js, fast-xml-parser, or native DOMParser)
  - [x] Create basic XML parsing functionality
  - [x] Implement XML formatting with proper indentation
  - [x] Handle line breaks and attribute formatting
  - [x] Test with basic XML samples

- [x] **2. Replace placeholder command with format command**
  - [x] Update package.json commands section
  - [x] Replace 'odoo-utils.helloWorld' with 'odoo-utils.formatDocument'
  - [x] Implement command handler in src/extension.ts
  - [x] Test command registration and execution

### Phase 2: Configuration & User Experience
- [x] **3. Add XML formatting configuration options**
  - [x] Add contributes.configuration in package.json
  - [x] Implement indent size setting (default: 2)
  - [x] Implement indent type setting (spaces/tabs)
  - [x] Add attribute formatting style options
  - [x] Add line length limit configuration
  - [x] Add empty element handling options

- [ ] **4. Add keybinding for format command**
  - [ ] Add contributes.keybindings in package.json
  - [ ] Set default keybinding (Shift+Alt+F)
  - [ ] Test keybinding functionality

- [ ] **5. Add XML language support detection**
  - [ ] Update activationEvents in package.json
  - [ ] Add language-specific activation
  - [ ] Ensure extension only works with XML files

### Phase 3: Odoo Integration
- [ ] **6. Implement Odoo-specific XML formatting**
  - [ ] Research Odoo XML structure patterns
  - [ ] Handle Odoo view definitions (form, tree, kanban)
  - [ ] Handle data records and menuitem
  - [ ] Handle security rules and access rights
  - [ ] Preserve Odoo-specific attributes
  - [ ] Test with real Odoo XML files

- [ ] **7. Add format on save functionality**
  - [ ] Implement onSave event handler
  - [ ] Add configuration option to enable/disable
  - [ ] Add file pattern matching for Odoo modules
  - [ ] Test auto-formatting behavior

### Phase 4: Quality & Polish
- [ ] **8. Implement error handling and validation**
  - [ ] Add XML syntax validation
  - [ ] Handle malformed XML gracefully
  - [ ] Show user-friendly error messages
  - [ ] Add progress indicators for large files
  - [ ] Test error scenarios

- [ ] **9. Add comprehensive test suite**
  - [ ] Test basic XML formatting
  - [ ] Test Odoo-specific formatting
  - [ ] Test configuration options
  - [ ] Test error handling
  - [ ] Test edge cases and performance
  - [ ] Add integration tests

- [ ] **10. Update documentation and README**
  - [ ] Update README.md with actual features
  - [ ] Add usage instructions and examples
  - [ ] Document configuration options
  - [ ] Add screenshots/GIFs of functionality
  - [ ] Update changelog and version info

## 🔧 Technical Notes

### Dependencies to Consider
- **XML Parser**: ✅ fast-xml-parser (chosen and implemented)
- **Testing**: Mocha, VS Code Test Framework
- **Build**: TypeScript, ESLint

### Completed Features
- ✅ **Core XML Formatting**: Using fast-xml-parser library
- ✅ **VS Code Integration**: Commands, configuration, output channels
- ✅ **Configuration System**: 8 configurable options with VS Code Settings UI
- ✅ **Test Framework**: XML formatter tests and configuration tests
- ✅ **Error Handling**: XML validation and user-friendly error messages

### File Structure
```
src/
├── extension.ts          # Main extension entry point ✅
├── formatters/
│   ├── xmlFormatter.ts   # Core XML formatting logic ✅
│   └── odoFormatter.ts   # Odoo-specific formatting (TODO)
├── utils/
│   ├── config.ts         # Configuration management ✅
│   └── validator.ts      # XML validation utilities (TODO)
└── test/
    ├── extension.test.ts # Main extension tests (TODO)
    ├── xmlFormatterTest.ts # XML formatter tests ✅
    ├── configTest.ts     # Configuration tests ✅
    └── formatter.test.ts # Formatter-specific tests (TODO)
```

### Configuration Schema (✅ Implemented)
```json
{
  "odoo-utils.indentSize": 2,
  "odoo-utils.indentType": "spaces",
  "odoo-utils.maxLineLength": 120,
  "odoo-utils.preserveAttributes": true,
  "odoo-utils.formatAttributes": false,
  "odoo-utils.selfClosingTags": true,
  "odoo-utils.formatOnSave": false,
  "odoo-utils.odooSpecific": true
}
```

## 📝 Notes
- Current version: 0.0.2
- Target VS Code version: ^1.102.0
- Published by: nguyenhuy158
- Repository: https://github.com/nguyenhuy158/odoo-utils

## 🚀 Getting Started
1. Run `npm run watch` to start continuous compilation
2. Press F5 to launch Extension Development Host
3. Test changes in the new VS Code window

---
*Last updated: October 17, 2025*