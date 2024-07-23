import { useEffect, useState } from "react";

import { useQuery } from "@apollo/client";
import { type Breadcrumb, Breadcrumbs } from "@components";
import { GridLoading, ReachedBottom } from "@components";
import constants from "@constants";
import {
  CalendarIcon,
  HashtagIcon,
  UsersIcon,
} from "@heroicons/react/20/solid";
import { GET_CHANNELS, GET_TAGS } from "@queries";
import type { ChannelGQLType, RelayEdges, TagGQLType, TagType } from "@types";
import clsx from "clsx";
import Skeleton from "react-loading-skeleton";
import { NavLink } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const tagTypeSlugMap: { [slug: string]: TagType } = {
  events: "EVENT",
  quarters: "QUARTERS",
  other: "OTHER",
};

export default function ChannelsView(): React.ReactNode {
  const [params] = useSearchParams();
  const [hasFetchedMore, setHasFetchedMore] = useState<boolean>(false);
  const tagTypeParam = params.get("type");
  const tagParam = params.get("tag");
  const tagType = tagTypeSlugMap[tagTypeParam || ""] || null;
  const { data: tagData } = useQuery<RelayEdges<TagGQLType>>(GET_TAGS, {
    variables: { slug: tagParam },
    fetchPolicy: "network-only",
  });
  const { data, loading, fetchMore, error } = useQuery<
    RelayEdges<ChannelGQLType>
  >(GET_CHANNELS, {
    variables: {
      tagType,
      tagSlug: tagParam,
    },
  });

  const breadcrumbs: Breadcrumb[] = [
    ...(tagType === "EVENT"
      ? [{ name: "Events", link: constants.ROUTES.EVENTS, icon: CalendarIcon }]
      : []),
    ...(tagType === "QUARTERS"
      ? [
          {
            name: "Crew Quarters",
            link: constants.ROUTES.QUARTERS,
            icon: UsersIcon,
          },
        ]
      : []),
    ...(tagType
      ? []
      : [
          {
            name: "All Channels",
            link: constants.ROUTES.CHANNELS,
            icon: HashtagIcon,
          },
        ]),
    ...(tagType
      ? [
          {
            name: tagData?.tags?.edges[0]?.node?.name || <Skeleton />,
            link: location.pathname + location.search,
          },
        ]
      : []),
  ];

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
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className="grid-col-1 grid gap-5 md:grid-cols-3">
        {data &&
          data?.channels?.edges?.map((edge) => (
            <div
              key={edge?.node?.id}
              className="flex flex-col space-y-2 rounded-md bg-gray-900 p-4"
            >
              <div className="flex-1">
                <h1 className="text-lg font-semibold">#{edge?.node?.name}</h1>
                <p className="pb-6 text-gray-300">{edge?.node?.topic}</p>
              </div>
              <div className="mt-auto">
                <NavLink
                  to="#"
                  className="inline-block rounded-md bg-lcarsYellow-100 p-2 text-black hover:bg-lcarsOrange-100"
                >
                  Read Channel
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
