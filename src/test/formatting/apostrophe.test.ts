import * as assert from 'assert';
import { formatXml } from '../../formatters/xmlFormatter';
import { getTestConfig } from '../testConfig';
import { loadFixture } from '../utils/fixtureLoader';

suite('Apostrophe and Quote Handling Test Suite', () => {
    test('Should preserve apostrophes in XPath expressions', () => {
        const fixture = loadFixture('formatting', 'apostrophe-xpath');
        const result = formatXml(fixture.input, getTestConfig());

        // Should NOT convert ' to &apos; in double-quoted attributes
        assert.ok(!result.includes('&apos;'), 'Result should not contain &apos; entities');
        assert.ok(result.includes("[@name='partner_id']"), 'Should preserve single quotes in XPath');
    });

    test('Should preserve quotes in Odoo domain expressions', () => {
        const fixture = loadFixture('formatting', 'apostrophe-domain');
        const result = formatXml(fixture.input, getTestConfig());

        assert.ok(!result.includes('&apos;'), 'Should not contain &apos; entities');
        assert.ok(result.includes("('name'"), 'Should preserve single quotes in domain');
    });

    test('Should handle mixed quotes in text content', () => {
        const fixture = loadFixture('formatting', 'apostrophe-mixed');
        const result = formatXml(fixture.input, getTestConfig());

        assert.ok(!result.includes('&apos;'), 'Should not contain &apos; entities');
        assert.ok(!result.includes('&quot;'), 'Should not contain &quot; entities');
        assert.ok(result.includes("It's a \"test\" value"), 'Should preserve mixed quotes');
    });

    test('Should preserve special characters in complex Odoo XML', () => {
        const fixture = loadFixture('formatting', 'apostrophe-complex');
        const result = formatXml(fixture.input, getTestConfig());

        assert.ok(!result.includes('&apos;'), 'Should not contain &apos; entities');
        assert.ok(result.includes("[@name='partner_id']"), 'Should preserve XPath syntax');
        assert.ok(result.includes('invisible="1"'), 'Should preserve attribute format');
    });

    test('Should handle both double and single quotes in different contexts', () => {
        const fixture = loadFixture('formatting', 'apostrophe-both-quotes');
        const result = formatXml(fixture.input, getTestConfig());

        assert.ok(!result.includes('&apos;'), 'Should not contain &apos; entities');
        assert.ok(!result.includes('&quot;'), 'Should not contain &quot; entities');
        assert.ok(result.includes("('state'"), 'Should preserve single quotes in first domain');
        assert.ok(result.includes('("type"'), 'Should preserve double quotes in second domain');
    });
});
