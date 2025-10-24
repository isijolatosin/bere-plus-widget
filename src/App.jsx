import React from "react";
import { BEREPLUSWidget } from "./components/BEREPLUSWidget";
import "./index.css";

function App({
  classNames: providedClassnames = "",
  wrapperClassnames = "",
  iconClassnames = "",
  onclick,
  auth,
}) {
  const Icon = ({ classnames, onclick }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={classnames}
      onClick={onclick}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );

  return (
    <div className={wrapperClassnames}>
      <div className={providedClassnames}>
        <BEREPLUSWidget auth={auth} />
      </div>
      <Icon classnames={iconClassnames} onclick={onclick} />
    </div>
  );
}

export default App;
