import { gql, useQuery } from "@apollo/client";

const GET_EVENTS = gql`
  query GetEvents {
    tags {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export default function EventsView(): React.ReactNode {
  const { loading, error, data } = useQuery(GET_EVENTS);

  return (
    <>
      {data &&
        data?.tags?.edges?.map((edge) => (
          <div key={edge?.node?.id}>{edge?.node?.name}</div>
        ))}
    </>
  );
}
