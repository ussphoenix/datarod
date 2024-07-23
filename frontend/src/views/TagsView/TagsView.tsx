import { useEffect, useState } from "react";

import { useQuery } from "@apollo/client";
import { Breadcrumbs, GridLoading, ReachedBottom } from "@components";
import constants from "@constants";
import { GET_TAGS } from "@queries";
import type { RelayEdges, TagGQLType, TagType } from "@types";
import { getTagInfoForType } from "@utils/tags";
import clsx from "clsx";
import { NavLink } from "react-router-dom";

interface TagsViewProps {
  tagType: TagType;
}

export default function TagsView(props: TagsViewProps): React.ReactNode {
  const { tagType } = props;
  const [hasFetchedMore, setHasFetchedMore] = useState<boolean>(false);
  const { loading, data, fetchMore, error } = useQuery<RelayEdges<TagGQLType>>(
    GET_TAGS,
    {
      fetchPolicy: "network-only", // can't cache tag results because of inability to differentiate between tag types
      variables: { tagType: tagType, first: 21 },
    },
  );
  const tagDetails = getTagInfoForType(tagType);

  useEffect(() => {
    const handleScroll = () => {
      const scrolledTo = window.scrollY + window.innerHeight;
      const threshold = 300;
      if (document.body.scrollHeight - threshold <= scrolledTo) {
        if (data?.tags?.pageInfo?.hasNextPage && !error && !loading) {
          fetchMore({
            variables: { after: data?.tags?.pageInfo?.endCursor },
          });
          setHasFetchedMore(true);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data]);

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          {
            name: tagDetails?.name,
            link: tagDetails?.rootPath || "",
            icon: tagDetails?.icon,
          },
        ]}
      />

      <div className="grid-col-1 grid gap-5 md:grid-cols-3">
        {data &&
          data?.tags?.edges?.map((edge) => (
            <div
              key={edge?.node?.id}
              className="flex flex-col space-y-2 rounded-md bg-gray-900 p-4"
            >
              <div className="flex-1">
                <h1 className="text-lg font-semibold">{edge?.node?.name}</h1>
                <p className="pb-6 text-gray-300">{edge?.node?.description}</p>
              </div>
              <div className="mt-auto">
                <NavLink
                  to={`${constants.ROUTES.CHANNELS}?type=${tagDetails?.slug}&tag=${edge?.node?.slug}`}
                  className="inline-block rounded-md bg-lcarsAqua p-2 hover:bg-lcarsBlue-400"
                >
                  Browse Channels
                </NavLink>
              </div>
            </div>
          ))}
      </div>

      {loading && (
        <div className={clsx(data && "pt-5")}>
          <GridLoading />
        </div>
      )}

      {!loading && !data?.tags?.pageInfo?.hasNextPage && hasFetchedMore && (
        <ReachedBottom />
      )}
    </>
  );
}
