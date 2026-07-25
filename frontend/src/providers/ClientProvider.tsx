import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { relayStylePagination } from "@apollo/client/utilities";
import constants from "@constants";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";

/**
 * ClientProvider wraps ApolloProvider to provide an
 * authenticated ApolloClient to all children
 */
export function ClientProvider(
  props: React.PropsWithChildren,
): React.JSX.Element {
  const { children } = props;

  const client = new ApolloClient({
    link: new UploadHttpLink({
      uri: constants.BACKEND_URL,
      credentials: "include",
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
        errorPolicy: "all",
      },
      query: {
        // @ts-expect-error - for some reason the underlying FetchPolicy type in Apollo is missing this policy
        fetchPolicy: "cache-and-network",
        errorPolicy: "all",
      },
      mutate: {
        errorPolicy: "all",
      },
    },
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            tags: {
              keyArgs: ["id"],
              ...relayStylePagination(),
            },
            channels: {
              keyArgs: ["id"],
              ...relayStylePagination(),
            },
            messages: {
              keyArgs: ["id"],
              ...relayStylePagination(),
            },
          },
        },
      },
    }),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
