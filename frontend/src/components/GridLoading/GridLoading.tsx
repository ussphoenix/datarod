import Skeleton from "react-loading-skeleton";

export default function GridLoading(): React.JSX.Element {
  return (
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
  );
}
