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

export type TagType = "EVENT" | "QUARTERS" | "OTHER";

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
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface ChannelGQLType {
  id: string;
  name: string;
  tag: {
    name: string;
    tagType: TagType;
  };
  topic?: string;
  archiveDate: string;
}
