export function removeComments(xml: string): string {
    let result = xml.replace(/<!--[\s\S]*?-->/g, '');
    return result;
}