import * as assert from 'assert';
import { XmlFormatter } from '../../formatters/xmlFormatter';
import { getTestConfig } from '../testConfig';
import { loadFixture } from '../utils/fixtureLoader';

suite('Complex XPath with Comments Test Suite', () => {
    test('Should preserve blank lines between records and handle xpath with comments correctly', () => {
        const fixture = loadFixture('odoo', 'complexXpathWithComments');
        const formatter = new XmlFormatter(getTestConfig({
            maximumBlankLines: 2,
            preserveComments: true
        }));
        const result = formatter.formatXml(fixture.input);
        assert.strictEqual(result, fixture.expected);
    });
});
