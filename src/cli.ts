#!/bin/env node
import yargs, { Argv } from "yargs";

import { convert } from "./utils";

const cli = yargs(process.argv.slice(2))
  .scriptName("html2pug-glob")
  .command(
    "$0 <file..>",
    "Convert HTML file to Pug / Jade",
    (yargs: Argv) => {
      yargs
        .positional("file", {
          type: "string",
          describe: "Files to convert",
        })
        .option("output", {
          type: "string",
          alias: "o",
          description:
            "Output file names, ignored when multiple files is given",
        })
        .option("output-dir", {
          type: "string",
          alias: "d",
          description: "Output directory",
          default: ".",
        })
        .option("ext", {
          type: "string",
          description: "Extension of generated files.",
          default: "pug",
        });
    },
    convert
  )
  .help()
  .alias("h", "help")
  .version()
  .alias("v", "version").argv;
