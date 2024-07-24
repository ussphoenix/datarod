import { createContext, useState } from "react";

import { useQuery } from "@apollo/client";
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
  const { loading, error } = useQuery<{ me: MeGQLType }>(GET_ME, {
    onCompleted: (data) => {
      setMe(data?.me);
    },
    onError: () => {
      toast.error("An error occurred loading your profile");
    },
  });

  return (
    <MeContext.Provider
      value={{ me, meLoading: loading, meError: !!error || false }}
    >
      {children}
    </MeContext.Provider>
  );
}
