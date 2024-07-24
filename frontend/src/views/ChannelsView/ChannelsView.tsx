import { useEffect, useState } from "react";

import { useQuery } from "@apollo/client";
import {
  type Breadcrumb,
  Breadcrumbs,
  GridLoading,
  NoContent,
  ReachedBottom,
  ScrollToTop,
} from "@components";
import constants from "@constants";
import { HashtagIcon } from "@heroicons/react/20/solid";
import { GET_CHANNELS, GET_TAG } from "@queries";
import type {
  ChannelGQLType,
  RelayEdges,
  RelaySingle,
  TagGQLType,
} from "@types";
import { getTagInfoForType } from "@utils/tags";
import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function ChannelsView(): React.ReactNode {
  const [hasFetchedMore, setHasFetchedMore] = useState<boolean>(false);
  const { tagId } = useParams();

  const { data: tagData, loading: tagLoading } = useQuery<
    RelaySingle<TagGQLType>
  >(GET_TAG, {
    variables: { id: tagId },
    fetchPolicy: "network-only",
    skip: !tagId,
  });

  const {
    data,
    loading: channelLoading,
    fetchMore,
    error,
  } = useQuery<RelayEdges<ChannelGQLType>>(GET_CHANNELS, {
    variables: {
      tag: tagId,
    },
  });

  // Condense loading states
  const loading: boolean = tagLoading && channelLoading;

  // Generate breadcrumb trail based on tag type
  const breadcrumbs: Breadcrumb[] = [
    {
      name: getTagInfoForType(tagData?.tag?.tagType)?.name || "All Channels",
      link:
        getTagInfoForType(tagData?.tag?.tagType)?.rootPath ||
        constants.ROUTES.CHANNELS,
      icon: getTagInfoForType(tagData?.tag?.tagType)?.icon || HashtagIcon,
    },
    ...(tagData?.tag?.tagType
      ? [
          {
            name: tagData?.tag?.name,
            link: location.pathname + location.search,
          },
        ]
      : []),
  ];

  /**
   * Bind scroll events to fetch more data when the user reaches the bottom
   */
  useEffect(() => {
    const handleScroll = () => {
      const scrolledTo = window.scrollY + window.innerHeight;
      const threshold = 300;
      if (document.body.scrollHeight - threshold <= scrolledTo) {
        if (data?.channels?.pageInfo?.hasNextPage && !error && !loading) {
          fetchMore({
            variables: { after: data?.channels?.pageInfo?.endCursor },
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
      <ScrollToTop />

      {loading ? (
        <Breadcrumbs loading />
      ) : (
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      )}

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
                  to={`${constants.ROUTES.CHANNEL}/${edge?.node?.id}`}
                  className="inline-block rounded-md bg-lcarsPurple-500 p-2 hover:bg-lcarsOrange-100"
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

      {!loading && !error && !data?.channels?.edges?.length && <NoContent />}

      {!loading && !data?.channels?.pageInfo?.hasNextPage && hasFetchedMore && (
        <ReachedBottom />
      )}
    </>
  );
}
