import { RocketLaunchIcon } from "@heroicons/react/20/solid";
import {
  CalendarIcon,
  ChatBubbleBottomCenterIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

export default {
  BACKEND_URL: "http://localhost:8000/graphql",
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
    OTHER: {
      name: "Other",
      rootPath: "/tags/other",
      icon: ChatBubbleBottomCenterIcon,
    },
  },
  ROUTES: {
    HOME: "",
    TAGS: "/tags",
    EVENTS: "/events",
    QUARTERS: "/quarters",
    CHANNELS: "/channels",
    CHANNEL: "/channel",
    ADMIN_TAGS: "/admin/tags",
    ADMIN_TAG: "/admin/tag",
  },
};
