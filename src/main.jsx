import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // Tailwind styles

// Function to initialize widget anywhere
function initWidget(containerId, props = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container #${containerId} not found`);
    return;
  }

  const root = ReactDOM.createRoot(container);
  root.render(<App {...props} />);
}

// Expose globally so external sites can call it
if (typeof window !== "undefined") {
  window.WEB_CDN_BERE_PLUS_WIDGET = window.WEB_CDN_BERE_PLUS_WIDGET || {};
  window.WEB_CDN_BERE_PLUS_WIDGET.initWidget = initWidget;
}

// Only auto-mount in development (for demo)
if (process.env.NODE_ENV === "development") {
  const demoContainer = document.createElement("div");
  demoContainer.id = "bere-plus--widget-container";
  document.body.appendChild(demoContainer);

  initWidget("bere-plus--widget-container", {
    className: "absolute bottom-10 left-0 z-50",
    auth: { status: true, level: 2 },
  });
}
