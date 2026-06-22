import { createContext, useContext, useEffect, useState } from "react";

import { useQuery } from "@apollo/client/react";
import { GET_ME } from "@queries";
import type { MeGQLType } from "@types";
import { toast } from "react-toastify";

export interface MeContextInterface {
  me: MeGQLType | null;
  meLoading: boolean;
  meError: boolean;
}

export const MeContext = createContext<MeContextInterface>({
  me: null,
  meLoading: true,
  meError: false,
});

export function MeProvider(props: React.PropsWithChildren): React.JSX.Element {
  const { children } = props;
  const [me, setMe] = useState<MeGQLType | null>(null);
  const { loading, error, data } = useQuery(GET_ME);

  useEffect(() => {
    if (data) {
      setMe(data.me);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error("An error occurred loading your profile");
    }
  }, [error]);

  return (
    <MeContext.Provider
      value={{ me, meLoading: loading, meError: !!error || false }}
    >
      {children}
    </MeContext.Provider>
  );
}

/**
 * React hook to access MeContext as a shortcut
 */
export function useMe() {
  const context = useContext(MeContext);
  if (context == undefined) {
    throw new Error("useMe must be used inside of MeProvider");
  }
  return context;
}
