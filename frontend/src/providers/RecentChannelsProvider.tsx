import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

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

  useEffect(() => {
    localStorage.setItem("recentChannels", JSON.stringify(state));
  }, [state]);

  const addChannel: AddChannelInterface = useCallback((channel) => {
    setState((current) => {
      // Already the most recent channel, nothing to reorder
      if (current[0]?.id === channel?.id) {
        return current;
      }
      // Move to the top of the history list, dropping any earlier visit
      return [
        channel,
        ...current.filter((_channel) => _channel?.id !== channel?.id),
      ].slice(0, 6);
    });
  }, []);

  const clearChannels: ClearChannelsInterface = useCallback(() => {
    setState([]);
  }, []);

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
  if (context === undefined) {
    throw new Error(
      "useRecentChannels must be used inside of RecentChannelProvider",
    );
  }
  return context;
}
