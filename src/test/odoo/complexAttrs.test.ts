import * as assert from 'assert';
import { formatXml } from '../../formatters/xmlFormatter';
import { loadFixture } from '../utils/fixtureLoader';
import { getTestConfig } from '../testConfig';

/**
 * Test Suite: Complex Odoo Attrs
 *
 * Tests formatting of Odoo XML files with complex `attrs` attribute values containing:
 * - Nested quotes (single and double)
 * - Square brackets and parentheses
 * - Domain expressions with OR operators (|)
 * - Boolean values (True, False)
 * - List values in domain filters
 *
 * Critical Fix: formatAttributes option should not break tags that have content on the same line.
 * Previously, tags like <attribute name="attrs">{'invisible': ...}</attribute> would be
 * incorrectly split into multiline format and lose their content.
 */
suite('Complex Odoo Attrs Test Suite', () => {
    test('Should preserve attrs content when formatAttributes is enabled', () => {
        const fixture = loadFixture('odoo', 'complexAttrs-formatEnabled');
        const result = formatXml(fixture.input, getTestConfig());

        // Verify content is preserved even with formatAttributes: true
        assert.ok(result.includes("'invisible'"), 'Should preserve invisible key');
        assert.ok(result.includes("'is_return'"), 'Should preserve is_return field');
        assert.ok(result.includes("'invoice_id'"), 'Should preserve invoice_id field');
        assert.ok(result.includes("'is_hide_related'"), 'Should preserve is_hide_related field');

        // Verify attribute tag is not split when it has content on same line
        // assert.ok(!result.includes('<attribute\n'), 'Attribute tag with content should not be split across lines');
        assert.equal(fixture.expected, result, 'Formatted output should match expected output');
    });

    test('Should preserve complex attrs with nested quotes and brackets', () => {
        const fixture = loadFixture('odoo', 'complexAttrs-nestedQuotes');
        const result = formatXml(fixture.input, getTestConfig({
            indentSize: 4,
            formatAttributes: false,
            sortAttributes: false
        }));

        // Verify XML is valid
        assert.ok(result.length > 0, 'Result should not be empty');
        assert.ok(result.includes('<?xml version="1.0" encoding="utf-8"?>'), 'Should preserve XML declaration');

        // Verify structure is preserved
        assert.ok(result.includes('<odoo>'), 'Should have odoo tag');
        assert.ok(result.includes('</odoo>'), 'Should close odoo tag');
        assert.ok(result.includes('<record'), 'Should have record tag');
        assert.ok(result.includes('id="account_move_pair_form"'), 'Should preserve record id');

        // Verify all xpath expressions are preserved
        assert.ok(result.includes('expr="//button[@name=\'action_close\']"'), 'Should preserve first xpath expr');
        assert.ok(result.includes('expr="//button[@name=\'push_sale_order_to_netsuite\']"'), 'Should preserve second xpath expr');
        assert.ok(result.includes('expr="//button[@name=\'action_get_invoice_ref\']"'), 'Should preserve third xpath expr');

        // Verify complex attrs attributes are preserved
        assert.ok(result.includes("name=\"attrs\""), 'Should have attrs attribute name');

        // Check for key parts of the complex domain expressions
        assert.ok(result.includes("'invisible'"), 'Should preserve invisible key');
        assert.ok(result.includes("'is_return'"), 'Should preserve is_return field');
        assert.ok(result.includes("'is_hide_related'"), 'Should preserve is_hide_related field');
        assert.ok(result.includes("'bill_state'"), 'Should preserve bill_state field');
        assert.ok(result.includes("'not in'"), 'Should preserve not in operator');
        assert.ok(result.includes("'replacement'"), 'Should preserve replacement value');
        assert.ok(result.includes("'adjustment'"), 'Should preserve adjustment value');
        assert.ok(result.includes("'sale_netsuite_ref'"), 'Should preserve sale_netsuite_ref field');
        assert.ok(result.includes("'invoice_process'"), 'Should preserve invoice_process value');

        // Verify no HTML entities for quotes
        assert.ok(!result.includes('&apos;'), 'Should not contain &apos; entities');
        assert.ok(!result.includes('&quot;'), 'Should not contain &quot; entities in content');

        // Verify proper indentation (should have proper nesting)
        const lines = result.split('\n');
        const recordLine = lines.find((l: string) => l.includes('<record'));
        const fieldLines = lines.filter((l: string) => l.includes('<field') && !l.includes('</field>'));

        if (recordLine && fieldLines.length > 0) {
            const recordIndent = recordLine.search(/\S/);
            const fieldIndent = fieldLines[0].search(/\S/);
            assert.ok(fieldIndent > recordIndent, 'Field tags should be indented more than record tag');
        }
    });

    test('Should handle attrs with OR operators and True/False values', () => {
        const fixture = loadFixture('odoo', 'complexAttrs-orOperators');
        const result = formatXml(fixture.input, getTestConfig({
            indentSize: 4,
            formatAttributes: false,
            sortAttributes: false
        }));

        // Verify the complex logic is preserved
        assert.ok(result.includes("'|'"), 'Should preserve OR operators');
        assert.ok(result.includes('True'), 'Should preserve True value');
        assert.ok(result.includes('False'), 'Should preserve False value');
        assert.ok(result.includes("('field1', '=', True)"), 'Should preserve tuple with True');
        assert.ok(result.includes("('field2', '=', False)"), 'Should preserve tuple with False');
        assert.ok(result.includes("('field3', '!=', 'value')"), 'Should preserve tuple with string value');
    });

    test('Should handle attrs with list values in domain', () => {
        const fixture = loadFixture('odoo', 'complexAttrs-listValues');
        const result = formatXml(fixture.input, getTestConfig({
            indentSize: 4,
            formatAttributes: false,
            sortAttributes: false
        }));

        // Verify list values in domain are preserved
        assert.ok(result.includes("'in'"), 'Should preserve in operator');
        assert.ok(result.includes("['draft', 'done', 'cancel']"), 'Should preserve list of values');
        assert.ok(result.includes("'draft'"), 'Should preserve draft value');
        assert.ok(result.includes("'done'"), 'Should preserve done value');
        assert.ok(result.includes("'cancel'"), 'Should preserve cancel value');
    });

    test('Should handle multiple attribute tags in same xpath', () => {
        const fixture = loadFixture('odoo', 'complexAttrs-multipleAttrs');
        const result = formatXml(fixture.input, getTestConfig({
            indentSize: 4,
            formatAttributes: false,
            sortAttributes: false
        }));

        // Verify all attributes are preserved
        assert.ok(result.includes('name="attrs"'), 'Should have attrs attribute');
        assert.ok(result.includes('name="class"'), 'Should have class attribute');
        assert.ok(result.includes('name="string"'), 'Should have string attribute');
        assert.ok(result.includes("'invisible'"), 'Should preserve invisible in attrs');
        assert.ok(result.includes('btn-primary'), 'Should preserve class value');
        assert.ok(result.includes('Submit'), 'Should preserve string value');
    });
});
