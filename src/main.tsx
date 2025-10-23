import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

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

function initWidget() {
  const container = document.createElement("div");
  container.id = "my-widget-root";
  document.body.appendChild(container);
  ReactDOM.createRoot(container).render(
    <App position={position || {}} auth={auth} />
  );
}

initWidget();
