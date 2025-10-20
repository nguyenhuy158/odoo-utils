# Test Fixtures

This directory contains test data for XML formatter tests.

## Structure

Each test category has its own subdirectory:

```
fixtures/
├── formatting/        # General formatting features
│   ├── apostrophe-xpath-input.xml
│   ├── apostrophe-xpath-expected.xml
│   └── ...
├── attributes/        # Attribute sorting and formatting
├── comments/          # Comment preservation
├── odoo/             # Odoo-specific features
├── config/           # Configuration tests
└── validation/       # Validation features
```

## Naming Convention

Files follow the pattern: `{feature}-{case}-{type}.xml`

- **feature**: The feature being tested (e.g., `apostrophe`, `sorting`)
- **case**: Specific test case (e.g., `xpath`, `domain`, `complex`)
- **type**: Either `input` or `expected`

## Usage

Load fixtures in tests using the fixture loader:

```typescript
import { loadFixture } from '../utils/fixtureLoader';

test('My test', () => {
    const fixture = loadFixture('formatting', 'apostrophe-xpath');
    const result = formatter.formatXml(fixture.input);
    assert.strictEqual(result, fixture.expected);
});
```

## Guidelines

1. **Keep fixtures focused**: Each fixture should test ONE specific feature
2. **Use descriptive names**: Name should clearly indicate what is being tested
3. **Maintain pairs**: Always have both `-input.xml` and `-expected.xml`
4. **Review carefully**: Expected outputs should be manually verified

## Benefits

- ✅ Easy to review: View input and expected side-by-side
- ✅ Easy to edit: No string escaping needed
- ✅ Easy to debug: Clear separation of test data and test logic
- ✅ Reusable: Same fixtures can be used in multiple tests

See [FIXTURE-GUIDE.md](../../../FIXTURE-GUIDE.md) for detailed usage guide.
