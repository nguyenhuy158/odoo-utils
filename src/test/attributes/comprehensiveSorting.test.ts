import * as assert from 'assert';
import { formatXml } from '../../formatters/xmlFormatter';
import { loadFixture } from '../utils/fixtureLoader';
import { getTestConfig } from '../testConfig';

suite('Comprehensive Attribute Sorting Test Suite', () => {
    test('Basic attribute sorting', () => {
        const fixture = loadFixture('attributes', 'comprehensive-basic');
        const result = formatXml(fixture.input, getTestConfig({
            formatAttributes: false,
            sortAttributes: true
        }));
        assert.strictEqual(result, fixture.expected);
    });

    test('Sorting with line breaking (long line)', () => {
        const fixture = loadFixture('attributes', 'comprehensive-longLine');
        const result = formatXml(fixture.input, getTestConfig({
            maxLineLength: 60
        }));
        assert.strictEqual(result, fixture.expected);
    });

    test('No sorting (preserve original order)', () => {
        const fixture = loadFixture('attributes', 'comprehensive-noSort');
        const result = formatXml(fixture.input, getTestConfig({
            sortAttributes: false,
            maxLineLength: 40
        }));
        assert.strictEqual(result, fixture.expected);
    });

    test('Short line (no breaking)', () => {
        const fixture = loadFixture('attributes', 'comprehensive-shortLine');
        const result = formatXml(fixture.input, getTestConfig({
            maxLineLength: 80
        }));
        assert.strictEqual(result, fixture.expected);
    });

    test('Real Odoo XML example with sorting', () => {
        const fixture = loadFixture('attributes', 'comprehensive-odoo');
        const result = formatXml(fixture.input, getTestConfig({
            indentSize: 4,
            maxLineLength: 80,
            sortAttributes: true
        }));
        assert.strictEqual(result, fixture.expected);
    });
});
