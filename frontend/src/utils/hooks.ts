import { useEffect, useRef, useState } from "react";

/**
 * Fetch the next page of a paginated query when the user scrolls near the
 * bottom of the document.
 *
 * `enabled` and `onLoadMore` are read through refs so that the scroll listener
 * always sees current values without rebinding on every render.
 *
 * @param enabled Whether another page is available and ready to be fetched
 * @param onLoadMore Called once each time the user reaches the bottom
 * @param threshold Distance from the bottom, in pixels, that triggers a fetch
 * @returns Whether an additional page has been fetched at least once
 */
export function useInfiniteScroll(
  enabled: boolean,
  onLoadMore: () => void,
  threshold = 300,
): boolean {
  const [hasFetchedMore, setHasFetchedMore] = useState<boolean>(false);
  const enabledRef = useRef(enabled);
  const onLoadMoreRef = useRef(onLoadMore);

  enabledRef.current = enabled;
  onLoadMoreRef.current = onLoadMore;

  useEffect(() => {
    const handleScroll = () => {
      const scrolledTo = window.scrollY + window.innerHeight;
      if (document.body.scrollHeight - threshold <= scrolledTo) {
        if (enabledRef.current) {
          onLoadMoreRef.current();
          setHasFetchedMore(true);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return hasFetchedMore;
}
