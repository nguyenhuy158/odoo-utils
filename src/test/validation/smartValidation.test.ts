/**
 * Unit Test for Smart Validation Feature
 */

import * as assert from 'assert';
import { XmlFormatter } from '../../formatters/xmlFormatter';
import { getTestConfig } from '../testConfig';
import { loadFixture } from '../utils/fixtureLoader';

suite('Smart Validation Test Suite', () => {
    test('Valid XML should pass validation', () => {
        const formatter = new XmlFormatter(getTestConfig());
        const fixture = loadFixture('validation', 'smartValidation-valid');

        const result = formatter.validateXml(fixture.input);
        assert.strictEqual(result.isValid, true);
        assert.strictEqual(result.error, undefined);
    });

    test('Invalid XML - Missing closing tag', () => {
        const formatter = new XmlFormatter(getTestConfig());
        const fixture = loadFixture('validation', 'smartValidation-missingClosingTag');

        const result = formatter.validateXml(fixture.input);
        assert.strictEqual(result.isValid, false);
        assert.ok(result.error);
        assert.ok(result.line);
        assert.ok(result.lineContent);
    });

    test('Invalid XML - Malformed tag', () => {
        const formatter = new XmlFormatter(getTestConfig());
        const fixture = loadFixture('validation', 'smartValidation-malformedTag');

        const result = formatter.validateXml(fixture.input);
        assert.strictEqual(result.isValid, false);
        assert.ok(result.error);
        assert.ok(result.line);
    });

    test('Not XML content', () => {
        const formatter = new XmlFormatter(getTestConfig());
        const fixture = loadFixture('validation', 'smartValidation-notXml');

        const result = formatter.validateXml(fixture.input);
        assert.strictEqual(result.isValid, false);
        assert.ok(result.error);
    });

    test('Line content should be truncated to 20 chars', () => {
        const formatter = new XmlFormatter(getTestConfig());
        const fixture = loadFixture('validation', 'smartValidation-longLine');

        const result = formatter.validateXml(fixture.input);
        assert.strictEqual(result.isValid, false);
        if (result.lineContent) {
            assert.ok(result.lineContent.length <= 23); // 20 chars + "..."
            if (result.lineContent.endsWith('...')) {
                assert.ok(result.lineContent.length === 23);
            }
        }
    });

    test('isXmlContent - Valid XML', () => {
        const validXml = `<?xml version="1.0"?><root></root>`;
        assert.strictEqual(XmlFormatter.isXmlContent(validXml), true);
    });

    test('isXmlContent - Valid XML without declaration', () => {
        const validXml = `<root><child /></root>`;
        assert.strictEqual(XmlFormatter.isXmlContent(validXml), true);
    });

    test('isXmlContent - Not XML', () => {
        const notXml = 'This is just text';
        assert.strictEqual(XmlFormatter.isXmlContent(notXml), false);
    });

    test('isXmlContent - Empty string', () => {
        const empty = '';
        assert.strictEqual(XmlFormatter.isXmlContent(empty), false);
    });

    test('Format should fail for invalid XML', () => {
        const formatter = new XmlFormatter(getTestConfig());
        const invalidXml = '<root><unclosed>';

        assert.throws(() => {
            formatter.formatXml(invalidXml);
        }, /XML formatting failed/);
    });
});
