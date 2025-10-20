export interface FunctionInfo {
    name: string;
    startLine: number;
    endLine: number;
    definition: string;
}

export interface DuplicateFunction {
    name: string;
    occurrences: FunctionInfo[];
}

/**
 * Core logic for finding and analyzing duplicate functions in Python files
 */
export class DuplicateFunctionAnalyzer {
    /**
     * Parse Python file and find all function definitions
     */
    public findFunctions(content: string): FunctionInfo[] {
        const functions: FunctionInfo[] = [];
        const lines = content.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();

            // Check for function definition (def function_name)
            const functionMatch = trimmedLine.match(/^def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);

            if (functionMatch) {
                const functionName = functionMatch[1];
                const startLine = i;

                // Find the end of the function by looking for next function or class at same indentation level
                const indentLevel = line.length - line.trimStart().length;
                let endLine = startLine;

                for (let j = i + 1; j < lines.length; j++) {
                    const nextLine = lines[j];
                    const nextTrimmed = nextLine.trim();

                    // Skip empty lines and comments
                    if (!nextTrimmed || nextTrimmed.startsWith('#')) {
                        continue;
                    }

                    const nextIndentLevel = nextLine.length - nextLine.trimStart().length;

                    // If we find a line with same or less indentation that starts with def/class, function ends
                    if (nextIndentLevel <= indentLevel &&
                        (nextTrimmed.startsWith('def ') || nextTrimmed.startsWith('class '))) {
                        endLine = j - 1;
                        break;
                    }

                    endLine = j;
                }

                // Get function definition (first few lines for comparison)
                const functionLines = lines.slice(startLine, Math.min(startLine + 5, endLine + 1));
                const definition = functionLines.join('\n').trim();

                functions.push({
                    name: functionName,
                    startLine,
                    endLine,
                    definition
                });
            }
        }

        return functions;
    }

    /**
     * Find duplicate functions in a list of functions
     */
    public findDuplicates(functions: FunctionInfo[]): DuplicateFunction[] {
        const functionMap = new Map<string, FunctionInfo[]>();

        // Group functions by name
        for (const func of functions) {
            if (!functionMap.has(func.name)) {
                functionMap.set(func.name, []);
            }
            functionMap.get(func.name)!.push(func);
        }

        // Find duplicates
        const duplicates: DuplicateFunction[] = [];
        for (const [name, occurrences] of functionMap) {
            if (occurrences.length > 1) {
                duplicates.push({
                    name,
                    occurrences
                });
            }
        }

        return duplicates;
    }
}