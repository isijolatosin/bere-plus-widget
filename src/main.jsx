import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const position = {
  offset: "absolute",
  // top: "top-0",
  bottom: "bottom-0",
  // right: "right-0",
  left: "left-0",
};

const auth = {
  status: true,
  level: 2,
  intent: "",
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App position={position || {}} auth={auth} />
  </StrictMode>
);
