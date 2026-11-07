"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
exports.slugify = slugify;
exports.truncateText = truncateText;
function formatDate(dateString, locale = 'en-US') {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date);
}
function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
function truncateText(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return `${text.slice(0, maxLength).trim()}...`;
}
//# sourceMappingURL=formatters.js.map