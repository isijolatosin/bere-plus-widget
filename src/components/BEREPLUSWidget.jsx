import React, { useEffect, useState } from "react";
import { useMemo, useRef } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import { useAI } from "../hooks/useAI";
import FadeInSection from "./Framer";
import BEREPLUSAIResponse from "./BEREPLUSAIResponse";
import BEREPLUSInput from "./BEREPLUSInput";

export const BEREPLUSWidget = ({ auth }) => {
  const textareaRef = useRef(null); // fixed
  const [responseData, setResponsedata] = useState([]);
  const { sendQuery, response, loading, error } = useAI(auth);
  const aiInputPrompt = JSON.parse(sessionStorage.getItem("ai_input_prompt"));
  let responseArray = [];

  useEffect(() => {
    // Get stored data
    const storedData = sessionStorage.getItem("ai_response_data");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);

        if (Array.isArray(parsed)) {
          // Already an array
          setResponsedata(parsed);
        } else if (parsed && typeof parsed === "object") {
          // It's a single object
          setResponsedata([parsed]);
        } else {
          setResponsedata([]);
        }
      } catch (e) {
        console.error("Failed to parse stored AI response data:", e);
        setResponsedata([]);
      }
    }
  }, [response]);

  // Memoize the rendered list of responses
  useEffect(() => {
    const lastId = `${responseData.length - 1}_id`;
    const lastElement = document.getElementById(lastId);

    if (lastElement) {
      lastElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [responseData]);

  const MemoizedResponse = useMemo(() => {
    return (
      <div className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-4 h-[70vh] sm:h-[90vh] overflow-scroll no-scrollbar text-sm leading-5 text-white/50 flex flex-col">
        {responseData?.map((res, index) => (
          <>
            <div id={`${index}_id`} className="w-full flex py-5">
              <p className="bg-white/15 w-fit px-2 py-1 rounded-lg rounded-br-none items-end ml-auto">
                {aiInputPrompt?.[index]}
              </p>
            </div>
            <BEREPLUSAIResponse key={index} response={res} />
          </>
        ))}
      </div>
    );
  }, [responseArray]);

  return (
    <div className="w-[100%] font-saira font-thin text-sm">
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
        visible={responseData?.length > 0}
        animation="fade"
        duration={3000}
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
