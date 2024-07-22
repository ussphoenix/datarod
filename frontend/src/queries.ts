import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetMe {
    me {
      username
      isAuthenticated
      isStaff
      loginUrl
      logoutUrl
    }
  }
`;
