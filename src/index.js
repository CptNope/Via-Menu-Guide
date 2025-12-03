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
serviceWorkerRegistration.register({
  onSuccess: (workbox) => {
    console.log('Service worker registered successfully!');
    // Store workbox instance globally so App can access it
    window.workbox = workbox;
    // Dispatch custom event to notify App
    window.dispatchEvent(new Event('workboxReady'));
  },
  onUpdate: (workbox) => {
    console.log('New content is available; please refresh.');
    // Store workbox instance globally so App can access it
    window.workbox = workbox;
    // Dispatch custom event to notify App
    window.dispatchEvent(new Event('workboxUpdate'));
  },
});
