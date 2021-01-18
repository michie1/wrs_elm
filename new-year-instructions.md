1. Add 2020 url in App/View.elm
2. Extend build coommand with 2020
3. Run `yarn make && yarn uglify`
4. Copy /prod/2019 to /prod/2020
5. Copy dist/wrs.js to /prod/2020/
6. https://console.firebase.google.com/u/0/project/cycling-results/database/cycling-results/data and export json and divide each table in its own file.
7. Convert json to js with `const race = {...`
8. Rename 2020/index.html title to 2020
9. Commit new directory and push to master.
