import { useEffect, useState } from "react";

import { useQuery } from "@apollo/client";
import {
  type Breadcrumb,
  Breadcrumbs,
  NoContent,
  ReachedBottom,
  RowLoading,
  ScrollToTop,
} from "@components";
import constants from "@constants";
import { HashtagIcon } from "@heroicons/react/20/solid";
import { useRecentChannels } from "@providers/RecentChannelsProvider";
import { GET_MESSAGES } from "@queries";
import type {
  ChannelGQLType,
  DiscordMessage,
  MessageGQLType,
  RelayEdges,
} from "@types";
import { getTagInfoForType } from "@utils/tags";
import clsx from "clsx";
import { useParams } from "react-router-dom";

type ChannelQuery = RelayEdges<MessageGQLType> & { channel: ChannelGQLType };

export default function ChannelView(): React.JSX.Element {
  const { channelId } = useParams();
  const { addChannel } = useRecentChannels();
  const [hasFetchedMore, setHasFetchedMore] = useState<boolean>(false);
  const { data, loading, error, fetchMore } = useQuery<ChannelQuery>(
    GET_MESSAGES,
    {
      variables: { channel: channelId },
      onCompleted: (data) => {
        addChannel({ name: data?.channel?.name, id: data?.channel?.id });
      },
    },
  );

  const parseMessage = (rawMessage?: string): DiscordMessage | null => {
    if (!rawMessage) return null;
    return JSON.parse(rawMessage);
  };

  const parseDate = (datestring?: string): string | null => {
    if (!datestring) return null;
    const parsed = new Date(datestring);
    return parsed?.toLocaleString();
  };

  // Generate breadcrumb trail based on tag type
  const breadcrumbs: Breadcrumb[] = [
    {
      name:
        getTagInfoForType(data?.channel?.tag?.tagType)?.name || "All Channels",
      link:
        getTagInfoForType(data?.channel?.tag?.tagType)?.rootPath ||
        constants.ROUTES.CHANNELS,
      icon: getTagInfoForType(data?.channel?.tag?.tagType)?.icon || HashtagIcon,
    },
    ...(data?.channel?.tag?.tagType
      ? [
          {
            name: data?.channel?.tag?.name,
            link: `${constants.ROUTES.CHANNELS}/${data?.channel?.tag?.id}`,
          },
        ]
      : []),
    {
      name: "#" + data?.channel?.name,
      link: `${constants.ROUTES.CHANNEL}/${data?.channel?.id}`,
    },
  ];

  /**
   * Bind scroll events to fetch more data when the user reaches the bottom
   */
  useEffect(() => {
    const handleScroll = () => {
      const scrolledTo = window.scrollY + window.innerHeight;
      const threshold = 300;
      if (document.body.scrollHeight - threshold <= scrolledTo) {
        if (data?.messages?.pageInfo?.hasNextPage && !error && !loading) {
          fetchMore({
            variables: { after: data?.messages?.pageInfo?.endCursor },
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

      {data &&
        data?.messages?.edges?.map((edge) => (
          <div
            key={edge?.node?.timestamp}
            className="flex w-full space-x-3 border-b border-b-gray-900 py-5"
          >
            <div className="shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                alt=""
                src={
                  edge?.node?.nickname?.avatar &&
                  edge?.node?.nickname?.discordIds
                    ? `https://cdn.discordapp.com/avatars/${edge?.node?.nickname?.discordIds[0]}/${edge?.node?.nickname?.avatar}.webp?size=60`
                    : "/static/images/profileDefault.png"
                }
              />
            </div>
            <div>
              <div className="pb-1">
                <span className="text-semibold text-lcarsBlue-300">
                  {edge?.node?.nickname?.name}
                </span>
                <span className="ps-3 text-sm text-gray-400">
                  {parseDate(edge?.node?.timestamp)}
                </span>
              </div>
              <div>{parseMessage(edge?.node?.rawMessage)?.content}</div>
            </div>
          </div>
        ))}

      {!loading && !error && !data?.messages?.edges?.length && <NoContent />}

      {loading && (
        <div className={clsx(data && "pt-5")}>
          <RowLoading />
        </div>
      )}

      {!loading && !data?.messages?.pageInfo?.hasNextPage && hasFetchedMore && (
        <ReachedBottom />
      )}
    </>
  );
}
