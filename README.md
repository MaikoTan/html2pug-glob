# html2pug-glob

Convert HTML to Pug, supports file glob.

## Install

```sh
$ yarn add html2pug-glob
# Or you can use npm to install it:
$ npm install html2pug-glob
```

## Usage

Just simply type:

```sh
# Convert one HTML file
$ html2pug-glob index.html
# Or use glob
$ html2pug-glob **/*.html
# With specified output file name
$ html2pug-glob index.html -o index.pug
# With specified output directory
$ html2pug-glob index.html -o ./out
# Convert multiple files with specified output directory
$ html2pug-glob **/*.html -o ./out
```

### Options

Type `html2pug-glob --help` to see more options.

```sh
$ html2pug-glob --help

html2pug-glob <file..>

Convert HTML file to Pug

Positionals:
  file  Files to convert                                                [string]

Options:
  -o, --output      Output file names, ignored when multiple files is given
                                                                        [string]
  -d, --output-dir  Output directory                                    [string]
  -h, --help        Show help                                          [boolean]
  -v, --version     Show version number                                [boolean]
```

You can also pass [`fast-glob`](https://www.npmjs.com/package/fast-glob#options-3) options via cli.

For example:

```sh
$ html2pug-glob --cwd ./src --dot **/*.html
```

## License

This project is under the [MIT License](./LISENCE).
