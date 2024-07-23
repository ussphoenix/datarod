import { gql } from "@apollo/client";

const PAGEINFO = `
  pageInfo {
    startCursor
    endCursor
    hasNextPage
    hasPreviousPage
}
`;

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

export const GET_TAGS = gql`
  query GetTags(
    $tagType: ArchiveTagTagTypeChoices
    $first: Int = 20
    $after: String = null
  ) {
    tags(tagType: $tagType, first: $first, after: $after) {
      ${PAGEINFO}
      edges {
        node {
          id
          tagType
          name
          description
          startDate
          endDate
        }
      }
    }
  }
`;
