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

1. Run `./new-year.sh` and continue with step 8.
2. Copy previous year:
`cd prod && cp -r 2020 2021`
3. Remove `wrs.js` and download latest from `https://uitslagen.wtos.nl/wrs.js`.
4. Increment year in title in `index.html`.
5. Use `prod/config.js` and paste the values into `config.js` temporarily.
6. In `package.json` extent the `build` script for the newly added year.
7. In de `sidebar` (`App/View.elm`), add link to the newly added year around line 114.
8. Add a console.log with JSON.stringify for the races, results and riders in `src/index.js`.
9. Copy the arrays to `prod/$previous_year/`/`races.js`, `results.js` and `riders.js`.
10. Remove the console logs, stop the `dev` server and revert `./config.js`.
11. `npm run build`.
11. Commit & push.
12. Export [firebase](https://console.firebase.google.com/u/0/project/cycling-results/database/cycling-results/data) database as backup. Clear the firebase database.
14. Add a test rider, race & result. Verify if it works. Clear those test rows when real data is created.
