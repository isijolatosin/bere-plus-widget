import React from "react";
import { BEREPLUSWidget } from "./components/BEREPLUSWidget";
import "./index.css";

function App({
  classNames: providedClassnames = "",
  wrapperClassnames = "",
  auth,
  children,
}) {
  return (
    <div className={wrapperClassnames}>
      <div className={providedClassnames}>
        <BEREPLUSWidget auth={auth} />
      </div>
      {children}
    </div>
  );
}

export default App;
