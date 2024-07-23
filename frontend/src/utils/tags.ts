import constants from "@constants";
import { CalendarIcon, UsersIcon } from "@heroicons/react/20/solid";
import type { TagType } from "@types";

export interface TagInfo {
  name: string;
  rootPath: string;
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
  slug: string;
}

const tagInfo: {
  [key in TagType as string]: TagInfo;
} = {
  EVENT: {
    name: "Events",
    rootPath: constants.ROUTES.EVENTS,
    icon: CalendarIcon,
    slug: "events",
  },
  QUARTERS: {
    name: "Crew Quarters",
    rootPath: constants.ROUTES.QUARTERS,
    icon: UsersIcon,
    slug: "quarters",
  },
};

export const getTagInfoForType = (tagType: TagType): TagInfo | null => {
  return tagInfo[tagType] || null;
};
