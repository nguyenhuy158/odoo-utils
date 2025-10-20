import * as assert from 'assert';
import { XmlFormatter } from '../../formatters/xmlFormatter';
import { getTestConfig } from '../testConfig';
import { loadFixture } from '../utils/fixtureLoader';

suite('Attribute Sorting Test Suite', () => {
    test('Sorting disabled preserves original order', () => {
        const fixture = loadFixture('attributes', 'attributeSorting-noSort');
        const formatter = new XmlFormatter(getTestConfig({
            formatAttributes: true,
            sortAttributes: false,
            maxLineLength: 50
        }));
        const result = formatter.formatXml(fixture.input);
        assert.strictEqual(result, fixture.expected);
    });

    test('Sorting enabled sorts attributes alphabetically', () => {
        const fixture = loadFixture('attributes', 'attributeSorting-withSort');
        const formatter = new XmlFormatter(getTestConfig({
            formatAttributes: true,
            sortAttributes: true,
            maxLineLength: 50
        }));
        const result = formatter.formatXml(fixture.input);
        assert.strictEqual(result, fixture.expected);
    });

    test('Short line with sorting enabled stays on one line', () => {
        const fixture = loadFixture('attributes', 'attributeSorting-short');
        const formatter = new XmlFormatter(getTestConfig({
            formatAttributes: true,
            sortAttributes: true,
            maxLineLength: 50
        }));
        const result = formatter.formatXml(fixture.input);
        assert.strictEqual(result, fixture.expected);
    });
});