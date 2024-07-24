import { lazy } from "react";

import { AuthRequired, Layout, StaffRequired } from "@components";
import constants from "@constants";
import { ClientProvider } from "@providers/ClientProvider";
import { MeProvider } from "@providers/MeProvider";
import { ErrorView } from "@views/ErrorView";
import { HomeView } from "@views/HomeView";
import { NotFoundView } from "@views/NotFoundView";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";

import "react-loading-skeleton/dist/skeleton.css";

const TagsView = lazy(() => import("@views/TagsView/TagsView"));
const ChannelsView = lazy(() => import("@views/ChannelsView/ChannelsView"));
const ChannelView = lazy(() => import("@views/ChannelView/ChannelView"));
const AdminTagsView = lazy(() => import("@views/AdminTagsView/AdminTagsView"));

function Root(): React.JSX.Element {
  return (
    <>
      <ClientProvider>
        <MeProvider>
          <AuthRequired>
            <Layout />
          </AuthRequired>
        </MeProvider>
      </ClientProvider>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: (
      <Layout>
        <ErrorView />
      </Layout>
    ),
    children: [
      { path: constants.ROUTES.HOME, element: <HomeView /> },
      {
        path: constants.ROUTES.EVENTS,
        element: <TagsView tagType="EVENT" />,
      },
      {
        path: constants.ROUTES.QUARTERS,
        element: <TagsView tagType="QUARTERS" />,
      },
      {
        path: `${constants.ROUTES.CHANNELS}/:tagId?`,
        element: <ChannelsView />,
      },
      {
        path: `${constants.ROUTES.CHANNEL}/:channelId`,
        element: <ChannelView />,
      },
      {
        path: "admin",
        element: (
          <StaffRequired>
            <Outlet />
          </StaffRequired>
        ),
        children: [
          {
            path: constants.ROUTES.ADMIN_TAGS,
            element: <AdminTagsView />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: (
      <Layout>
        <NotFoundView />
      </Layout>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} fallbackElement={null} />;
}

export default App;
