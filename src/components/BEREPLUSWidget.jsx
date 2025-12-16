import React, { useEffect, useState } from "react";
import { useMemo, useRef } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import { useAI } from "../hooks/useAI";
import FadeInSection from "./Framer";
import BEREPLUSAIResponse from "./BEREPLUSAIResponse";
import BEREPLUSInput from "./BEREPLUSInput";
import { useLocalStorageState } from "../utils/useLocalStorageState";

export const BEREPLUSWidget = ({ user }) => {
  const bottomRef = useRef(null);
  const textareaRef = useRef(null); // fixed
  const [responseData, setResponsedata] = useState([]);
  const [isStreaming, setValue] = useLocalStorageState(
    "ai_response_type",
    null
  );
  const _isStreaming = String(isStreaming) === "true";
  // const isStreaming = sessionStorage.getItem("ai_response_type") === "true";
  const { sendQuery, response, loading, error } = useAI(user, _isStreaming);
  const aiIBufferPrompt = JSON.parse(
    sessionStorage.getItem("ai_buffer_prompt")
  );
  const aiStreamingPrompt = JSON.parse(
    sessionStorage.getItem("ai_streaming_prompt")
  );
  let responseArray = [];

  useEffect(() => {
    // Get stored data
    const storedData = sessionStorage.getItem("ai_response_data") || [];
    const streamingData =
      JSON.parse(sessionStorage.getItem("ai_streaming_data")) || [];
    if (!_isStreaming) {
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

    if (_isStreaming) {
      setResponsedata(streamingData);
    }
  }, [response, _isStreaming]);

  // Memoize the rendered list of responses
  useEffect(
    () => {
      if (_isStreaming) {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      } else {
        const lastId = `${responseData?.length - 1}_id`;
        const lastElement = document.getElementById(lastId);

        if (lastElement) {
          lastElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    },
    [responseData, response],
    _isStreaming
  );

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "ai_response_type") {
        setValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [_isStreaming]);

  const MemoizedResponse = useMemo(() => {
    if (_isStreaming) {
      return (
        <div className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-4 w-[600px] max-w-[100%] h-fit max-h-[70vh] sm:max-h-[90vh] overflow-scroll no-scrollbar text-sm leading-5 text-white/50 flex flex-col">
          {responseData?.length > 0 &&
            responseData?.map((res, index) => (
              <div key={index} id={`${index}_id`}>
                <div className="w-full flex py-5">
                  <p className="bg-white/5 w-fit px-2 py-1 rounded-lg rounded-br-none items-end ml-auto">
                    {aiStreamingPrompt?.[index]}
                  </p>
                </div>
                <div className="border-t-[0.5px] border-white/5 py-1">
                  {typeof res === "string" &&
                    res.split("\n\n").map((r, idx) => (
                      <p key={`0_${idx}`} className="my-3">
                        {r.includes('"error":') ? (
                          <span className="bg-red-900/20 px-2 py-1 rounded-sm">
                            {r.split('"error":')[1].replace(/["}]/g, "")}
                          </span>
                        ) : (
                          r
                        )}
                      </p>
                    ))}
                </div>
              </div>
            ))}
          {response && !responseData.includes(response) && (
            <div id="0_id">
              <div className="w-full flex py-5">
                <p className="bg-white/15 w-fit px-2 py-1 rounded-lg rounded-br-none items-end ml-auto">
                  {aiStreamingPrompt?.[aiStreamingPrompt?.length - 1]}
                </p>
              </div>
              {response?.split("\n\n").map((r, idx) => (
                <p key={`#-${idx}`} className="my-3">
                  {r}
                </p>
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      );
    }
    return (
      <div className="rounded-lg border border-white/10 bg-black px-4 py-4 h-[70vh] sm:h-[90vh] overflow-scroll no-scrollbar text-sm leading-5 text-white/50 flex flex-col">
        {responseData?.map((res, index) => (
          <div key={index}>
            <div className="w-full flex py-5">
              <p className="bg-white/15 w-fit px-2 py-1 rounded-lg rounded-br-none items-end ml-auto">
                {aiIBufferPrompt?.[index]}
              </p>
            </div>
            {res?.error ? (
              <div
                id={`${index}_id`}
                className="bg-red-900/20 pl-2 py-1 rounded-sm"
              >
                <p>{res?.error}</p>
              </div>
            ) : (
              <BEREPLUSAIResponse
                compId={`${index}_id`}
                key={index}
                response={res}
              />
            )}
          </div>
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
              {error ?? error.error}
            </p>
          </div>
        </FadeInSection>
      )}
      <Tippy
        content={MemoizedResponse}
        placement="top"
        visible={(response && _isStreaming) || responseData?.length > 0}
        animation={_isStreaming ? "" : "fade"}
        duration={3000}
        arrow={!_isStreaming}
        interactive={true}
        maxWidth="none"
        popperOptions={{
          modifiers: [
            {
              name: "size",
              enabled: true,
              phase: "beforeWrite",
              fn({ state }) {
                state.styles.popper.width = `${state.rects.reference.width}px`;
              },
            },
          ],
        }}
      >
        <div>
          <BEREPLUSInput
            textareaRef={textareaRef}
            loading={loading}
            sendQuery={sendQuery}
            isStreaming={_isStreaming}
            setValue={setValue}
          />
        </div>
      </Tippy>
    </div>
  );
};
