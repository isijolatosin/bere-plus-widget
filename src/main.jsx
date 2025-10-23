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
window.BerePlusWidget = {
  initWidget,
};

// Automatically render for demo in dev
initWidget("bere-plus--widget-container", {
  position: { offset: "absolute", bottom: "bottom-0", left: "left-0" },
  auth: { status: true, level: 2 },
});
