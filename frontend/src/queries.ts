import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";

import type {
  ChannelGQLType,
  MeGQLType,
  MessageGQLType,
  NicknameGQLType,
  RelayEdges,
  RelaySingle,
  TagGQLType,
  TagsChannelsSearchGQLType,
} from "@types";

export const GET_ME: TypedDocumentNode<{ me: MeGQLType }, Record<string, never>> = gql`
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

export const GET_TAGS: TypedDocumentNode<
  RelayEdges<TagGQLType>,
  {
    tagType?: string | null;
    slug?: string | null;
    first?: number;
    after?: string | null;
  }
> = gql`
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
          banner
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

export const GET_TAG: TypedDocumentNode<
  RelaySingle<TagGQLType>,
  { id?: string }
> = gql`
  query GetTag($id: ID!) {
    tag(id: $id) {
      id
      slug
      tagType
      banner
      name
      description
      startDate
      endDate
    }
  }
`;

export const GET_CHANNELS: TypedDocumentNode<
  RelayEdges<ChannelGQLType>,
  {
    tag?: string;
    tagType?: string | null;
    tagSlug?: string | null;
    first?: number;
    after?: string | null;
  }
> = gql`
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

export const GET_MESSAGES: TypedDocumentNode<
  RelayEdges<MessageGQLType> & { channel: ChannelGQLType },
  { channel?: string; first?: number; after?: string | null }
> = gql`
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
            id
            name
            avatar
            color
          }
          timestamp
          rawMessage
        }
      }
    }
  }
`;

export const SEARCH_TAGS_CHANNELS: TypedDocumentNode<
  TagsChannelsSearchGQLType,
  { term?: string | null; first?: number }
> = gql`
  query SearchTagsAndChannels($term: String, $first: Int = 5) {
    tags(name_Icontains: $term, first: $first) {
      pageInfo {
        hasNextPage
      }
      edges {
        node {
          id
          name
          tagType
        }
      }
    }
    channels(name_Icontains: $term, first: $first) {
      pageInfo {
        hasNextPage
      }
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export const MUTATE_TAG: TypedDocumentNode<
  { tag: { tag: TagGQLType } },
  {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
    tagType?: string;
    banner?: File | null;
    clearBanner?: boolean;
    startDate?: string | null;
    endDate?: string | null;
  }
> = gql`
  mutation MutateTag(
    $id: ID
    $name: String!
    $slug: String!
    $description: String
    $tagType: String!
    $banner: Upload
    $clearBanner: Boolean
    $startDate: Date
    $endDate: Date
  ) {
    tag(
      id: $id
      name: $name
      slug: $slug
      description: $description
      tagType: $tagType
      banner: $banner
      clearBanner: $clearBanner
      startDate: $startDate
      endDate: $endDate
    ) {
      tag {
        id
        slug
        tagType
        banner
        name
        description
        startDate
        endDate
      }
    }
  }
`;

export const MUTATE_NICKNAME: TypedDocumentNode<
  { nickname: { nickname: NicknameGQLType } },
  { id?: string; name?: string; avatar?: string }
> = gql`
  mutation MutateNickname($id: ID!, $name: String, $avatar: String) {
    nickname(id: $id, name: $name, avatar: $avatar) {
      nickname {
        id
        name
        avatar
      }
    }
  }
`;
