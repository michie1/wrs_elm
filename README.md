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
`cp -r 2020 2021`
2. Remove `wrs.js` and download latest from `https://uitslagen.wtos.nl/wrs.js`.
3. Increment year in `index.html`.
4. Use `prod/config.js` and paste the values into `config.js` temporarily.
5. Add a console.log with JSON.stringify for the races, results and riders.
6. Copy the arrays to `races.js`, `results.js` and `riders.js`.
7. Remove the console logs and revert `config.js`.
8. In `package.json` extent the `build` script for the newly added year.
9. In de `sidebar`, add link to the newly added year.
9. `npm run build`.
10. Commit & push.
11. Export firebase database as backup. Clear the firebase database.
12. Add a test rider, race & result. Verify if it works. Clear those test rows when real data is created.
