/**
 * Declaration file to supress typescript warnings about importing of PNG files
 * These will be converted by @rollup/plugin-image, as per the docs:
 * -- "Images are encoded using base64, which means they will be 33% larger than the size on disk.
 * -- You should therefore only use this for small images where the convenience of having them available on startup
 * -- (e.g. rendering immediately to a canvas without co-ordinating asynchronous loading of several images) outweighs the cost."
 */

type Base64 = string;

declare module "*.png" {
  const value: Base64;
  export default value;
}