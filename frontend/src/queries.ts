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
    $first: Int = 54
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

export const GET_TAG = gql`
  query GetTag($id: ID!) {
    tag(id: $id) {
      id
      slug
      tagType
      name
      description
      startDate
      endDate
    }
  }
`;

export const GET_CHANNELS = gql`
  query GetChannels(
    $tag: ID = null
    $tagType: ArchiveTagTagTypeChoices = null
    $tagSlug: String = null
    $first: Int = 54
    $after: String = null
  ) {
    channels(
      tag_Slug: $tagSlug
      tag_TagType: $tagType
      tag: $tag
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
            id
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

export const GET_MESSAGES = gql`
  query GetMessages($channel: ID!, $first: Int = 100, $after: String = null) {
    channel(id: $channel) {
      id
      name
      tag {
        id
        name
        tagType
      }
      topic
      archiveDate
    }
    messages(channel: $channel, first: $first, after: $after) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          nickname {
            name
            avatar
          }
          timestamp
          rawMessage
        }
      }
    }
  }
`;

export const MUTATE_TAG = gql`
  mutation MutateTag(
    $id: ID
    $name: String!
    $slug: String!
    $description: String
    $tagType: String!
    $startDate: Date
    $endDate: Date
  ) {
    tag(
      id: $id
      name: $name
      slug: $slug
      description: $description
      tagType: $tagType
      startDate: $startDate
      endDate: $endDate
    ) {
      tag {
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
`;
