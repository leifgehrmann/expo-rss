import { JSDOM } from 'jsdom';
import { entriesToAtom } from '../src/atom.js';
import { shouldOutput } from '../src/scheduleCheck.js';

// Articles are subtitled with the date in the following format:
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
        case 'Dec': month = 12; break;
    }
    const day = Number.parseInt(datePieces[1]);
    const year = Number.parseInt(datePieces[2]);
    return new Date(year, month - 1, day);
}

async function main() {
    const host = 'https://expo.dev';
    const url = host + '/changelog';

    const response = await fetch(url);
    const responseText = await response.text();
    const dom = new JSDOM(responseText);

    const entries = [];

    // The following query selectors are very brittle, but that's because
    // Expo's website doesn't use semantic HTML.
    // Large headings
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
    // Small headings
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

    if (shouldOutput(entries)) {
        const feed = entriesToAtom(
            'Expo Changelog',
            url,
            entries
        );
    
        console.log(feed);
    }
}

main();
