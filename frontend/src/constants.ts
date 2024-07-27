import { RocketLaunchIcon } from "@heroicons/react/20/solid";
import {
  CalendarIcon,
  ChatBubbleBottomCenterIcon,
  GlobeAmericasIcon,
  SunIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

export default {
  BACKEND_URL: `${import.meta.env.VITE_BACKEND_URL}`,
  TAG_INFO: {
    EVENTS: {
      name: "Events",
      rootPath: "/tags/events",
      icon: CalendarIcon,
    },
    QUARTERS: {
      name: "Crew Quarters",
      rootPath: "/tags/quarters",
      icon: UsersIcon,
    },
    PHOENIXB: {
      name: "Phoenix B",
      rootPath: "/tags/phoenixb",
      icon: RocketLaunchIcon,
    },
    SHORE: {
      name: "Shore Leaves",
      rootPath: "/tags/shore",
      icon: SunIcon,
    },
    STARFLEET: {
      name: "Starfleet Command",
      rootPath: "/tags/starfleet",
      icon: GlobeAmericasIcon,
    },
    OTHER: {
      name: "Other",
      rootPath: "/tags/other",
      icon: ChatBubbleBottomCenterIcon,
    },
  },
  ROUTES: {
    HOME: "/tags/events",
    TAGS: "/tags",
    CHANNELS: "/channels",
    CHANNEL: "/channel",
    ADMIN_TAGS: "/admin/tags",
    ADMIN_TAG: "/admin/tag",
  },
};
