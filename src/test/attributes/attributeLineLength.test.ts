import * as assert from 'assert';
import { formatXml } from '../../formatters/xmlFormatter';
import { loadFixture } from '../utils/fixtureLoader';
import { getTestConfig } from '../testConfig';

suite('Attribute Line Length Test Suite', () => {
    test('Long line should break attributes based on maxLineLength', () => {
        const fixture = loadFixture('attributes', 'lineLength-long');
        const result = formatXml(fixture.input, getTestConfig());
        assert.strictEqual(result, fixture.expected);
    });

    test('Short line should stay on one line', () => {
        const fixture = loadFixture('attributes', 'lineLength-short');
        const result = formatXml(fixture.input, getTestConfig({
            formatAttributes: true,
            maxLineLength: 80
        }));
        assert.strictEqual(result, fixture.expected);
    });
});