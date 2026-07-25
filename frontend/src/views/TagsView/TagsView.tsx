import { useQuery } from "@apollo/client/react";
import {
  Breadcrumbs,
  GridLoading,
  NoContent,
  ReachedBottom,
  ScrollToTop,
  TagCard,
} from "@components";
import { GET_TAGS } from "@queries";
import type { TagType } from "@types";
import { useInfiniteScroll } from "@utils/hooks";
import { getTagInfoForType } from "@utils/tags";
import clsx from "clsx";
import { useParams } from "react-router-dom";

export default function TagsView(): React.JSX.Element {
  const { tagType } = useParams();
  const { loading, data, fetchMore, error } = useQuery(GET_TAGS, {
    fetchPolicy: "network-only", // can't cache tag results because of inability to differentiate between tag types
    variables: { tagType: tagType?.toUpperCase() },
  });
  const tagDetails = getTagInfoForType(tagType?.toUpperCase() as TagType);

  // Fetch more data when the user reaches the bottom
  const hasFetchedMore = useInfiniteScroll(
    !!data?.tags?.pageInfo?.hasNextPage && !error && !loading,
    () => fetchMore({ variables: { after: data?.tags?.pageInfo?.endCursor } }),
  );

  return (
    <>
      <ScrollToTop />

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
        {data?.tags?.edges?.map(({ node: tag }) => (
          <TagCard tag={tag} key={tag?.id} />
        ))}
      </div>

      {loading && (
        <div className={clsx(data && "pt-5")}>
          <GridLoading />
        </div>
      )}

      {!loading && !error && !data?.tags?.edges?.length && <NoContent />}

      {!loading && !data?.tags?.pageInfo?.hasNextPage && hasFetchedMore && (
        <ReachedBottom />
      )}
    </>
  );
}
