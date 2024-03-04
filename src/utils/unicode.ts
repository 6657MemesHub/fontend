export function stringToUnicode(str: string): string {
    return str
        .split('')
        .map((char: string) => {
            const codePoint = char.codePointAt(0) ?? 0;
            if (codePoint >= 32 && codePoint <= 127) {
                return char;
            } else {
                return '\\u' + codePoint.toString(16).padStart(4, '0');
            }
        })
        .join('');
}
