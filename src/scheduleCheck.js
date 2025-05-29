/**
 * @param {Date} d1 
 * @param {Date} d2 
 * @returns {string}
 */
function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

/**
 * @returns {boolean}
 */
function isRunningInScheduledGitHubAction() {
    return process.argv[2] === 'schedule';
}

/**
 * @param {Object[]} entries
 * @param {Date} entries[].date
 * @returns {boolean}
 */
function hasNewItemsFromYesterday(entries) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return entries.filter((entry) => sameDay(entry.date, yesterday)).length > 0;
}

/**
 * When running inside a scheduled GitHub action, we only want to output
 * a file if there was a new post from yesterday. This is to avoid
 * unnecessary commits to the gh-pages branch every day. We check
 * yesterday because if we checked today we might miss out on posts that
 * are published later today.
 * 
 * If not inside a scheduled GitHub action, we'll always want to output.
 *
 * @param {Object[]} entries
 * @param {Date} entries[].date
 * @returns {boolean}
 */
export function shouldOutput(entries) {
    return !isRunningInScheduledGitHubAction() ||
        hasNewItemsFromYesterday(entries);
}
