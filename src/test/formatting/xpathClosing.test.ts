import * as assert from 'assert';
import { XmlFormatter } from '../../formatters/xmlFormatter';
import { getTestConfig } from '../testConfig';

suite('XPath Closing Tag Test Suite', () => {
    const testXml = `<?xml version="1.0"?>
<odoo>
    <xpath expr="//button[@name='action_view_delivery']" position="attributes">
        <attribute name="invisible">1</attribute>
    </xpath>
    <field name="mobile" widget="phone" options="{'enable_sms': true}" placeholder="Enter mobile" required="True"/>
</odoo>`;

    test('XPath with closeTagOnNewLine = false', () => {
        const formatter = new XmlFormatter(getTestConfig({
            closeTagOnNewLine: false
        }));

        const result = formatter.formatXml(testXml);

        // Verify xpath tag is present
        assert.ok(result.includes('<xpath'), 'Should contain xpath opening tag');
        assert.ok(result.includes('</xpath>'), 'Should contain xpath closing tag');
        assert.ok(result.includes('<attribute'), 'Should contain attribute tag');

        // Verify content is preserved
        assert.ok(result.includes('action_view_delivery'), 'Should preserve action name');
        assert.ok(result.includes('invisible'), 'Should preserve invisible attribute');
    });

    test('XPath with closeTagOnNewLine = true', () => {
        const formatter = new XmlFormatter(getTestConfig({
            closeTagOnNewLine: true
        }));

        const result = formatter.formatXml(testXml);

        // Verify xpath tag is present
        assert.ok(result.includes('<xpath'), 'Should contain xpath opening tag');
        assert.ok(result.includes('</xpath>'), 'Should contain xpath closing tag');

        // With closeTagOnNewLine, attributes may be on separate lines if too long
        const lines = result.split('\n');
        const xpathLine = lines.find(line => line.includes('<xpath'));

        // Should have proper formatting
        assert.ok(xpathLine, 'Should have xpath line');
    });

    test('Field with complex attributes', () => {
        const formatter = new XmlFormatter(getTestConfig({
            closeTagOnNewLine: false
        }));

        const result = formatter.formatXml(testXml);

        // Field should be formatted
        assert.ok(result.includes('<field'), 'Should contain field tag');
        assert.ok(result.includes('widget="phone"'), 'Should preserve widget attribute');
        assert.ok(result.includes("options=\"{'enable_sms': true}\""), 'Should preserve options with JSON');
    });
});
