import { useContext } from "react";

import { Layout } from "@components";
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
  const { me, meLoading, meError }: MeContextInterface = useContext(MeContext);

  // Still loading in context provider
  if (meLoading) {
    return (
      <Layout>
        <SuspenseView />
      </Layout>
    );
  }

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
    }
    if (me?.isAuthenticated) {
      return children;
    }
  }

  // Catch-all error, handle a strange edge case like loginUrl absent
  return (
    <Layout>
      <ErrorView />
    </Layout>
  );
}
