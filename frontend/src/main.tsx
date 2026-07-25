import React, { Suspense } from "react";

import SuspenseView from "@views/SuspenseView/SuspenseView.tsx";
import ReactDOM from "react-dom/client";
import { SkeletonTheme } from "react-loading-skeleton";

import App from "./App.tsx";

import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Unable to find #root element to mount the application");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <SkeletonTheme baseColor="#10171E" highlightColor="#15202B">
      <Suspense fallback={<SuspenseView />}>
        <App />
      </Suspense>
    </SkeletonTheme>
  </React.StrictMode>,
);
