import * as assert from 'assert';
import { XmlFormatter } from '../../formatters/xmlFormatter';
import { getTestConfig } from '../testConfig';

suite('Special Comments Test Suite', () => {
    const formatter = new XmlFormatter(getTestConfig({
        indentSize: 4
    }));

    test('Comment with code snippets should be preserved', () => {
        const input = `<odoo>
    <!-- Example: <field name="test">value</field> -->
    <data></data>
</odoo>`;

        const result = formatter.formatXml(input);

        assert.ok(result.includes('<!-- Example: <field name="test">value</field> -->'),
            'Should preserve comment with code snippets');
    });

    test('Comment with XPath expressions should be preserved', () => {
        const input = `<odoo>
    <!-- XPath: //field[@name='test'] -->
    <data></data>
</odoo>`;

        const result = formatter.formatXml(input);

        assert.ok(result.includes("<!-- XPath: //field[@name='test'] -->"),
            'Should preserve comment with XPath');
    });

    test('Comment with special XML entities should be preserved', () => {
        const input = `<odoo>
    <!-- Special chars: &lt; &gt; &amp; &quot; &apos; -->
    <data></data>
</odoo>`;

        const result = formatter.formatXml(input);

        assert.ok(result.includes('<!-- Special chars: &lt; &gt; &amp; &quot; &apos; -->'),
            'Should preserve comment with XML entities');
    });

    test('Comment with quotes should be preserved', () => {
        const input = `<odoo>
    <!-- Text with "double" and 'single' quotes -->
    <data></data>
</odoo>`;

        const result = formatter.formatXml(input);

        assert.ok(result.includes('<!-- Text with "double" and \'single\' quotes -->'),
            'Should preserve comment with quotes');
    });

    test('Multi-line comment should be preserved', () => {
        const input = `<odoo>
    <!--
        Multi-line comment
            with indentation
        preserved?
    -->
    <data></data>
</odoo>`;

        const result = formatter.formatXml(input);

        // Multi-line comment should exist
        assert.ok(result.includes('<!--'), 'Should have comment start');
        assert.ok(result.includes('-->'), 'Should have comment end');
        assert.ok(result.includes('Multi-line comment'), 'Should preserve comment content');
    });

    test('Comment with Vietnamese characters should be preserved', () => {
        const input = `<odoo>
    <!-- Đây là comment tiếng Việt có dấu -->
    <data></data>
</odoo>`;

        const result = formatter.formatXml(input);

        assert.ok(result.includes('<!-- Đây là comment tiếng Việt có dấu -->'),
            'Should preserve Vietnamese characters in comment');
    });

    test('Multiple special comments should all be preserved', () => {
        const input = `<odoo>
    <!-- Example: <field name="test">value</field> -->
    <!-- XPath: //field[@name='test'] -->
    <!-- Special chars: &lt; &gt; &amp; -->
    <data></data>
</odoo>`;

        const result = formatter.formatXml(input);

        const commentCount = (result.match(/<!--/g) || []).length;
        assert.strictEqual(commentCount, 3, 'Should have all 3 comments preserved');
    });
});
