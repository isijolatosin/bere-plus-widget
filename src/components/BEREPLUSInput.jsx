import React from "react";
import * as Yup from "yup";
import { Formik, Field, Form } from "formik";
import { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";

const BEREPLUSInput = ({
  textareaRef,
  loading,
  sendQuery,
  isStreaming,
  setValue,
}) => {
  const [input, setInput] = useState("");
  const [isBadWords, setIsBadWords] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const isMobile = window.matchMedia("(max-width:576px)").matches;
  const FormSchema = Yup.object().shape({
    message: Yup.string()
      .min(10, "Too Short!")
      .max(1000, "Too Long!")
      .required("Required"),
  });

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening) {
        // auto-restart if user wants to keep listening
        recognition.start();
      } else {
        setIsListening(false);
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setInput("");
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "#fff",
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    const maxHeight = el.scrollHeight;
    const lineHeight = parseInt(window.getComputedStyle(el).lineHeight) || 20;
    const maxAllowedHeight = lineHeight * 2;
    el.style.height = Math.min(maxHeight, maxAllowedHeight) + "px";
  }, [input]);

  const handleSubmit = (e) => {
    // Treat user input as untrusted. Validate structure,
    // constrain length, filter malicious patterns, isolate intent,
    // and wrap prompts so user input can’t override system instructions.

    try {
      let inputValue = e.message;

      if (input) {
        e?.preventDefault();
        inputValue = input;
      }

      const bannedPatterns = /ignore.*instruction|system prompt|jailbreak/i;
      if (bannedPatterns.test(inputValue)) {
        setIsBadWords(true);
        return;
      }

      const streamingData = JSON.parse(
        sessionStorage.getItem("ai_streaming_prompt")
      );
      const bufferData = JSON.parse(sessionStorage.getItem("ai_buffer_prompt"));

      const dataChoice = isStreaming ? streamingData : bufferData;
      const key = isStreaming ? "ai_streaming_prompt" : "ai_buffer_prompt";
      const normalizeInput = inputValue
        .normalize("NFKC")
        .replace(/[\u200B-\u200D\uFEFF]/g, "");

      if (dataChoice?.length > 0) {
        sessionStorage.setItem(
          key,
          JSON.stringify([...dataChoice, normalizeInput])
        );
      } else {
        sessionStorage.setItem(key, JSON.stringify([normalizeInput]));
      }

      sendQuery(normalizeInput);
      setInput("");
    } catch (error) {
      console.error("Error saving request:", error);
    }
  };

  const ThinkingText = ({ text, classnameColor }) => {
    return (
      <div
        className={`absolute
        z-20 font-thin
        bg-gradient-text bg-200%
        bg-clip-text 
        ${classnameColor}
        animate-gradient-move`}
      >
        {text}
      </div>
    );
  };

  return (
    <div className="relative rounded-lg text-white/50 bg-black border-2 border-white/10 px-1 sm:px-2 flex items-center justify-between">
      {loading && (
        <ThinkingText
          text="Thinking..."
          classnameColor="text-transparent left-0 text-sm top-[-50%]"
        />
      )}
      {input?.length > 1001 && (
        <ThinkingText
          text="prompt is too long..."
          classnameColor="text-red-500 right-5 italic tracking-widest text-[10px] top-[-40%]"
        />
      )}
      {isBadWords && (
        <ThinkingText
          text="Your prompt contains prohibited words..."
          classnameColor="text-red-500 right-5 italic tracking-widest text-[10px] top-[-40%]"
        />
      )}
      <div className="flex flex-row items-center h-fit w-fit mr-3">
        <p
          id="streaming"
          onClick={() => {
            sessionStorage.setItem("ai_response_type", true);
            setValue(true);
          }}
          className={`${
            String(isStreaming) === "true" ? "text-blue-500" : ""
          } text-[10px] hover:text-blue-500 transition-all duration-500 cursor-pointer`}
        >
          Stream
        </p>
        <p className="mx-[3px] sm:mx-[4px]">|</p>
        <p
          id="buffer"
          onClick={() => {
            sessionStorage.setItem("ai_response_type", false);
            setValue(false);
          }}
          className={`${
            String(isStreaming) === "true" ? "" : "text-blue-500"
          } text-[10px] hover:text-blue-500 transition-all duration-500 cursor-pointer`}
        >
          Buffer
        </p>
      </div>
      {isListening ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 bg-black text-red-500 mr-2 cursor-pointer hover:opacity-70 transition-all duration-300"
          onClick={stopListening}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="red"
          className="w-4 h-4 bg-black text-red-500 mr-2 cursor-pointer hover:opacity-70 transition-all duration-300"
          onClick={startListening}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
          />
        </svg>
      )}

      <Formik
        initialValues={{
          message: "",
        }}
        validationSchema={FormSchema}
        onSubmit={async (values, { resetForm }) => {
          handleSubmit(values);
          resetForm();
        }}
        className=""
      >
        {({ errors, touched }) => (
          <Form className="flex flex-row items-center justify-between gap-2 w-full h-[40px] bg-transparent">
            <div className="w-full h-full flex flex-row items-center justify-between">
              <Field
                name="message"
                className="textArea flex items-center w-full px-1 bg-transparent"
              >
                {({
                  field, // { name, value, onChange, onBlur }
                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                  meta,
                }) => (
                  <div className="relative w-full h-full flex items-center">
                    {input && (
                      <div className="absolute left-0 w-[100%] h-[90%] overflow-y-scroll bg-black pl-1">
                        <p className="whitespace-pre-wrap break-words leading-[16px] h-full">
                          {input}
                        </p>
                      </div>
                    )}
                    <textarea
                      id="chat_bot"
                      ref={textareaRef}
                      rows={1}
                      {...field}
                      disabled={loading || isListening || isMobile}
                      className={`resize-none border-none rounded-sm p-0 pl-1 bg-transparent h-full w-full outline-none no-scrollbar tracking-wider font-thin break-words ${
                        (meta.touched && meta.error) ||
                        input?.length > 1000 ||
                        isBadWords
                          ? "bg-red-900/30"
                          : "bg-black"
                      }`}
                      placeholder={"Ask on..."}
                    />
                  </div>
                )}
              </Field>
              {input ? (
                <button
                  className="w-fit"
                  type="submit"
                  disabled={loading || isListening || input?.length > 1000}
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <ClipLoader
                      color="#fff"
                      loading={loading}
                      cssOverride={override}
                      size={20}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                      className="w-4 h-4 bg-black ml-2 hover:text-white/30 ease-in duration-300"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                      />
                    </svg>
                  )}
                </button>
              ) : (
                <button
                  className="w-fit"
                  type="submit"
                  disabled={loading || isListening}
                >
                  {loading ? (
                    <ClipLoader
                      color="#fff"
                      loading={loading}
                      cssOverride={override}
                      size={20}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                      className="w-4 h-4 bg-black ml-2 hover:text-white/30 ease-in duration-300"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BEREPLUSInput;
