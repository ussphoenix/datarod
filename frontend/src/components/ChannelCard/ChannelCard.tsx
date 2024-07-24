import constants from "@constants";
import { ChannelGQLType } from "@types";
import { NavLink } from "react-router-dom";

interface ChannelCardProps {
  channel: ChannelGQLType;
}

export default function ChannelCard(
  props: ChannelCardProps,
): React.JSX.Element {
  const { channel } = props;
  return (
    <div className="flex flex-col space-y-2 rounded-md bg-gray-900 p-4">
      <div className="flex-1">
        <h1 className="text-lg font-semibold">#{channel?.name}</h1>
        <p className="pb-6 text-gray-300">{channel?.topic}</p>
      </div>
      <div className="mt-auto">
        <NavLink
          to={`${constants.ROUTES.CHANNEL}/${channel?.id}`}
          className="inline-block rounded-md border border-gray-500 px-4 py-2 hover:border-transparent hover:bg-lcarsOrange-100"
        >
          Read Channel
        </NavLink>
      </div>
    </div>
  );
}
