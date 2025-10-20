import * as assert from 'assert';
import { formatXml } from '../../formatters/xmlFormatter';
import { loadFixture } from '../utils/fixtureLoader';
import { getTestConfig } from '../testConfig';

suite('closeTagOnNewLine Test Suite', () => {
    test('Short single-line tags should not be affected', () => {
        const fixture = loadFixture('formatting', 'closeTag-short');
        const result = formatXml(fixture.input, getTestConfig({
            closeTagOnNewLine: true
        }));
        assert.strictEqual(result, fixture.expected);
    });

    test('Long tags with closeTagOnNewLine=false should put /> on same line', () => {
        const fixture = loadFixture('formatting', 'closeTag-longFalse');
        const result = formatXml(fixture.input, getTestConfig({
            indentSize: 4,
            maxLineLength: 80,
            closeTagOnNewLine: false
        }));
        assert.strictEqual(result, fixture.expected);
    });

    test('Long tags with closeTagOnNewLine=true should put /> on new line', () => {
        const fixture = loadFixture('formatting', 'closeTag-longTrue');
        const result = formatXml(fixture.input, getTestConfig({
            indentSize: 4,
            maxLineLength: 80,
            closeTagOnNewLine: true
        }));
        assert.strictEqual(result, fixture.expected);
    });

    test('Tags with closing tag should not be affected', () => {
        const fixture = loadFixture('formatting', 'closeTag-withContent');
        const result = formatXml(fixture.input, getTestConfig({
            closeTagOnNewLine: true
        }));
        assert.strictEqual(result, fixture.expected);
    });

    test('Multiple long attributes should be formatted correctly', () => {
        const fixture = loadFixture('formatting', 'closeTag-multipleAttrs');
        const result = formatXml(fixture.input, getTestConfig({
            indentSize: 4,
            maxLineLength: 80,
            closeTagOnNewLine: true
        }));
        assert.strictEqual(result, fixture.expected);
    });

    test('Indentation should be correct for closing tag', () => {
        const fixture = loadFixture('formatting', 'closeTag-indentation');
        const result = formatXml(fixture.input, getTestConfig({
            maxLineLength: 60,
            closeTagOnNewLine: true
        }));
        assert.strictEqual(result, fixture.expected);
    });

    test('Opening tags (not self-closing) with closeTagOnNewLine=false should have > on same line', () => {
        const fixture = loadFixture('formatting', 'closeTag-openingFalse');
        const result = formatXml(fixture.input, getTestConfig({
            indentSize: 4,
            maxLineLength: 80,
            closeTagOnNewLine: false
        }));
        assert.strictEqual(result, fixture.expected);
    });

    test('Opening tags (not self-closing) with closeTagOnNewLine=true should have > on new line', () => {
        const fixture = loadFixture('formatting', 'closeTag-openingTrue');
        const result = formatXml(fixture.input, getTestConfig({
            indentSize: 4,
            maxLineLength: 80,
            closeTagOnNewLine: true
        }));
        assert.strictEqual(result, fixture.expected);
    });
});