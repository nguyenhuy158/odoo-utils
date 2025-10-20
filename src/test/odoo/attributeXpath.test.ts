import * as assert from 'assert';
import { formatXml } from '../../formatters/xmlFormatter';

suite('Odoo Attribute XPath Test Suite', () => {
    test('Should format attribute tag with long attrs value correctly', () => {
        const input = `<?xml version="1.0" encoding="utf-8"?>
<odoo>

    <record id="account_move_pair_form" model="ir.ui.view">
        <field name="name">account.move.pair.form</field>
        <field name="model">account.move.pair</field>
        <field name="inherit_id" ref="farmnet_fulfillment.account_move_pair_form" />
        <field name="arch" type="xml">
            <xpath expr="//button[@name='action_close']" position="before">
                <field name="is_return" invisible="1" />
            </xpath>
            <xpath expr="//button[@name='action_close']" position="attributes">
                <attribute name="attrs">{'invisible': ['|', '|', '|', '|', ('is_return', '=', True), ('is_hide_related', '=', True), ('bill_state', 'not in', ['replacement', 'adjustment']), ('state', '!=', 'invoice'), ('invoice_id', '=', True)]}</attribute>
            </xpath>
            <xpath expr="//button[@name='push_sale_order_to_netsuite']" position="attributes">
                <attribute name="attrs">{'invisible': ['|', '|', ('is_return', '=', True), ('sale_netsuite_ref', '!=', False), ('state', '!=', 'invoice_process')]}</attribute>
            </xpath>
            <xpath expr="//button[@name='action_get_invoice_ref']" position="attributes">
                <attribute name="attrs">{'invisible': ['|', '|', '|', '|', ('is_return', '=', True), ('state', '!=', 'invoice_process'), ('invoice_id', '=', False), ('invoice_ref', '!=', False), ('invoice_ref_date', '!=', False)]}</attribute>
            </xpath>
        </field>
    </record>

</odoo>`;

        const result = formatXml(input, {
            indentSize: 4
        });

        // Should preserve XML declaration
        assert.ok(result.includes('<?xml version="1.0" encoding="utf-8"?>'), 'Should preserve XML declaration');

        // Should contain all xpath elements
        assert.ok(result.includes('<xpath expr="//button[@name=\'action_close\']" position="before">'),
            'Should have first xpath with before position');
        assert.ok(result.includes('<xpath expr="//button[@name=\'action_close\']" position="attributes">'),
            'Should have second xpath with attributes position');

        // Should contain attribute tags with name="attrs"
        const attributeMatches = result.match(/<attribute name="attrs">/g);
        assert.strictEqual(attributeMatches?.length, 3, 'Should have exactly 3 attribute tags');

        // Should preserve the long attrs value without breaking it
        assert.ok(result.includes("{'invisible': ['|', '|', '|', '|', ('is_return', '=', True)"),
            'Should preserve long attrs value');

        // Should have proper closing tags
        assert.ok(result.includes('</attribute>'), 'Should have closing attribute tags');
        assert.ok(result.includes('</xpath>'), 'Should have closing xpath tags');
        assert.ok(result.includes('</field>'), 'Should have closing field tag');
        assert.ok(result.includes('</record>'), 'Should have closing record tag');
    });

    test('Should handle attribute tag with shorter attrs value', () => {
        const input = `<odoo>
    <record id="test_view" model="ir.ui.view">
        <field name="arch" type="xml">
            <xpath expr="//button[@name='submit']" position="attributes">
                <attribute name="attrs">{'invisible': [('state', '=', 'done')]}</attribute>
            </xpath>
        </field>
    </record>
</odoo>`;

        const result = formatXml(input, {
            indentSize: 4
        });

        // Should contain the attribute tag with shorter value
        assert.ok(result.includes('<attribute name="attrs">'), 'Should have attribute tag');
        assert.ok(result.includes("{'invisible': [('state', '=', 'done')]}"),
            'Should preserve short attrs value');
        assert.ok(result.includes('</attribute>'), 'Should have closing attribute tag');
    });

    test('Should handle multiple attribute tags in single xpath', () => {
        const input = `<odoo>
    <record id="test_view" model="ir.ui.view">
        <field name="arch" type="xml">
            <xpath expr="//button[@name='action']" position="attributes">
                <attribute name="attrs">{'invisible': [('state', '=', 'draft')]}</attribute>
                <attribute name="class">btn-primary</attribute>
                <attribute name="string">Execute Action</attribute>
            </xpath>
        </field>
    </record>
</odoo>`;

        const result = formatXml(input, {
            indentSize: 4
        });

        // Should contain all three attribute tags
        const attributeMatches = result.match(/<attribute name=/g);
        assert.ok(attributeMatches && attributeMatches.length >= 3,
            'Should have at least 3 attribute tags');

        // Should preserve all attribute values
        assert.ok(result.includes("{'invisible': [('state', '=', 'draft')]}"),
            'Should preserve attrs value');
        assert.ok(result.includes('btn-primary'), 'Should preserve class value');
        assert.ok(result.includes('Execute Action'), 'Should preserve string value');
    });

    test('Should handle nested xpath with attribute tags', () => {
        const input = `<odoo>
    <record id="complex_view" model="ir.ui.view">
        <field name="arch" type="xml">
            <xpath expr="//form" position="inside">
                <xpath expr="//field[@name='partner_id']" position="attributes">
                    <attribute name="attrs">{'required': [('state', 'in', ['confirmed', 'done'])]}</attribute>
                </xpath>
            </xpath>
        </field>
    </record>
</odoo>`;

        const result = formatXml(input, {
            indentSize: 4
        });

        // Should preserve nested structure
        assert.ok(result.includes('<xpath expr="//form" position="inside">'),
            'Should have outer xpath');
        assert.ok(result.includes('<xpath expr="//field[@name=\'partner_id\']" position="attributes">'),
            'Should have inner xpath');
        assert.ok(result.includes('<attribute name="attrs">'), 'Should have attribute tag');
        assert.ok(result.includes("{'required': [('state', 'in', ['confirmed', 'done'])]}"),
            'Should preserve attrs value with array');
    });
});
