#!/bin/bash
make .js.dev;
make src/psl.min.js;
make dist/options.html
make dist/notes.html
cp -r assets/ dist/assets
