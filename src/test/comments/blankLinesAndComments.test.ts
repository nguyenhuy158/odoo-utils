import * as assert from 'assert';
import { XmlFormatter } from '../../formatters/xmlFormatter';
import { getTestConfig } from '../testConfig';

suite('Blank Lines and Comments Test Suite', () => {
    const testXml = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <!-- User comment 1 -->
    <data>


        <!-- User comment 2 after blank lines -->
        <record id="test1" model="ir.model">
            <field name="name">Test 1</field>
        </record>

        <!-- User comment 3 -->

        <record id="test2" model="ir.model">
            <field name="name">Test 2</field>
        </record>
    </data>
</odoo>`;

    test('Should preserve comments and limit blank lines', () => {
        const formatter = new XmlFormatter(getTestConfig({
            indentSize: 4
        }));

        const result = formatter.formatXml(testXml);

        // Should not have placeholder comments in output
        assert.ok(!result.includes('__BLANK_LINES_'), 'Should not contain placeholder comments');

        // User comments should be preserved
        const userComments = (testXml.match(/<!-- User comment \d+ -->/g) || []);
        const formattedUserComments = (result.match(/<!-- User comment \d+ -->/g) || []);

        assert.strictEqual(formattedUserComments.length, userComments.length,
            'All user comments should be preserved');

        // Check specific comments
        assert.ok(result.includes('<!-- User comment 1 -->'), 'Should have comment 1');
        assert.ok(result.includes('<!-- User comment 2 after blank lines -->'), 'Should have comment 2');
        assert.ok(result.includes('<!-- User comment 3 -->'), 'Should have comment 3');
    });

    test('Should not exceed maximum blank lines', () => {
        const formatter = new XmlFormatter(getTestConfig({
            indentSize: 4
        }));

        const result = formatter.formatXml(testXml);

        // Check for consecutive blank lines
        const tripleNewlines = result.match(/\n\n\n\n/g);
        assert.ok(!tripleNewlines || tripleNewlines.length === 0,
            'Should not have more than maximumBlankLines consecutive blank lines');
    });

    test('All comments should match exactly', () => {
        const formatter = new XmlFormatter(getTestConfig({
            indentSize: 4
        }));

        const result = formatter.formatXml(testXml);

        // Extract all original comments (except XML declaration)
        const allOriginalComments = (testXml.match(/<!--[^>]*-->/g) || [])
            .map(c => c.trim())
            .filter(c => !c.includes('__BLANK_LINES_'));

        const allFormattedComments = (result.match(/<!--[^>]*-->/g) || [])
            .map(c => c.trim())
            .filter(c => !c.includes('__BLANK_LINES_'));

        assert.strictEqual(allFormattedComments.length, allOriginalComments.length,
            'Should have same number of comments');

        // Check each comment is preserved
        for (const comment of allOriginalComments) {
            assert.ok(result.includes(comment), `Should contain comment: ${comment}`);
        }
    });

    test('Content integrity should be maintained', () => {
        const formatter = new XmlFormatter(getTestConfig({
            indentSize: 4
        }));

        const result = formatter.formatXml(testXml);

        // All records should be present
        assert.ok(result.includes('id="test1"'), 'Should have test1 record');
        assert.ok(result.includes('id="test2"'), 'Should have test2 record');
        assert.ok(result.includes('Test 1'), 'Should have Test 1 content');
        assert.ok(result.includes('Test 2'), 'Should have Test 2 content');
    });
});
