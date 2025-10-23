import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // Tailwind styles

// Function to initialize widget anywhere
function initWidget(containerId, props = {}) {
  const container = document.getElementById(containerId);
  if (!container) return console.error(`Container #${containerId} not found`);

  console.log("props*****************************", props);

  const root = ReactDOM.createRoot(container);
  root.render(<App {...props} />);
}

export { initWidget };

// Only auto-mount in development (for demo)
if (process.env.NODE_ENV === "development") {
  const demoContainer = document.createElement("div");
  demoContainer.id = "bere-plus--widget-container";
  document.body.appendChild(demoContainer);

  initWidget("bere-plus--widget-container", {
    className: "absolute left-0 z-50",
    auth: { status: true, level: 1 },
  });
}
