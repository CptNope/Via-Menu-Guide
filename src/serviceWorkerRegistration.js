// This optional code is used to register a service worker.
// register() is not called by default in CRA, but we use it here
// so the app works offline and loads faster.

import { Workbox } from 'workbox-window';

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    window.location.hostname.match(
      /^127(?:\.\d{1,3}){3}$/
    )
);

let wb;

export function register(config) {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // This is running on localhost. Check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

// Get the Workbox instance for external use
export function getWorkbox() {
  return wb;
}

function registerValidSW(swUrl, config) {
  wb = new Workbox(swUrl);

  // Event: Service worker activated for the first time
  wb.addEventListener('activated', event => {
    // Content is cached for offline use
    if (config && config.onSuccess) {
      config.onSuccess(wb);
    }
    
    // Optional: Track version
    if (!event.isUpdate) {
      console.log('Service worker activated for the first time!');
    }
  });

  // Event: A new service worker has installed but is waiting to activate
  wb.addEventListener('waiting', event => {
    console.log('A new service worker has installed, but it cannot activate until all tabs running the current version have been closed.');
    
    // Notify the app that an update is available
    if (config && config.onUpdate) {
      config.onUpdate(wb);
    }
  });

  // Event: Service worker has been updated and activated
  wb.addEventListener('controlling', event => {
    console.log('Service worker is now controlling the page.');
    
    // Reload the page to use the new version
    window.location.reload();
  });

  // Check for updates periodically (every hour)
  setInterval(() => {
    wb.update();
  }, 60 * 60 * 1000); // 1 hour

  // Register the service worker
  wb.register()
    .then(registration => {
      console.log('Service worker registered successfully');
      
      // Check for updates immediately on registration
      registration.update();
    })
    .catch(error => {
      console.error("Error during service worker registration:", error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found.
  fetch(swUrl, {
    headers: { "Service-Worker": "script" },
  })
    .then(response => {
      const contentType = response.headers.get("content-type");
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        // No service worker found.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log("No internet connection found. App is running in offline mode.");
    });
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}
