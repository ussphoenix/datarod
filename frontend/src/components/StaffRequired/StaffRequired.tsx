import { useMe } from "@providers/MeProvider";

export default function StaffRequired(
  props: React.PropsWithChildren,
): React.ReactNode {
  const { children } = props;
  const { me } = useMe();

  if (me?.isStaff) {
    return children;
  }
  return null;
}
