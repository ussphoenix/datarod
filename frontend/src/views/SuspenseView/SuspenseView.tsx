import Skeleton from "react-loading-skeleton";

export default function SuspenseView(): React.JSX.Element {
  return (
    <>
      <div>
        {/* Static sidebar menu */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-900 px-6 py-4">
            <div className="h-16 items-center">
              <Skeleton className="h-8" />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {[1, 2, 3].map((item) => (
                      <li key={item}>
                        <Skeleton />
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Static mobile header  */}
        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-slate-900 px-4 py-4 shadow-xs sm:px-6 lg:hidden">
          <span className="font-title text-3xl tracking-wide text-white">
            <Skeleton />
          </span>
        </div>

        {/* Content section */}
        <div className="lg:pl-72">
          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="grid-col-1 grid gap-5 md:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex grow flex-col space-y-2 rounded-md bg-gray-900 p-4"
                  >
                    <div className="flex-1">
                      <h1 className="text-lg font-semibold">
                        <Skeleton />
                      </h1>
                      <p className="pb-6 text-gray-300">
                        <Skeleton />
                      </p>
                    </div>
                    <div className="mt-auto">
                      <Skeleton />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
