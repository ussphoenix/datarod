import { lazy } from "react";

import { AuthRequired, Layout, StaffRequired } from "@components";
import constants from "@constants";
import { ClientProvider } from "@providers/ClientProvider";
import { MeProvider } from "@providers/MeProvider";
import { ErrorView } from "@views/ErrorView";
import { HomeView } from "@views/HomeView";
import { NotFoundView } from "@views/NotFoundView";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";

const TagsView = lazy(() => import("@views/TagsView/TagsView"));
const ChannelsView = lazy(() => import("@views/ChannelsView/ChannelsView"));
const ChannelView = lazy(() => import("@views/ChannelView/ChannelView"));
const AdminTagsView = lazy(() => import("@views/AdminTagsView/AdminTagsView"));
const AdminTagView = lazy(() => import("@views/AdminTagView/AdminTagView"));

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
      <ToastContainer theme="dark" />
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
        path: `${constants.ROUTES.TAGS}/:tagType?`,
        element: <TagsView />,
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
          {
            path: `${constants.ROUTES.ADMIN_TAG}/:tagId?`,
            element: <AdminTagView />,
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
