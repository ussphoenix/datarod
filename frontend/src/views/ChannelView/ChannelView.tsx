import { useEffect } from "react";

import { useQuery } from "@apollo/client/react";
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
import { useInfiniteScroll } from "@utils/hooks";
import { getTagInfoForType } from "@utils/tags";
import clsx from "clsx";
import { useParams } from "react-router-dom";

export default function ChannelView(): React.JSX.Element {
  const { channelId } = useParams();
  const { addChannel } = useRecentChannels();
  const { data, loading, error, fetchMore } = useQuery(GET_MESSAGES, {
    variables: { channel: channelId },
  });
  const channel = data?.channel;

  useEffect(() => {
    if (channel) {
      addChannel({ name: channel.name, id: channel.id });
    }
  }, [channel, addChannel]);

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
      name: `#${data?.channel?.name}`,
      link: `${constants.ROUTES.CHANNEL}/${data?.channel?.id}`,
    },
  ];

  // Fetch more data when the user reaches the bottom
  const hasFetchedMore = useInfiniteScroll(
    !!data?.messages?.pageInfo?.hasNextPage && !error && !loading,
    () =>
      fetchMore({ variables: { after: data?.messages?.pageInfo?.endCursor } }),
  );

  return (
    <>
      <ScrollToTop />

      {loading ? (
        <Breadcrumbs loading />
      ) : (
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      )}

      {data?.messages?.edges?.map(({ node }) => (
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
