export function preserveBlankLinesAsComments(xml: string): string {
    const lines = xml.split('\n');
    const result: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.trim() === '') {
            let consecutiveBlankCount = 1;
            let j = i + 1;
            while (j < lines.length && lines[j].trim() === '') {
                consecutiveBlankCount++;
                j++;
            }

            if (consecutiveBlankCount > 0) {
                result.push(`<!--__BLANK_LINES_${consecutiveBlankCount}__-->`);
                i = j - 1;
            }
        } else {
            result.push(line);
        }
    }

    return result.join('\n');
}

export function restoreBlankLinesFromComments(xml: string, maximumBlankLines: number): string {
    // First, we need to handle blank lines carefully to preserve comment content
    // Extract comments temporarily to avoid processing blank lines inside them
    const commentMap = new Map<string, string>();
    let commentIndex = 0;

    // Extract comments with their content preserved exactly as-is
    let result = xml.replace(/<!--([\s\S]*?)-->/g, (match, content) => {
        const placeholder = `__TEMP_COMMENT_${commentIndex}__`;
        commentMap.set(placeholder, match);
        commentIndex++;
        return placeholder;
    });

    // Now process blank lines on content without comments
    result = result.split('\n')
        .filter(line => line.trim() !== '')
        .join('\n');

    // Restore comments with original content
    commentMap.forEach((originalComment, placeholder) => {
        result = result.replace(placeholder, originalComment);
    });

    const lines = result.split('\n');

    if (maximumBlankLines === 0) {
        const finalResult: string[] = [];

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.match(/^<!--__BLANK_LINES_(\d+)__-->$/)) {
                finalResult.push(line);
            }
        }

        return finalResult.join('\n');
    }

    const finalResult: string[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        const match = trimmed.match(/^<!--__BLANK_LINES_(\d+)__-->$/);

        if (match) {
            const originalBlankCount = parseInt(match[1], 10);
            const limitedBlankCount = Math.min(originalBlankCount, maximumBlankLines);

            for (let i = 0; i < limitedBlankCount; i++) {
                finalResult.push('');
            }
        } else {
            finalResult.push(line);
        }
    }

    return finalResult.join('\n');
}