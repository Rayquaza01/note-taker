#!/bin/bash
rm -rf ./dist
mkdir dist

npx webpack --config webpack.prod.config.js

cd psl
npx browserify ./index.js --standalone=psl > ../src/psl.js
cat ../src/psl.js | npx uglifyjs -c -m > ../src/psl.min.js
rm ../src/psl.js
cd ..

haml ./src/options/options.haml dist/options.html
haml ./src/notes/notes.haml dist/notes.html
cp -ar ./src/assets/. ./dist/

npx web-ext build -s ./dist
