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

export type MeGQLType = {
  username: string;
  isStaff: boolean;
  isAuthenticated: boolean;
  loginUrl: string;
  logoutUrl: string;
};

export type TagGQLType = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
};
