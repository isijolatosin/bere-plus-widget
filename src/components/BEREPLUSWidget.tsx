import { useMemo, useRef } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import { useAI, type AuthProp } from "../hooks/useAI";
import FadeInSection from "./Framer";
import BEREPLUSAIResponse from "./BEREPLUSAIResponse";
import BEREPLUSInput from "./BEREPLUSInput";

interface WidgetProp {
  auth: AuthProp;
}

export const BEREPLUSWidget = ({ auth }: WidgetProp) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { sendQuery, response, loading, error } = useAI(auth);

  const MemoizedResponse = useMemo(
    () => <BEREPLUSAIResponse response={response} />,
    [response]
  );

  return (
    <div className="w-full sm:w-[30rem] font-saira font-thin text-sm">
      {error && (
        <FadeInSection>
          <div className="mb-2 rounded-full bg-black mx-auto w-full">
            <p className="text-center text-sm tracking-widest text-red-500 rounded-full py-1">
              {error}
            </p>
          </div>
        </FadeInSection>
      )}
      <Tippy
        content={MemoizedResponse}
        placement="top"
        visible={!!response}
        animation="fade"
        duration={1000}
        arrow={true}
        interactive={true}
      >
        <div>
          <BEREPLUSInput
            textareaRef={textareaRef}
            loading={loading}
            sendQuery={sendQuery}
          />
        </div>
      </Tippy>
    </div>
  );
};
