import * as assert from 'assert';
import { DuplicateFunctionAnalyzer } from '../duplicateChecker';

suite('Duplicate Checker Test Suite', () => {
    let analyzer: DuplicateFunctionAnalyzer;

    setup(() => {
        analyzer = new DuplicateFunctionAnalyzer();
    });

    test('Should detect duplicate functions', () => {
        const pythonCode = `
class TestModel(models.Model):
    _name = 'test.model'

    def calculate_total(self):
        """First implementation"""
        return self.value * 1.1

    def process_data(self):
        """Process data"""
        pass

    def calculate_total(self):
        """Duplicate - second implementation"""
        return self.value * 1.2

    def calculate_total(self):
        """Duplicate - third implementation"""
        return self.value * 1.3
`;

        const functions = analyzer.findFunctions(pythonCode);
        const duplicates = analyzer.findDuplicates(functions);

        assert.strictEqual(duplicates.length, 1, 'Should find 1 duplicate function name');
        assert.strictEqual(duplicates[0].name, 'calculate_total', 'Duplicate should be calculate_total');
        assert.strictEqual(duplicates[0].occurrences.length, 3, 'calculate_total should appear 3 times');
    });

    test('Should not find duplicates when all functions are unique', () => {
        const pythonCode = `
class TestModel(models.Model):
    _name = 'test.model'

    def calculate_total(self):
        """Calculate total"""
        return self.value * 1.1

    def process_data(self):
        """Process data"""
        pass

    def validate_input(self):
        """Validate input"""
        return True
`;

        const functions = analyzer.findFunctions(pythonCode);
        const duplicates = analyzer.findDuplicates(functions);

        assert.strictEqual(functions.length, 3, 'Should find 3 functions');
        assert.strictEqual(duplicates.length, 0, 'Should not find any duplicates');
    });
});