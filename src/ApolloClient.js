import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:8009/graphql',
  }),
  cache: new InMemoryCache(),
});

export default client;