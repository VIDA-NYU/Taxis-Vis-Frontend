export function maybeQuoteIdentifier(name) {
    const identRegex = /^[A-Za-z_][A-Za-z0-9_]*$/;
    if (identRegex.test(name)) {
        return name;
    } else {
        const escaped = name.replace(/"/g, '""');
        return `"${escaped}"`;
    }
}
