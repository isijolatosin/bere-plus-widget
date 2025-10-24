import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // Tailwind styles

// Function to initialize widget anywhere
function initWidget(containerId, children, props = {}) {
  const container = document.getElementById(containerId);
  if (!container) return console.error(`Container #${containerId} not found`);

  const root = ReactDOM.createRoot(container);
  root.render(<App {...props}>{children}</App>);
}

export { initWidget };

// Only auto-mount in development (for demo)
if (process.env.NODE_ENV === "development") {
  const demoContainer = document.createElement("div");
  demoContainer.id = "bere-plus--widget-container";
  document.body.appendChild(demoContainer);

  const Icon = ({ classnames }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={classnames}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );

  initWidget(
    "bere-plus--widget-container",
    <Icon classnames="size-6 absolute top-0 left-0 text-white z-10" />,
    {
      classNames: "h-[100vh] w-full sm:w-[80%] max-w-[550px] flex items-end",
      wrapperClassnames:
        "w-full h-full bg-black/80 flex justify-start overflow-hidden relative",
      auth: { status: true, level: 1 },
    }
  );
}
