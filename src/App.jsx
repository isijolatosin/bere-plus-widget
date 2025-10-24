import React from "react";
import { BEREPLUSWidget } from "./components/BEREPLUSWidget";
import "./index.css";

function App({
  classNames: providedClassnames = "",
  wrapperClassnames = "",
  auth,
}) {
  return (
    <div className={`${wrapperClassnames}`}>
      <div className={`${providedClassnames}`}>
        <BEREPLUSWidget auth={auth} />
      </div>
    </div>
  );
}

export default App;
