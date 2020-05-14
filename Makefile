all:
	echo ""

clean:
	rm -rf dist/
	rm .js.dev .js

src/psl.min.js: psl/index.js
	./scripts/updatepsl.sh

dist/options.html: src/options/options.haml | dist
	haml src/options/options.haml dist/options.html

dist/notes.html: src/notes/notes.haml | dist
	haml src/notes/notes.haml dist/notes.html

.js.dev: $(wildcard src/**/*.js) | dist
	npx webpack --config webpack.dev.config.js
	touch .js.dev

.js: src/notes/notes.js src/options/options.js src/psl.min.js | dist
	npx webpack --config webpack.prod.config.js
	touch .js

dist:
	mkdir dist
