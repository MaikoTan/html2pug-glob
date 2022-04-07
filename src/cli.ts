import path from "path";

import fs from "fs-extra";
import glob from "fast-glob";
import yargs, { ArgumentsCamelCase, Argv } from "yargs";

import * as pug from "./utils";

interface Options {
  file?: string;
  output?: string;
  o?: string;
  "output-dir"?: string;
  d?: string;
}

export const handler = async (argv: ArgumentsCamelCase<Options>) => {
  const { file } = argv;

  if (!file) {
    throw new Error("Invalid file path: " + file);
  }

  const files = await glob(file, { dot: true });
  if (files.length === 1) {
    // if there is only one file, then the |output| option should functional.
    let output = argv.output || pugName(files[0]);
    if (argv.outputDir) {
      output = path.join(argv.outputDir, path.basename(output));
    }
    await convert(files[0], output);
  } else {
    // otherwise the |output-dir| option should functional.
    const outputDir = argv.outputDir || ".";
    await Promise.all(
      files.map(async (file) => {
        convert(file, path.join(outputDir, pugName(file)));
      })
    );
  }
};

const cli = yargs(process.argv.slice(2))
  .scriptName("html2pug-glob")
  .command(
    "$0 <file..>",
    "Convert HTML file to Pug",
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
        });
    },
    handler
  )
  .help()
  .alias("h", "help")
  .version()
  .alias("v", "version").argv;

const pugName = (file: string) =>
  path.join(path.parse(file).dir, path.basename(file, ".html") + ".pug");

/**
 * convert html to pug
 */
export const convert = async (file: string, output: string) => {
  if (file) {
    const pugText = await pug.fromHtmlFile(file);
    await fs.outputFile(output, pugText);
  } else {
    throw new Error(`${file} is not a valid file name`);
  }
};
