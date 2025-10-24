import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // Tailwind styles

// Function to initialize widget anywhere
function initWidget(containerId, props = {}) {
  const container = document.getElementById(containerId);
  if (!container) return console.error(`Container #${containerId} not found`);

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
    classNames:
      "h-[100vh] w-full sm:w-[80%] max-w-[550px] flex items-start z-50",
    wrapperClassnames:
      "w-full h-full bg-black/80 flex justify-end overflow-hidden",
    auth: { status: true, level: 1 },
  });
}
