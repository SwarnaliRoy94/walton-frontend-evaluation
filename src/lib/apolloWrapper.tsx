"use client";

import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./apollo";

const ApolloWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
};

export default ApolloWrapper;
