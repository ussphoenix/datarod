import { createContext, useContext, useState } from "react";

interface RecentChannel {
  name: string;
  id: string;
}

type AddChannelInterface = (channel: RecentChannel) => void;
type ClearChannelsInterface = () => void;

interface RecentChannelContextInterface {
  channels: RecentChannel[] | never[];
  addChannel: AddChannelInterface;
  clearChannels: ClearChannelsInterface;
}

export const RecentChannelContext =
  createContext<RecentChannelContextInterface>({
    channels: [],
    addChannel: () => null,
    clearChannels: () => null,
  });

export function RecentChannelProvider(props: React.PropsWithChildren) {
  const { children } = props;
  const saved = localStorage.getItem("recentChannels") || "[]";
  const initialValue = JSON.parse(saved);
  const [state, setState] = useState<RecentChannel[]>(initialValue);

  const addChannel: AddChannelInterface = (channel) => {
    let newState = state;
    if (state.filter((_channel) => _channel?.id == channel?.id)) {
      // channel in history list, move to top if not most recent
      if (state[0]?.id !== channel?.id) {
        newState = newState.filter((_channel) => _channel?.id !== channel?.id);
        newState.unshift(channel);
      }
    } else {
      newState.unshift(channel);
    }
    setState(newState.slice(0, 6));
    localStorage.setItem(
      "recentChannels",
      JSON.stringify(newState.slice(0, 6)),
    );
  };

  const clearChannels: ClearChannelsInterface = () => {
    setState([]);
    localStorage.setItem("recentChannels", JSON.stringify([]));
  };

  return (
    <RecentChannelContext.Provider
      value={{
        channels: state,
        addChannel,
        clearChannels,
      }}
    >
      {children}
    </RecentChannelContext.Provider>
  );
}

/**
 * React hook to access RecentChannelContext as a shortcut
 */
export function useRecentChannels() {
  const context = useContext(RecentChannelContext);
  if (context == undefined) {
    throw new Error(
      "useRecentChannels must be used inside of RecentChannelProvider",
    );
  }
  return context;
}
