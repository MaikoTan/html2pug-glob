declare module "html2pug" {
  export interface Options {
    tabs?: boolean;
    commas?: boolean;
    doubleQuotes?: boolean;
    fragment?: boolean;
  }
  function html2pug(html: string, options?: Options): string;
  export default html2pug;
}
