import React, { Suspense } from "react";

import SuspenseView from "@views/SuspenseView/SuspenseView.tsx";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<SuspenseView />}>
      <App />
    </Suspense>
  </React.StrictMode>,
);
