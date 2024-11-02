import constants from "@constants";
import { TagGQLType } from "@types";
import clsx from "clsx";
import { NavLink } from "react-router-dom";

interface TagCardProps {
  tag: TagGQLType;
  adminView?: boolean;
}

function simpleHash(string: string): string {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = (hash << 5) - hash + char;
  }
  return `${hash * -1}`;
}

function positionFromId(string: string): string {
  return (
    [
      "bg-left",
      "bg-left-top",
      "bg-left-bottom",
      "bg-right",
      "bg-right-top",
      "bg-right-bottom",
      "bg-top",
      "bg-bottom",
    ][parseInt(simpleHash(string).slice(-1)[0])] || "bg-top"
  );
}

export default function TagCard(props: TagCardProps) {
  const { tag, adminView } = props;

  return (
    <div
      key={tag?.id}
      className="flex flex-col space-y-2 rounded-md bg-gray-900"
    >
      <div
        className={clsx(
          `flex h-20 flex-col justify-end rounded-t-md px-4 py-2`,
          tag?.banner ? "bg-cover bg-top" : positionFromId(tag?.id),
        )}
        style={{
          backgroundImage: tag?.banner
            ? `url('${constants.MEDIA_URL}/${tag?.banner}')`
            : "url('/static/images/cardHero.jpg')",
        }}
      >
        <h1 className="text-2xl font-bold drop-shadow-2xl">{tag?.name}</h1>
      </div>

      <div className="flex grow flex-col px-4 pb-4 pt-2">
        <div className="grow">
          <p className="pb-4 text-gray-300">{tag?.description}</p>
        </div>

        <div className="grow-0">
          {adminView ? (
            <NavLink
              to={`${constants.ROUTES.ADMIN_TAG}/${tag?.id}`}
              className="inline-block rounded-md border border-gray-500 px-4 py-2 hover:border-transparent hover:bg-lcarsOrange-100"
            >
              Edit
            </NavLink>
          ) : (
            <NavLink
              to={`${constants.ROUTES.CHANNELS}/${tag?.id}`}
              className="inline-block rounded-md bg-lcarsAqua px-4 py-2 hover:bg-lcarsPink-100"
            >
              Browse Channels
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
}
