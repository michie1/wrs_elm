# Installation

Prerequisites:
 * Node LTS
 * Yarn LTS

Get code:

```sh
git clone https://github.com/michie1/wrs_elm &&
cd wrs_elm
```

Install dependencies:

```sh
yarn

```

Run dev mode:

```sh
yarn dev
```

Test:

```sh
yarn test
```

Check [http://localhost:8080](http://localhost:8080)

## Update for new year

1. Copy previous year:
`cd prod && cp -r 2020 2021`
2. Remove `wrs.js` and download latest from `https://uitslagen.wtos.nl/wrs.js`.
3. Increment year in title in `index.html`.
4. Use `prod/config.js` and paste the values into `config.js` temporarily.
5. Add a console.log with JSON.stringify for the races, results and riders in `src/index.js`.
6. Copy the arrays to `prod/year/`/`races.js`, `results.js` and `riders.js`.
7. Remove the console logs and revert `config.js`.
8. In `package.json` extent the `build` script for the newly added year.
9. In de `sidebar` (`App/View.elm`), add link to the newly added year around line 114.
10. `npm run build`.
11. Commit & push.
12. Export [firebase](https://console.firebase.google.com/u/0/project/cycling-results/database/cycling-results/data) database as backup. Clear the firebase database.
13. Put `{ "races": { }, "results": { }, "riders": { } }` in `empty.json` and import it into the database.
14. Add a test rider, race & result. Verify if it works. Clear those test rows when real data is created.
