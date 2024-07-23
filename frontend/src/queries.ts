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

export const GET_TAGS = gql`
  query GetTags(
    $tagType: ArchiveTagTagTypeChoices
    $slug: String = null
    $first: Int = 20
    $after: String = null
  ) {
    tags(tagType: $tagType, slug: $slug, first: $first, after: $after) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          slug
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

export const GET_CHANNELS = gql`
  query GetChannels(
    $tagType: ArchiveTagTagTypeChoices
    $tagSlug: String = null
    $first: Int = 20
    $after: String = null
  ) {
    channels(
      tag_Slug: $tagSlug
      tag_TagType: $tagType
      first: $first
      after: $after
    ) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          name
          tag {
            name
            tagType
          }
          topic
          archiveDate
        }
      }
    }
  }
`;
