import { lazy } from "react";

import { AuthRequired, Layout } from "@components";
import constants from "@constants";
import { ClientProvider } from "@providers/ClientProvider";
import { MeProvider } from "@providers/MeProvider";
import { ErrorView } from "@views/ErrorView";
import { HomeView } from "@views/HomeView";
import { NotFoundView } from "@views/NotFoundView";
import { SuspenseView } from "@views/SuspenseView";
import { SkeletonTheme } from "react-loading-skeleton";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "react-loading-skeleton/dist/skeleton.css";

const TagsViews = lazy(() => import("@views/TagsView/TagsView"));

function Root(): React.ReactNode {
  return (
    <>
      <SkeletonTheme baseColor="#10171E" highlightColor="#15202B">
        <ClientProvider>
          <MeProvider>
            <AuthRequired>
              <Layout />
            </AuthRequired>
          </MeProvider>
        </ClientProvider>
      </SkeletonTheme>
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
        element: <TagsViews tagType="EVENT" />,
      },
      {
        path: constants.ROUTES.QUARTERS,
        element: <TagsViews tagType="QUARTERS" />,
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
  return <RouterProvider router={router} fallbackElement={<SuspenseView />} />;
}

export default App;
