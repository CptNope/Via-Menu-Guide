import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/Via-Menu-Guide">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Register the service worker for PWA offline support
serviceWorkerRegistration.register();
