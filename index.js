import { JSDOM } from 'jsdom';

async function main() {
    const host = 'https://expo.dev';
    const url = host + '/changelog';
    const response = await fetch(url);
    const responseText = await response.text();
    const dom = new JSDOM(responseText);

    // "[Month] [day], [year] by"
    function parseDate(date) {
        const datePieces = date.split(' ');
        let month = 1;
        switch (datePieces[0]) {
            case 'Jan': month = 1; break;
            case 'Feb': month = 2; break;
            case 'Mar': month = 3; break;
            case 'Apr': month = 4; break;
            case 'May': month = 5; break;
            case 'Jun': month = 6; break;
            case 'Jul': month = 7; break;
            case 'Aug': month = 8; break;
            case 'Sep': month = 9; break;
            case 'Oct': month = 10; break;
            case 'Nov': month = 11; break;
            case 'Dev': month = 12; break;
        }
        const day = Number.parseInt(datePieces[1]);
        const year = Number.parseInt(datePieces[2]);
        return new Date(year, month - 1, day).toISOString();
    }

    function escapeToHtml(str) {
        return str
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('&', '&gt;');
    }

    const entries = [];

    dom.window.document.querySelectorAll('a[href*="/changelog/"] > h1').forEach((x) => {
        const title = x.textContent
        const url = host + x.parentNode.getAttribute('href')
        const date = x.parentNode.parentNode.querySelector('.text-secondary').textContent
        const author = x.parentNode.parentNode.querySelector('.font-medium').textContent
        entries.push({
            title,
            url,
            date: parseDate(date),
            author
        });
    })
    dom.window.document.querySelectorAll('a[href*="/changelog/"] > div.flex > p').forEach((x) => {
        const title = x.textContent
        const url = host + x.parentNode.parentNode.getAttribute('href')
        const date = x.parentNode.parentNode.querySelector('.text-secondary').textContent
        const author = x.parentNode.parentNode.querySelector('.text-xs.font-medium').textContent
        entries.push({
            title,
            url,
            date: parseDate(date),
            author
        });
    })

    const entriesXml = entries.map((entry) => {
        return `
            <entry>
                <title>${ escapeToHtml(entry.title) }</title>
                <link href="${entry.url}"/>
                <updated>${entry.date}</updated>
                <author><name>${escapeToHtml(entry.author)}</name></author>
                <id>${entry.url}</id>
                <content type="html">${escapeToHtml(entry.title)} by ${escapeToHtml(entry.author)}</content>
            </entry>
        `
    })
    
    const feed = `<?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">

    <title>Expo Changelog</title>
    <link href="${url}/"/>
    <updated>${(new Date()).toISOString()}</updated>
    <id>${url}</id>
    ${entriesXml.join("")}
    </feed>`;

    console.log(feed);
  }

  main().catch(console.error);