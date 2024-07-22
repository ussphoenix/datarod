import { AuthRequired, Layout } from "@components";
import constants from "@constants";
import { ClientProvider } from "@providers/ClientProvider";
import { MeProvider } from "@providers/MeProvider";
import { ErrorView } from "@views/ErrorView";
import { EventsView } from "@views/EventsView";
import { HomeView } from "@views/HomeView";
import { NotFoundView } from "@views/NotFoundView";
import { SuspenseView } from "@views/SuspenseView";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

function Root(): React.ReactNode {
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
      { path: constants.ROUTES.EVENTS, element: <EventsView /> },
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
