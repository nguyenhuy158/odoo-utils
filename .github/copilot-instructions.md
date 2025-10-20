# Copilot Instructions for odoo-utils

## Communication Style
- Keep answers short and clear
- Do the work first, then tell what you did in 1-2 sentences
- No extra words or emoji
- Answer in Vietnamese when user asks in Vietnamese, English when user asks in English
- All code and generated content must use simple English (A2 level)

## File Editing Rules
- **ONLY use file tools** to edit files: `read_file`, `create_file`, `replace_string_in_file`
- **NEVER use terminal commands** to change files: no `node -e`, `sed`, `echo >`, etc.
- Use terminal ONLY for: build, test, run scripts, git, npm commands

## Project Overview
This is a VS Code extension for formatting XML files. It uses TypeScript and VS Code Extension API.

## Key Files
- **`src/extension.ts`**: Main file with `activate()` and `deactivate()` functions
- **`package.json`**: Extension settings, commands, and build scripts
- **`src/formatters/xmlFormatter.ts`**: XML formatting logic
- **`src/test/`**: All test files

## Commands
Current commands in this extension:
- `odoo-utils.formatDocument`: Format XML document
- `odoo-utils.testFormatter`: Test formatter

Command naming pattern: `odoo-utils.{actionName}`

## Build & Test
```bash
npm run watch      # Auto build when files change
npm run compile    # Build once
npm run test       # Run all tests
npm run lint       # Check code style
```

## Test Rules
- **ALL tests go in `src/test/` folder** - never in root
- **Use TypeScript only** - no .js files
- **Use fixture files** - no XML strings in test code
- **ALWAYS use `getTestConfig()`** - all `formatXml` calls must include config parameter
- Test file name: `{feature}.test.ts`
- Fixture files: `src/test/fixtures/{category}/{testName}-input.xml` and `-expected.xml`

### CRITICAL: Test Fixture Integrity
- **NEVER modify fixture input/expected files when debugging failing tests**
- **ONLY fix the application code (formatters, processors) to match expected output**
- If fixture appears wrong, provide suggestions to user - do not change it yourself
- User must manually review and approve any fixture changes

### Test Folders
- `src/test/core/` - Main extension tests
- `src/test/attributes/` - Attribute tests
- `src/test/comments/` - Comment tests
- `src/test/formatting/` - Format tests
- `src/test/config/` - Config tests
- `src/test/validation/` - Validation tests
- `src/test/odoo/` - Odoo-specific tests
- `src/test/other/` - Other tests

### When Adding New Tests
1. Create fixture files in `src/test/fixtures/{category}/`
2. Create test file in correct folder (e.g., `src/test/formatting/`)
3. Update `TEST-TRACKER.md`
4. Run `npm test` to check all tests pass

### Test File Template
```typescript
import * as assert from 'assert';
import { formatXml } from '../../../formatters/xmlFormatter';
import { loadFixture } from '../../utils/fixtureLoader';
import { getTestConfig } from '../testConfig';

suite('Feature Name Test Suite', () => {
    test('Test case description', () => {
        const fixture = loadFixture('category', 'testName');
        const result = formatXml(fixture.input, getTestConfig());
        assert.strictEqual(result, fixture.expected);
    });
});
```

## Adding New Commands
1. Add command in `package.json`:
```json
{
  "command": "odoo-utils.newCommand",
  "title": "odoo-utils: New Command"
}
```

2. Register in `src/extension.ts`:
```typescript
const cmd = vscode.commands.registerCommand(
    "odoo-utils.newCommand",
    async () => {
        // Your code here
    }
);
context.subscriptions.push(cmd);
```

## Code Structure
- **`src/formatters/types.ts`**: Type definitions
- **`src/formatters/xmlFormatter.ts`**: Main formatter
- **`src/formatters/processors/`**: Helper processors
  - `blankLineProcessor.ts`: Handle blank lines
  - `commentProcessor.ts`: Handle comments
- **`src/utils/config.ts`**: Config loader

## Important Rules
- All project docs must be in English
- Use simple English (A2 level)
- Run tests before publishing
- **MUST update `.xmlformatterrc` when adding new config options** - this file must always have all current config options