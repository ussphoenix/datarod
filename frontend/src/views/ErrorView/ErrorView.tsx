export default function ErrorView(): React.JSX.Element {
  return (
    <>
      <h1 className="font-title text-3xl tracking-wide text-lcarsYellow-200">
        An unhandled error has occurred!
      </h1>
      <p className="leading-loose">
        Something in my programming tried to violate the prime directive. I just
        can't let that happen. Try a link on the left to start again.
      </p>
    </>
  );
}
