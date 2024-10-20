import { useEffect, useRef, useState } from "react";

import { useLazyQuery } from "@apollo/client";
import { Dialog, DialogPanel } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { SEARCH_TAGS_CHANNELS } from "@queries";
import type { TagsChannelsSearchGQLType } from "@types";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import ResultRow from "./components/ResultRow";

export default function SearchBar(): React.JSX.Element {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const modalSearchBox = useRef<HTMLInputElement | null>(null);

  const [getResults, { loading, data }] =
    useLazyQuery<TagsChannelsSearchGQLType>(SEARCH_TAGS_CHANNELS, {
      variables: { term: null }, // variables should be overridden by lazy query invocations
      onError: () => toast.error("Unable to load search results"),
      fetchPolicy: "no-cache",
    });

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ): void => {
    setSearchTerm(event.target.value);
  };

  const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    // only perform search when "enter" is pressed
    if (e.key === "Enter") {
      if (searchTerm.length > 1) {
        getResults({ variables: { term: searchTerm } });
        setHasSearched(true);
      } else {
        setHasSearched(false);
      }
      setIsOpen(true);
    }
  };

  const handleClose = (): void => {
    setIsOpen(false);
    setSearchTerm("");
    setHasSearched(false);
  };

  /**
   * Close search results modal if user navigates to new path
   */
  useEffect(() => {
    handleClose();
  }, [location]);

  return (
    <>
      {/* Search Box */}
      <div>
        <label htmlFor="searchBox" className="relative">
          <MagnifyingGlassIcon className="absolute right-2 top-0 size-6 text-slate-600" />
          <input
            name="searchBox"
            id="searchBox"
            className="m-0 w-full rounded-md border border-slate-700 bg-slate-900 py-2 pl-2 pr-8 focus:border-slate-300 focus:outline-none"
            placeholder="Search"
            value={searchTerm}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
          />
        </label>
      </div>

      {/* Search result modal */}
      <Dialog
        aria-label="Channel Search"
        className="relative z-40"
        open={isOpen}
        onClose={() => handleClose()}
        onFocusCapture={() => {
          modalSearchBox.current?.focus();
        }}
      >
        <div className="fixed inset-0 bg-neutral-900 bg-opacity-85 transition-opacity" />
        <div className="fixed inset-0 z-40 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-slate-900 text-left shadow-xl transition-all sm:w-full sm:max-w-lg">
              <div>
                <label htmlFor="modalSearchBox" className="relative">
                  <MagnifyingGlassIcon className="absolute right-2 top-0 size-6 text-slate-500" />
                  <input
                    name="modalSearchbox"
                    id="modalSearchBox"
                    className="m-0 w-full bg-slate-700 py-4 pl-4 pr-10 focus:outline-none"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleChange}
                    onKeyUp={handleKeyUp}
                    ref={modalSearchBox}
                  />
                </label>
              </div>

              {/*  Search results */}
              <div className="px-4">
                {loading && <ResultRow loading />}

                {/* No results found */}
                {!loading &&
                  hasSearched &&
                  !data?.channels?.edges?.length &&
                  !data?.tags?.edges?.length && (
                    <div className="my-4">
                      <div className="text-md pb-2 text-center">
                        No results found
                      </div>
                      <div className="text-center text-slate-400">
                        Try searching for something else. You can search for tag
                        names or channel names.
                      </div>
                    </div>
                  )}

                {/* No search query */}
                {!loading && !hasSearched && (
                  <div className="my-4">
                    <div className="text-md pb-2 text-center">
                      Search for tag or channel names
                    </div>
                  </div>
                )}

                {/* Tag search results */}
                {((!loading && hasSearched && data?.tags?.edges?.length) || 0) >
                  0 &&
                  data?.tags?.edges?.map((item) => (
                    <ResultRow
                      key={item.node.id}
                      type="tag"
                      tagType={item.node.tagType}
                      id={item.node.id}
                      name={item.node.name}
                    />
                  ))}

                {/* Messages search results */}
                {((!loading && hasSearched && data?.channels?.edges?.length) ||
                  0) > 0 &&
                  data?.channels?.edges?.map((item) => (
                    <ResultRow
                      key={item.node.id}
                      type="channel"
                      id={item.node.id}
                      name={item.node.name}
                    />
                  ))}
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
