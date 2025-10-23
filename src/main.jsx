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

// Expose globally for embedding
window.WEB_CDN_BERE_PLUS_WIDGET = {
  initWidget,
};

// Automatically render for demo in dev
initWidget("bere-plus--widget-container", {
  className: "absolute bottom-0 left-0 z-50",
  auth: { status: true, level: 2 },
});
