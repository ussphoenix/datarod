import { useContext } from "react";

import { MeContext } from "@providers/MeProvider";

export default function StaffRequired(
  props: React.PropsWithChildren,
): React.ReactNode {
  const { children } = props;
  const { me } = useContext(MeContext);

  if (me && me?.isStaff) {
    return children;
  }
  return null;
}
