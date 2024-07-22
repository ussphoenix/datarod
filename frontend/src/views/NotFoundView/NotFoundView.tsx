export default function NotFoundView(): React.JSX.Element {
  return (
    <>
      <h1 className="font-title text-3xl tracking-wide text-lcarsYellow-200">
        Not Found (404)
      </h1>
      <p className="leading-loose">
        Whatever you were looking for is lost in subspace. Try a link on the
        left to start again.
      </p>
    </>
  );
}
