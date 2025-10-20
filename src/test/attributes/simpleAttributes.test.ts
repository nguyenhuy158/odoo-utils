import * as assert from 'assert';
import { formatXml } from '../../formatters/xmlFormatter';
import { loadFixture } from '../utils/fixtureLoader';
import { getTestConfig } from '../testConfig';

suite('Simple Attribute Formatting Test Suite', () => {
    test('Long line should break attributes', () => {
        const fixture = loadFixture('attributes', 'longLine');
        const result = formatXml(fixture.input, getTestConfig());
        assert.strictEqual(result, fixture.expected);
    });

    test('Short line should stay on one line', () => {
        const fixture = loadFixture('attributes', 'shortLine');
        const result = formatXml(fixture.input, getTestConfig());
        assert.strictEqual(result, fixture.expected);
    });

    test('Line length analysis for long attributes', () => {
        const fixture = loadFixture('attributes', 'complexAttributes');
        const result = formatXml(fixture.input, getTestConfig());
        assert.strictEqual(result, fixture.expected);
    });
});
