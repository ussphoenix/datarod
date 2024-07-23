import { useContext } from "react";

import { GridLoading, Layout } from "@components";
import { MeContext, type MeContextInterface } from "@providers/MeProvider";
import { ErrorView } from "@views/ErrorView";
import { SuspenseView } from "@views/SuspenseView";

/**
 * Require an authenticated user to render children
 * If there is no authenticated user, redirect user to login
 */
export default function AuthRequired(
  props: React.PropsWithChildren,
): React.ReactNode {
  const { children } = props;
  const { me, meError }: MeContextInterface = useContext(MeContext);

  // Loading failed (context provider displayed an error toast)
  if (meError) {
    return (
      <Layout>
        <ErrorView />
      </Layout>
    );
  }

  if (!!me) {
    if (!me?.isAuthenticated && me?.loginUrl) {
      // user is unauthenticated, redirect to login
      window.location.replace(me.loginUrl);
      return <SuspenseView />;
    }
    if (me?.isAuthenticated) {
      return children;
    }
  }

  // Still loading in context provider
  return (
    <Layout>
      <GridLoading />
    </Layout>
  );
}
