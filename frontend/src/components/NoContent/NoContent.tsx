export default function NoContent(): React.JSX.Element {
  return (
    <div className="flex flex-col">
      <img src="/static/images/ufp.webp" alt="" className="mx-auto w-40 pt-8" />
      <div className="pt-5 text-center text-2xl font-bold uppercase text-lcarsYellow-200">
        No Transmission
      </div>
    </div>
  );
}
