import { useEffect, useState } from "react";

import { useQuery } from "@apollo/client";
import {
  type Breadcrumb,
  Breadcrumbs,
  MessageRow,
  NoContent,
  ReachedBottom,
  RowLoading,
  ScrollToTop,
} from "@components";
import constants from "@constants";
import { HashtagIcon } from "@heroicons/react/20/solid";
import { useRecentChannels } from "@providers/RecentChannelsProvider";
import { GET_MESSAGES } from "@queries";
import type { ChannelGQLType, MessageGQLType, RelayEdges } from "@types";
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
        data?.messages?.edges?.map(({ node }) => (
          <MessageRow key={node?.timestamp} message={node} />
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
