import * as assert from 'assert';
import { XmlFormatter } from '../../formatters/xmlFormatter';
import { getTestConfig } from '../testConfig';

suite('Maximum Blank Lines Test Suite', () => {
    test('Should limit consecutive blank lines to maximum (1)', () => {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<root>
    <item>First</item>


    <item>Second</item>
</root>`;

        const formatter = new XmlFormatter(getTestConfig({
            maximumBlankLines: 1
        }));
        const result = formatter.formatXml(xml);

        // Should have at most 1 blank line between items
        const lines = result.split('\n');
        let consecutiveBlankLines = 0;
        let maxConsecutive = 0;

        for (const line of lines) {
            if (line.trim() === '') {
                consecutiveBlankLines++;
                maxConsecutive = Math.max(maxConsecutive, consecutiveBlankLines);
            } else {
                consecutiveBlankLines = 0;
            }
        }

        assert.strictEqual(maxConsecutive, 1, 'Should have at most 1 consecutive blank line');
    });

    test('Should allow 2 consecutive blank lines when maximumBlankLines is 2', () => {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<root>
    <item>First</item>




    <item>Second</item>
</root>`;

        const formatter = new XmlFormatter(getTestConfig({
            maximumBlankLines: 2
        }));
        const result = formatter.formatXml(xml);

        const lines = result.split('\n');
        let consecutiveBlankLines = 0;
        let maxConsecutive = 0;

        for (const line of lines) {
            if (line.trim() === '') {
                consecutiveBlankLines++;
                maxConsecutive = Math.max(maxConsecutive, consecutiveBlankLines);
            } else {
                consecutiveBlankLines = 0;
            }
        }

        assert.strictEqual(maxConsecutive, 2, 'Should have at most 2 consecutive blank lines');
    });

    test('Should remove all blank lines when maximumBlankLines is 0', () => {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<root>
    <item>First</item>


    <item>Second</item>

    <item>Third</item>
</root>`;

        const formatter = new XmlFormatter(getTestConfig({
            maximumBlankLines: 0
        }));
        const result = formatter.formatXml(xml);

        // Split and filter out the last empty line (from trailing newline)
        const lines = result.split('\n').slice(0, -1);
        let hasBlankLine = false;

        for (const line of lines) {
            if (line.trim() === '') {
                hasBlankLine = true;
                break;
            }
        }

        assert.strictEqual(hasBlankLine, false, 'Should have no blank lines');
    });

    test('Should handle multiple sections with excessive blank lines', () => {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<root>
    <section1>


        <item>A</item>


        <item>B</item>


    </section1>



    <section2>



        <item>C</item>


    </section2>
</root>`;

        const formatter = new XmlFormatter(getTestConfig({
            maximumBlankLines: 1
        }));
        const result = formatter.formatXml(xml);

        const lines = result.split('\n');
        let consecutiveBlankLines = 0;
        let maxConsecutive = 0;

        for (const line of lines) {
            if (line.trim() === '') {
                consecutiveBlankLines++;
                maxConsecutive = Math.max(maxConsecutive, consecutiveBlankLines);
            } else {
                consecutiveBlankLines = 0;
            }
        }

        assert.strictEqual(maxConsecutive, 1, 'Should have at most 1 consecutive blank line in any section');
    });

    test('Should work with complex nested structures', () => {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <data>


        <record id="test1" model="test.model">


            <field name="name">Test 1</field>


        </record>


        <record id="test2" model="test.model">
            <field name="name">Test 2</field>
        </record>


    </data>
</odoo>`;

        const formatter = new XmlFormatter(getTestConfig({
            maximumBlankLines: 1
        }));
        const result = formatter.formatXml(xml);

        const lines = result.split('\n');
        let consecutiveBlankLines = 0;
        let maxConsecutive = 0;

        for (const line of lines) {
            if (line.trim() === '') {
                consecutiveBlankLines++;
                maxConsecutive = Math.max(maxConsecutive, consecutiveBlankLines);
            } else {
                consecutiveBlankLines = 0;
            }
        }

        assert.strictEqual(maxConsecutive, 1, 'Should have at most 1 consecutive blank line');
    });
});
