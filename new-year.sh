#!/bin/bash

current_year=$(date +%Y)
year_minus_two=$((current_year - 2))
year_minus_one=$((current_year - 1))

cd prod
cp -r $year_minus_two $year_minus_one
cd $year_minus_one
curl https://uitslagen.wtos.nl/wrs.js > wrs.js
sed -i "s/<title>\(.*\)${year_minus_two}\(.*\)<\/title>/<title>\1${year_minus_one}\2<\/title>/" index.html
cd ../
(awk 'NR==1' ../config.js && awk 'NR==2, NR==8' config.js && awk 'NR==9' ../config.js) > tmp-config.js
mv tmp-config.js ../config.js
sed -i "9 s/..$/ \&\& cp -r prod\/${year_minus_one} dist\",/" package.json
sed -i "/${year_minus_two}/{h;G}" src/App/View.el
sed -i "0,/${year_minus_two}/{s/${year_minus_two}/${year_minus_one}/g}" src/App/View.elm
yarn dev
