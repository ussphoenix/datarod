import constants from "@constants";
import { getTagInfoForType } from "@utils/tags";
import Skeleton from "react-loading-skeleton";
import { NavLink } from "react-router-dom";

interface ResultRowProps {
  type?: "tag" | "channel";
  tagType?: string;
  id?: string;
  name?: string;
  loading?: boolean;
}

export default function ResultRow(props: ResultRowProps): React.JSX.Element {
  const { type, id, name, tagType = undefined, loading = false } = props;

  const getRoute = (): string => {
    if (type === "channel") return `${constants.ROUTES.CHANNEL}/${id}`;
    if (type === "tag") return `${constants.ROUTES.CHANNELS}/${id}`;
    return "";
  };

  if (loading) {
    return (
      <>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="my-4 flex items-center justify-between">
            <div className="w-1/2">
              <Skeleton className="h-8" />
            </div>
            <div className="w-1/4">
              <Skeleton className="h-8" />
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <NavLink
      className="my-4 flex items-center justify-between hover:text-lcarsPurple-100"
      to={getRoute()}
    >
      <div>{name}</div>
      <div className="text-slate-600">
        {type === "channel" && "Channel"}
        {type === "tag" && getTagInfoForType(tagType)?.name}
      </div>
    </NavLink>
  );
}
