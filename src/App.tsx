import { BEREPLUSWidget } from "./components/BEREPLUSWidget";
import type { AuthProp } from "./hooks/useAI";

interface PositionProp {
  position: {
    offset?: string;
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  auth: AuthProp;
}

function App({ position, auth }: PositionProp) {
  const { offset, bottom, left, right } = position;

  return (
    <div
      className={`p-3 sm:p-5 h-fit w-full sm:w-fit ${
        position ? `${offset} ${bottom} ${left} ${right} ${top}` : ""
      }`}
    >
      <BEREPLUSWidget auth={auth} />
    </div>
  );
}

export default App;
