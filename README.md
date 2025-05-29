# Custom RSS Feeds

Many websites don't have an RSS feed to follow the news. Or if they do, they are filled with marketing junk and AI hype. This repostory is a collection of scripts I've collected over time that generate RSS feeds for some useful website online. Updates daily.

| Website | RSS Feed |
|---------|----------|
| [Expo Changelog](https://expo.dev/changelog) | [expo-changelog.xml](https://custom-rss-feeds.leifgehrmann.com/expo-changelog.xml) |
| [Android Developer Blog – Latest](https://android-developers.googleblog.com/search/label/latest) | [android-latest.xml](https://custom-rss-feeds.leifgehrmann.com/android-latest.xml) |

## Development

This project requires Node.js be installed.

```shell
npm ci
node feeds/expo-changelog.js > expo-changelog.xml
node feeds/android-latest.js > android-latest.xml
```
