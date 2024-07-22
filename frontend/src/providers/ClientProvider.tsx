import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import constants from "@constants";

/**
 * ClientProvider wraps ApolloProvider to provide an
 * authenticated ApolloClient to all children
 */
function ClientProvider(props: React.PropsWithChildren): React.ReactNode {
  const { children } = props;

  const client = new ApolloClient({
    uri: constants.BACKEND_URL,
    credentials: "include",
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export { ClientProvider };
