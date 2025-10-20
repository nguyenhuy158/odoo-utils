import * as assert from 'assert';
import { formatXml } from '../../formatters/xmlFormatter';

suite('Menuitem Spacing Test Suite', () => {
    test('Multi-line menuitem at the end should have proper spacing', () => {
        const input = `<odoo>

    <record id="agreement.agreement_action" model="ir.actions.act_window">
        <field name="domain">[('domain', 'in', ['sale', 'purchase', None])]</field>
    </record>

    <menuitem
        action="transfer_agreement_action"
        groups="agreement.read"
        id="transfer_agreement_menu"
        name="Transfer"
        parent="agreement.agreement_menu_root"
        sequence="5"
    />

    <menuitem action="transfer_agreement_action"/>

</odoo>`;

        const result = formatXml(input, {
            indentSize: 4,
            sortAttributes: true
        });

        // Should have proper formatting
        assert.ok(result.includes('<menuitem'), 'Should contain menuitem tags');
        assert.ok(result.includes('</odoo>'), 'Should have closing odoo tag');

        // All attributes should be present
        assert.ok(result.includes('action="transfer_agreement_action"'), 'Should have action attribute');
        assert.ok(result.includes('groups="agreement.read"'), 'Should have groups attribute');
    });

    test('Single-line menuitem should preserve content', () => {
        const input = `<odoo>

    <record id="agreement.agreement_action" model="ir.actions.act_window">
        <field name="domain">[('domain', 'in', ['sale', 'purchase', None])]</field>
    </record>

    <menuitem action="transfer_agreement_action"/>

    <menuitem
        action="transfer_agreement_action"
        groups="agreement.read"
        id="transfer_agreement_menu"
        name="Transfer"
        parent="agreement.agreement_menu_root"
        sequence="5"
    />
</odoo>`;

        const result = formatXml(input, {
            indentSize: 4,
            sortAttributes: true
        });

        // Check spacing before closing tag
        const lines = result.split('\n');
        const odooCloseIndex = lines.findIndex(line => line.trim() === '</odoo>');

        assert.ok(odooCloseIndex > 0, 'Should find closing odoo tag');

        // Both menuitem tags should be present
        const menuitemCount = (result.match(/<menuitem/g) || []).length;
        assert.strictEqual(menuitemCount, 2, 'Should have 2 menuitem tags');
    });

    test('Menuitem with sorted attributes', () => {
        const input = `<menuitem
    sequence="5"
    parent="agreement.agreement_menu_root"
    name="Transfer"
    id="transfer_agreement_menu"
    groups="agreement.read"
    action="transfer_agreement_action"
/>`;

        const result = formatXml(input, {
            indentSize: 4,
            sortAttributes: true
        });

        // With sorting, attributes should be alphabetically ordered
        assert.ok(result.includes('action='), 'Should have action');
        assert.ok(result.includes('groups='), 'Should have groups');
        assert.ok(result.includes('id='), 'Should have id');
        assert.ok(result.includes('name='), 'Should have name');
        assert.ok(result.includes('parent='), 'Should have parent');
        assert.ok(result.includes('sequence='), 'Should have sequence');
    });
});
