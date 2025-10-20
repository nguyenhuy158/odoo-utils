import * as assert from 'assert';
import { XmlFormatter } from '../../formatters/xmlFormatter';
import { loadFixture } from '../utils/fixtureLoader';
import { getTestConfig } from '../testConfig';

suite('Close Tag New Line Test Suite', () => {
    test('Should put closing tag on new line when closeTagOnNewLine is true', () => {
        const fixture = loadFixture('formatting', 'closeTagNewLine');
        const formatter = new XmlFormatter(getTestConfig());
        const result = formatter.formatXml(fixture.input);
        assert.strictEqual(result, fixture.expected);
    });
});