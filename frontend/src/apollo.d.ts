import "@apollo/client";
import type { HKT } from "@apollo/client/utilities";

/**
 * Apollo Client 4 requires default options that deviate from the built-in
 * defaults (such as a non-default errorPolicy) to be declared via module
 * augmentation so they can be type-checked. These mirror the defaultOptions
 * configured in ClientProvider.
 *
 * https://www.apollographql.com/docs/react/data/typescript#declaring-default-options-for-type-safety
 */
declare module "@apollo/client" {
  namespace ApolloClient {
    namespace DeclareDefaultOptions {
      interface WatchQuery {
        errorPolicy: "all";
      }
      interface Query {
        errorPolicy: "all";
      }
      interface Mutate {
        errorPolicy: "all";
      }
    }
  }
}

/**
 * Apollo Client 4 introduces a `dataState` discriminator and, by default, types
 * query `data` as a union of complete / streaming / partial representations.
 * The streaming and partial variants are `DeepPartial`, which only occur with
 * `@defer` queries or `returnPartialData` — neither of which this app uses.
 *
 * Collapse those variants back to the complete shape so `data` is typed as
 * `TData | undefined`, matching the consumption pattern throughout the app
 * (optional chaining guarded by `loading` / `error` checks).
 *
 * https://www.apollographql.com/docs/react/data/typescript
 */
interface CompleteDataOverride extends HKT {
  return: this["arg1"];
}

declare module "@apollo/client" {
  interface TypeOverrides {
    Streaming: CompleteDataOverride;
    Partial: CompleteDataOverride;
  }
}
