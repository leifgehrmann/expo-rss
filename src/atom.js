/**
 * @param {string} str
 * @returns {string}
 */
function escapeToHtml(str) {
    return str
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
}

/**
 * @param {string} title
 * @param {string} url
 * @param {Object[]} entries
 * @param {string} entries[].title
 * @param {string} entries[].url
 * @param {string} entries[].author
 * @param {Date} entries[].date
 * @returns {String}
 */
export function entriesToAtom(title, url, entries) {
    const entriesXml = entries.map((entry) => {
        return `
            <entry>
                <title>${ escapeToHtml(entry.title) }</title>
                <link href="${entry.url}"/>
                <updated>${entry.date.toISOString()}</updated>
                <author><name>${escapeToHtml(entry.author)}</name></author>
                <id>${entry.url}</id>
            </entry>
        `
    });

    return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
<title>${title}</title>
<link href="${url}/"/>
<updated>${(new Date()).toISOString()}</updated>
<id>${url}</id>
${entriesXml.join("")}
</feed>`;
}
