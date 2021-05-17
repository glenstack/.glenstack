import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri:
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_GRAPHQL_DEVELOPMENT_ENDPOINT
      : process.env.REACT_APP_GRAPHQL_PRODUCTION_ENDPOINT,
  cache: new InMemoryCache(),
});
