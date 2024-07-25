import { useEffect, useState } from "react";

import { useQuery } from "@apollo/client";
import {
  Breadcrumbs,
  GridLoading,
  NoContent,
  ReachedBottom,
  TagCard,
} from "@components";
import constants from "@constants";
import { PlusIcon, TagIcon } from "@heroicons/react/20/solid";
import { GET_TAGS } from "@queries";
import type { RelayEdges, TagGQLType, TagType } from "@types";
import { getTagInfoForType } from "@utils/tags";
import clsx from "clsx";
import { NavLink } from "react-router-dom";

export default function AdminTagsView(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<TagType | null>("EVENTS");
  const [hasFetchedMore, setHasFetchedMore] = useState<boolean>(false);
  const { data, loading, error, fetchMore } = useQuery<RelayEdges<TagGQLType>>(
    GET_TAGS,
    {
      variables: {
        tagType: activeTab,
      },
    },
  );

  /**
   * Bind scroll events to fetch more data when the user reaches the bottom
   */
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
          { name: "Tags", link: constants.ROUTES.ADMIN_TAGS, icon: TagIcon },
        ]}
      />

      <div className="flex flex-wrap items-center justify-center pb-5">
        <div className="space-x-2">
          {Object.keys(constants.TAG_INFO).map((key) => (
            <button
              type="button"
              className={clsx(
                "rounded-2xl border px-2",
                activeTab === key
                  ? "border-transparent bg-lcarsYellow-300 text-gray-900"
                  : "border-lcarsYellow-300 px-2 text-white hover:border-transparent hover:bg-lcarsPurple-100 hover:text-gray-900",
              )}
              onClick={() => setActiveTab(key as TagType)}
            >
              {getTagInfoForType(key)?.name}
            </button>
          ))}

          <button
            type="button"
            className={clsx(
              "rounded-2xl border px-2",
              activeTab === null
                ? "border-transparent bg-lcarsYellow-300 text-gray-900"
                : "border-lcarsYellow-300 px-2 text-white hover:border-transparent hover:bg-lcarsPurple-100 hover:text-gray-900",
            )}
            onClick={() => setActiveTab(null)}
          >
            All Tags
          </button>
        </div>

        <div className="ml-2 md:ml-auto">
          <NavLink
            to={constants.ROUTES.ADMIN_TAG}
            className="ml-auto flex items-center rounded-md bg-lcarsBlue-500 p-2 hover:bg-lcarsBlue-800"
          >
            <PlusIcon className="size-6 pe-1" />
            Add New
          </NavLink>
        </div>
      </div>

      <div className="grid-col-1 grid gap-5 md:grid-cols-3">
        {data?.tags?.edges?.map(({ node: tag }) => (
          <TagCard tag={tag} key={tag?.id} adminView />
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
