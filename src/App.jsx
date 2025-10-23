import { BEREPLUSWidget } from "./components/BEREPLUSWidget";

function App({ position = {}, auth }) {
  const {
    offset = "absolute",
    bottom = "top-0",
    top = "",
    left = "left-0",
    right = "",
  } = position;

  return (
    <div
      className={`p-3 sm:p-5 h-fit w-full sm:w-fit ${offset} ${top} ${bottom} ${left} ${right}`}
    >
      <BEREPLUSWidget auth={auth} />
    </div>
  );
}

export default App;
