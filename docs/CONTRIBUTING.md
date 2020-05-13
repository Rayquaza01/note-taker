# Contributing

If you would like to contribute code, please submit a Pull Request with the changes you would like to make.

Please use [eslint](https://eslint.org/) to ensure your code is in a similar style to the rest before submitting your PR. A `eslintrc.json` file is included in the repo.

I will likely merge your PR if it works as intended and does not break other features.

# Translation / i18n

The current english text is in ./extension/\_locales/en-US/messages.csv

The file has 3 columns:

1. The id of the text. Must remain the same for all languages.
2. The actual text. Must be translated.
3. A description of the text. May contain translations notes, or be left alone.

The translated file should be stored in ./extension/\_locales/{COUNTRY CODE}/messages.csv for the pull request.

## Building Translation File

Run `npm run build:i18n {COUNTRY CODE}` to build the messages.json. Ex: `npm run build:i18n en-US`
