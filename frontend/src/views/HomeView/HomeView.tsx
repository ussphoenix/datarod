import { useEffect } from "react";

import constants from "@constants";
import { useNavigate } from "react-router-dom";

/**
 * There is no "real" home view-- this stub view redirects the user to the events list
 */
export default function HomeView(): React.ReactNode {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(constants.ROUTES.EVENTS);
  }, []);

  return null;
}
