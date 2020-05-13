Note Taker Build Instructions

./extension/third-party/psl.min.js is from https://github.com/wrangr/psl/blob/v1.1.31/dist/psl.min.js

./psl-1.1.31/ is from https://github.com/wrangr/psl/releases/tag/v1.1.31
(The package.json was slightly modified to disable the prebuild script.
This is because the prebuild script downloads the current version of the Public Suffix List and
adds it to the file, which is not wanted if the built file needs to be the same every time.)

To Build:
In ./psl-1.1.31/, run `npm install` and `npm run build`
The built file is in ./psl-1.1.31/dist/psl.min.js
