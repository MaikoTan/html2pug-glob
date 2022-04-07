import fs from "fs-extra";
import html2pug from "html2pug";

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
