import {
  useEffect,
  useRef,
  useState,
  type FC,
  type FormEvent,
  type RefObject,
} from "react";
import { ClipLoader } from "react-spinners";

interface BEREPLUSInputProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  loading: boolean;
  sendQuery: (input: string) => void; // added type for sendQuery
}

const BEREPLUSInput: FC<BEREPLUSInputProps> = ({
  textareaRef,
  loading,
  sendQuery,
}) => {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Use either prefixed or unprefixed API
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Sorry, your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false; // set true if you want ongoing detection
    recognitionRef.current = recognition;

    // When speech is recognized
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      setInput(transcript);
    };

    recognition.onerror = (event: { error: any }) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
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
    borderColor: "text-white",
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto"; // Reset height before recalculating
    const maxHeight = el.scrollHeight; // full height needed for content

    // Calculate height for 2 lines
    const lineHeight = parseInt(window.getComputedStyle(el).lineHeight);
    const maxAllowedHeight = lineHeight * 2;

    // Apply the smaller of the two
    el.style.height = Math.min(maxHeight, maxAllowedHeight) + "px";
  }, [input]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    sessionStorage.setItem("ai_input_prompt", input);
    sendQuery(input);
    setInput("");
  };

  return (
    <div className="rounded-full text-white/50 bg-black border-2 border-white/10 py-1 px-4 flex items-center justify-between overflow-hidden">
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

      <form
        onSubmit={handleSubmit}
        className="flex flex-row items-center justify-between gap-2 w-full h-[40px] bg-transparent"
      >
        <div className="textArea flex items-center w-full h-full px-1 bg-transparent">
          <textarea
            ref={textareaRef}
            rows={1}
            disabled={loading || isListening}
            className="resize-none border-none p-0 bg-transparent w-full h-full outline-none no-scrollbar tracking-wider font-thin"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
          />
        </div>

        <button className="w-fit" type="submit" disabled={loading}>
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
      </form>
    </div>
  );
};

export default BEREPLUSInput;
