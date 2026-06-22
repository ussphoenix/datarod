/**
 * apollo-upload-client v19 ships JSDoc-based types that aren't exposed through
 * its package "exports" map, so the deep ESM import has no resolvable types.
 * Declare the upload link (a drop-in HttpLink replacement) ourselves.
 *
 * This file must remain a script (no top-level imports/exports) so that the
 * `declare module` below is treated as a standalone ambient module declaration
 * rather than an augmentation of the untyped JS module.
 */
declare module "apollo-upload-client/UploadHttpLink.mjs" {
  import { ApolloLink, HttpLink } from "@apollo/client";

  export default class UploadHttpLink extends ApolloLink {
    constructor(options?: HttpLink.Options);
  }
}
