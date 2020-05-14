#!/bin/bash
make .js.dev;
make src/psl.min.js;
make dist/options.html
make dist/notes.html
cp -ar assets/. dist/

npx web-ext build -s ./dist
