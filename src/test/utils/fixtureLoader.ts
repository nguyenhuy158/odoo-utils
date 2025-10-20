import * as fs from 'fs';
import * as path from 'path';

/**
 * Interface for test fixture data
 */
export interface TestFixture {
    input: string;
    expected: string;
    description?: string;
}

/**
 * Load a test fixture from the fixtures directory
 * @param category - The category folder (e.g., 'formatting', 'attributes')
 * @param testName - The name of the test case
 * @returns TestFixture object with input and expected strings
 */
export function loadFixture(category: string, testName: string): TestFixture {
    const fixturesDir = path.join(__dirname, '..', 'fixtures', category);

    const inputPath = path.join(fixturesDir, `${testName}-input.xml`);
    const expectedPath = path.join(fixturesDir, `${testName}-expected.xml`);

    if (!fs.existsSync(inputPath)) {
        throw new Error(`Input fixture not found: ${inputPath}`);
    }

    if (!fs.existsSync(expectedPath)) {
        throw new Error(`Expected fixture not found: ${expectedPath}`);
    }

    return {
        input: fs.readFileSync(inputPath, 'utf-8'),
        expected: fs.readFileSync(expectedPath, 'utf-8'),
        description: testName
    };
}

/**
 * Load multiple test fixtures from a category
 * @param category - The category folder
 * @param testNames - Array of test case names
 * @returns Array of TestFixture objects
 */
export function loadFixtures(category: string, testNames: string[]): TestFixture[] {
    return testNames.map(name => loadFixture(category, name));
}

/**
 * Get all available test fixtures in a category
 * @param category - The category folder
 * @returns Array of test case names
 */
export function getAvailableFixtures(category: string): string[] {
    const fixturesDir = path.join(__dirname, '..', 'fixtures', category);

    if (!fs.existsSync(fixturesDir)) {
        return [];
    }

    const files = fs.readdirSync(fixturesDir);
    const testNames = new Set<string>();

    files.forEach(file => {
        if (file.endsWith('-input.xml')) {
            const testName = file.replace('-input.xml', '');
            testNames.add(testName);
        }
    });

    return Array.from(testNames);
}
