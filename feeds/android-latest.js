import { JSDOM } from 'jsdom';
import { entriesToAtom } from '../src/atom.js';
import { shouldOutput } from '../src/scheduleCheck.js';

// Articles are subtitled with the date in the following format:
// "[Day] [Month] [Year]"
function parseDate(date) {
    const datePieces = date.split(' ');
    let month = 1;
    switch (datePieces[1]) {
        case 'January':   month = 1; break;
        case 'February':  month = 2; break;
        case 'March':     month = 3; break;
        case 'April':     month = 4; break;
        case 'May':       month = 5; break;
        case 'June':      month = 6; break;
        case 'July':      month = 7; break;
        case 'August':    month = 8; break;
        case 'September': month = 9; break;
        case 'October':   month = 10; break;
        case 'November':  month = 11; break;
        case 'December':  month = 12; break;
    }
    const day = Number.parseInt(datePieces[0]);
    const year = Number.parseInt(datePieces[2]);
    return new Date(year, month - 1, day);
}

async function main() {
    const url = 'https://android-developers.googleblog.com/search/label/latest';

    const response = await fetch(url);
    const responseText = await response.text();
    const dom = new JSDOM(responseText);

    const entries = [];

    dom.window.document.querySelectorAll('.adb-card').forEach((x) => {
        const title = x.querySelector('.adb-card__title').textContent.trim();
        const date = x.querySelector('.adb-card__info').textContent.trim();
        const url = x.querySelector('.adb-card__href').getAttribute('href');
        const author = 'Android Developers'
        entries.push({
            title,
            url,
            date: parseDate(date),
            author
        });
    })

    if (shouldOutput()) {
        const feed = entriesToAtom(
            'Android Developers - Latest',
            url,
            entries
        );
    
        console.log(feed);
    }
}

main();
