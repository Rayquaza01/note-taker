#!/bin/bash
while getopts "apjhs" opt
do
    case "$opt"
    in
        a ) ALL=1;;
        p ) PSL=1;;
        j ) JS=1;;
        h ) HTML=1;;
        s ) ASSETS=1;;
    esac
done

if [ "$ALL" ] || [ "$PSL" ]
then
    echo "Building PSL"
    cd psl
    npx browserify ./index.js --standalone=psl > ../src/psl.js
    cat ../src/psl.js | npx uglifyjs -c -m > ../src/psl.min.js
    rm ../src/psl.js
    cd ..
fi

if [ "$ALL" ] || [ "$JS" ]
then
    echo "Building JS"
    npx webpack --config webpack.dev.config.js
fi

if [ "$ALL" ] || [ "$HTML" ]
then
    echo "Building HTML"
    haml ./src/options/options.haml dist/options.html
    haml ./src/notes/notes.haml dist/notes.html
fi

if [ "$ALL" ] || [ "$ASSETS" ]
then
    echo "Copying assets"
    cp -ar ./src/assets/. ./dist/
fi
