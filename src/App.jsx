import React from "react";
import { BEREPLUSWidget } from "./components/BEREPLUSWidget";
import "./index.css";

function App({ className: providedClassnames, auth }) {
  return (
    <div className={`p-3 sm:p-5 h-fit w-full sm:w-fit ${providedClassnames}`}>
      <BEREPLUSWidget auth={auth} />
    </div>
  );
}

export default App;
