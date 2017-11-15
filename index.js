const fs = require("fs-extra");

fs.copy("./node_modules/mdi", "./extension/third-party/mdi");
fs.copy("./node_modules/psl/dist/psl.min.js", "./extension/third-party/psl.min.js");
