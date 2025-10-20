import * as assert from 'assert';
import { XmlFormatter } from '../../formatters/xmlFormatter';
import { getTestConfig } from '../testConfig';
import { loadFixture, loadFixtures, getAvailableFixtures } from '../utils/fixtureLoader';

/**
 * DEMO: How to use Test Fixtures
 *
 * This file demonstrates the new fixture pattern for test data management.
 */

suite('DEMO: Test Fixtures Usage', () => {
    let formatter: XmlFormatter;

    setup(() => {
        formatter = new XmlFormatter(getTestConfig());
    });

    // ============================================
    // Example 1: Load single fixture
    // ============================================
    test('DEMO: Load single fixture', () => {
        // Load one fixture from formatting category
        const fixture = loadFixture('formatting', 'apostrophe-xpath');

        // Fixture contains:
        // - fixture.input: XML string from *-input.xml
        // - fixture.expected: XML string from *-expected.xml
        // - fixture.description: Test name

        const result = formatter.formatXml(fixture.input);

        // Assert using fixture data
        assert.ok(!result.includes('&apos;'));
        assert.ok(result.includes("[@name='partner_id']"));
    });

    // ============================================
    // Example 2: Load multiple fixtures
    // ============================================
    test('DEMO: Load multiple fixtures at once', () => {
        // Load multiple fixtures from same category
        const fixtures = loadFixtures('formatting', [
            'apostrophe-xpath',
            'apostrophe-domain',
            'apostrophe-mixed'
        ]);

        // Test all fixtures
        fixtures.forEach(fixture => {
            const result = formatter.formatXml(fixture.input);
            assert.ok(result.length > 0);
            // Can also compare: assert.strictEqual(result, fixture.expected);
        });
    });

    // ============================================
    // Example 3: List available fixtures
    // ============================================
    test('DEMO: List all available fixtures', () => {
        // Get all fixture names in a category
        const available = getAvailableFixtures('formatting');

        console.log('Available formatting fixtures:', available);
        // Output: ['apostrophe-xpath', 'apostrophe-domain', ...]

        assert.ok(available.includes('apostrophe-xpath'));
        assert.ok(available.length > 0);
    });

    // ============================================
    // Example 4: Compare exact output
    // ============================================
    test('DEMO: Compare exact expected output', () => {
        const fixture = loadFixture('formatting', 'apostrophe-xpath');
        const result = formatter.formatXml(fixture.input);

        // Compare exact output with expected
        assert.strictEqual(
            result.trim(),
            fixture.expected.trim(),
            'Output should match expected fixture'
        );
    });
});

/**
 * BENEFITS of using fixtures:
 *
 * 1. ✅ Easy to read: See input/expected clearly
 * 2. ✅ Easy to edit: Edit XML directly, no escaping needed
 * 3. ✅ Easy to review: View files side-by-side in VS Code
 * 4. ✅ Reusable: Share fixtures across multiple tests
 * 5. ✅ Better debugging: When test fails, open fixture files to see why
 *
 * WHEN TO USE:
 *
 * ✅ Use fixtures when:
 * - XML is long (>5 lines)
 * - Need exact expected output comparison
 * - Want easy review of test data
 * - Data could be reused
 *
 * ❌ Don't use fixtures when:
 * - Very simple XML (1-2 lines)
 * - Only checking few assertions, not full output
 * - Complex test logic with many variations
 */
