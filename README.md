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
npm install --legacy-peer-deps
npm install -g elm
npm run make
```

Run dev mode:

```sh
npm run dev
```

Test:

```sh
npm run test
```

Check [http://localhost:8080](http://localhost:8080)

## Update for new year

1. Run `node scripts/new-year.js [--year <year>]`.
   - Copies the last archived prod folder, updates the year specific `index.html`, downloads the latest `wrs.js`, switches `config.js` to the production credentials (a backup is stored in `.config.dev.backup.js`), extends the `package.json` build script and inserts the new link into the Elm sidebar.
2. Export the Firebase data into the new prod folder:
   ```
   node scripts/export-year-data.js [--year <year>]
   ```
3. Restore your local dev credentials by copying `.config.dev.backup.js` back to `config.js`.
4. `npm run build`.
5. Commit & push.
6. Export [firebase](https://console.firebase.google.com/u/0/project/cycling-results/database/cycling-results/data) database as backup. Clear the firebase database.
7. Add a test rider, race & result. Verify if it works. Clear those test rows when real data is created.
