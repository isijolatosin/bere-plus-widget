import React from "react";
import { BEREPLUSWidget } from "./components/BEREPLUSWidget";
import "./index.css";

function App({ className: providedClassnames, auth }) {
  console.log(
    "FRom APP props*****************************",
    providedClassnames,
    auth
  );
  return (
    <div
      className={`p-3 sm:p-5 h-fit w-full sm:w-fit z-50 ${providedClassnames}`}
    >
      <BEREPLUSWidget auth={auth} />
    </div>
  );
}

export default App;
