import * as assert from 'assert';
import { XmlFormatter } from '../../formatters/xmlFormatter';
import { getTestConfig } from '../testConfig';
import { loadFixture } from '../utils/fixtureLoader';

suite('Comment Preservation Test Suite', () => {
    test('Should preserve comments when preserveComments is true', () => {
        const fixture = loadFixture('comments', 'preserveComments');
        const formatter = new XmlFormatter(getTestConfig({ preserveComments: true }));
        const result = formatter.formatXml(fixture.input);

        assert.ok(result.includes('<!-- This is a comment -->'), 'Should preserve first comment');
        assert.ok(result.includes('<!-- Field comment -->'), 'Should preserve second comment');
    });

    test('Should remove comments when preserveComments is false', () => {
        const fixture = loadFixture('comments', 'removeComments');
        const formatter = new XmlFormatter(getTestConfig({ preserveComments: false }));
        const result = formatter.formatXml(fixture.input);

        assert.ok(!result.includes('<!-- This is a comment -->'), 'Should remove first comment');
        assert.ok(!result.includes('<!-- Field comment -->'), 'Should remove second comment');
        assert.ok(result.includes('<record'), 'Should preserve record element');
        assert.ok(result.includes('<field'), 'Should preserve field element');
    });

    test('Should preserve multi-line comments', () => {
        const fixture = loadFixture('comments', 'multiLineComments');
        const formatter = new XmlFormatter(getTestConfig({ preserveComments: true }));
        const result = formatter.formatXml(fixture.input);

        assert.ok(result.includes('Multi-line comment'), 'Should preserve multi-line comment content');
    });

    test('Should preserve comments at different positions', () => {
        const fixture = loadFixture('comments', 'differentPositions');
        const formatter = new XmlFormatter(getTestConfig({ preserveComments: true }));
        const result = formatter.formatXml(fixture.input);

        assert.ok(result.includes('Top-level comment'), 'Should preserve top-level comment');
        assert.ok(result.includes('Inline comment'), 'Should preserve inline comment');
        assert.ok(result.includes('Bottom comment'), 'Should preserve bottom comment');
    });

    test('Default should preserve comments', () => {
        const fixture = loadFixture('comments', 'defaultBehavior');
        const formatter = new XmlFormatter(getTestConfig()); // Use default config
        const result = formatter.formatXml(fixture.input);

        assert.ok(result.includes('<!-- Comment -->'), 'Default behavior should preserve comments');
    });
});
