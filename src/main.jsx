import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

export function initWidget(containerId, props = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container #${containerId} not found`);
    return;
  }

  const root = ReactDOM.createRoot(container);
  root.render(<App {...props} />);
}

// Attach to window for UMD usage
if (typeof window !== "undefined") {
  window.BerePlusWidget = { initWidget };
}
