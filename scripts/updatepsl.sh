#!/bin/bash

cd psl
npx browserify ./index.js --standalone=psl > ../src/psl.js
cat ../src/psl.js | npx uglifyjs -c -m > ../src/psl.min.js
rm ../src/psl.js
