import * as assert from 'assert';
import { XmlFormatter, formatXml, validateXml } from '../../formatters/xmlFormatter';
import { getTestConfig } from '../testConfig';
import { loadFixture } from '../utils/fixtureLoader';

suite('XML Formatter Test Suite', () => {
    test('Basic XML formatting', () => {
        const fixture = loadFixture('core', 'xmlFormatter-basic');
        const result = formatXml(fixture.input);
        assert.strictEqual(result, fixture.expected);
    });

    test('Complex XML formatting with indentSize 4', () => {
        const fixture = loadFixture('core', 'xmlFormatter-complex');
        const result = formatXml(fixture.input, { indentSize: 4 });
        assert.strictEqual(result, fixture.expected);
    });

    test('Valid XML validation', () => {
        const fixture = loadFixture('core', 'xmlFormatter-basic');
        const validation = validateXml(fixture.input);
        assert.strictEqual(validation.isValid, true);
    });

    test('Invalid XML validation', () => {
        const invalidXml = '<invalid>unclosed tag';
        const validation = validateXml(invalidXml);
        assert.strictEqual(validation.isValid, false);
        assert.ok(validation.error);
    });

    test('Tab indented formatting', () => {
        const formatter = new XmlFormatter(getTestConfig({
            indentType: 'tabs',
            indentSize: 1
        }));
        const fixture = loadFixture('core', 'xmlFormatter-basic');
        const result = formatter.formatXml(fixture.input);

        // Should contain tab characters for indentation
        assert.ok(result.includes('\t'));
    });

    test('Long line attribute formatting should break attributes', () => {
        const formatterWithAttributes = new XmlFormatter(getTestConfig());
        const fixture = loadFixture('core', 'xmlFormatter-longLine');
        const result = formatterWithAttributes.formatXml(fixture.input);

        // Should break attributes on multiple lines
        assert.ok(result.includes('\n'));
        assert.strictEqual(result, fixture.expected);
    });

    test('Short line should stay on one line', () => {
        const formatterWithAttributes = new XmlFormatter(getTestConfig({
            formatAttributes: true,
            maxLineLength: 80
        }));
        const fixture = loadFixture('core', 'xmlFormatter-shortLine');
        const result = formatterWithAttributes.formatXml(fixture.input);
        assert.strictEqual(result, fixture.expected);
    });
});