import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";
import constants from "@constants";

/**
 * ClientProvider wraps ApolloProvider to provide an
 * authenticated ApolloClient to all children
 */
function ClientProvider(props: React.PropsWithChildren): React.JSX.Element {
  const { children } = props;

  const client = new ApolloClient({
    uri: constants.BACKEND_URL,
    credentials: "include",
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
        errorPolicy: "all",
      },
      query: {
        // @ts-ignore - for some reason the underlying FetchPolicy type in Apollo is missing this policy
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

export { ClientProvider };
