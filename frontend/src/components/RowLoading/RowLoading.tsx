import Skeleton from "react-loading-skeleton";

export default function GridLoading(): React.JSX.Element {
  return (
    <>
      {[1, 2, 3].map((index) => (
        <div
          className="flex w-full space-x-3 border-b border-b-gray-900 py-5"
          key={index}
        >
          <div>
            <Skeleton className="size-10 rounded-full" />
          </div>
          <div className="flex-1">
            <div className="pb-1">
              <span>
                <Skeleton className="w-48" />
              </span>
            </div>
            <div>
              <Skeleton count={2} className="w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
