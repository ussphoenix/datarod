import constants from "@constants";

export interface DiscordMessage {
  id: string;
  tts?: boolean;
  type?: number;
  flags?: number;
  author?: {
    id: string;
    bot?: boolean;
    clan?: string;
    flags?: number;
    avatar?: string;
    banner?: string;
    username: string;
    global_name?: string;
    accent_color?: string;
    banner_color?: string;
    public_flags?: number;
    discriminator?: string;
    avatar_decoration_data?: string;
  };
  embeds?: unknown[];
  pinned?: boolean;
  content?: string;
  mentions?: unknown[];
  timestamp: string;
  channel_id: string;
  components?: unknown[];
  attachments?: unknown[];
  mention_roles?: unknown[];
  edited_timestamp?: string;
  mention_everyone?: boolean;
}

/** GraphQL API Types */
export interface PageInfoGQLType {
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface RelayEdges<P> {
  [query: string]: {
    pageInfo?: PageInfoGQLType;
    edges: { node: P }[];
  };
}

export interface RelaySingle<P> {
  [query: string]: P;
}

export type TagType = keyof typeof constants.TAG_INFO;

export interface MeGQLType {
  username: string;
  isStaff: boolean;
  isAuthenticated: boolean;
  loginUrl: string;
  logoutUrl: string;
}

export interface TagGQLType {
  id: string;
  slug: string;
  name: string;
  tagType: TagType;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface ChannelGQLType {
  id: string;
  name: string;
  tag: {
    id: string;
    name: string;
    tagType: TagType;
  };
  topic?: string;
  archiveDate: string;
}

export interface MessageGQLType {
  nickname: {
    discordId: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
  rawMessage: string;
}
