import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import Cookies from "js-cookie";

import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "http://localhost:8080/",
});

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get("token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});
