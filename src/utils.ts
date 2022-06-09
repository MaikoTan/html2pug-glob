import path from "path";

import fs from "fs-extra";
import glob, { Options as GlobOptions } from "fast-glob";
import html2pug from "html2pug";
import { ArgumentsCamelCase } from "yargs";

/**
 * convert HTML to pug
 */
export function fromHtml(html: string): string {
  const badPug = html2pug(html);
  return fixupHtml2pugErrorIndent(badPug);
}

export async function fromHtmlFile(file: string): Promise<string> {
  const content = await fs.readFile(file, "utf8");
  return fromHtml(content);
}

/**
 * This function would do the fix for the following issue of html2pug:
 *
 * Consider we have an html structure like this:
 * ```html
 * <div>
 *   some text
 *   <em>other text</em>
 * </div>
 * ```
 * And then html2pug convert it to pug structure like this:
 * ```pug
 * div
 *   |
 * some text
 *   em other text
 * ```
 * So that the pug parser report errors like indentation not match.
 *
 * This function would detect the '|' and the following newline,
 * so delete the newline that break all the things.
 */
function fixupHtml2pugErrorIndent(badPug: string): string {
  return badPug.replace(/\| \n/g, "| ");
}

export interface Options extends GlobOptions {
  file?: string;
  output?: string;
  o?: string;
  "output-dir"?: string;
  d?: string;
  ext?: string;
}

export const convert = async (argv: ArgumentsCamelCase<Options>) => {
  const { file } = argv;

  if (!file) {
    throw new Error("Invalid file path: " + file);
  }

  const files = await glob(file, { dot: true, ...argv });
  if (files.length === 1) {
    // if there is only one file, then the |output| option should functional.
    let output = argv.output || pugName(files[0], argv.ext);
    if (argv.outputDir) {
      output = path.join(argv.outputDir, path.basename(output));
    }
    await convertFile(files[0], output);
  } else {
    // otherwise the |output-dir| option should functional.
    const outputDir = argv.outputDir || ".";
    await Promise.all(
      files.map(async (file) => {
        convertFile(file, path.join(outputDir, pugName(file)));
      })
    );
  }
};

const pugName = (file: string, ext = "pug") =>
  file.replace(/\.\w+$/, "." + ext);

/**
 * convert html to pug
 */
export const convertFile = async (file: string, output: string) => {
  if (file) {
    const pugText = await fromHtmlFile(file);
    await fs.outputFile(output, pugText);
  } else {
    throw new Error(`${file} is not a valid file name`);
  }
};
