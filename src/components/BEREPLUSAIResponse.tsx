import { type FC } from "react";
import type { AIResponse } from "../hooks/useAI";
import {
  intentBorderClasses,
  intentColorClasses,
  intentRingClasses,
} from "../utils/intentColors";
import { Emotions } from "../utils/emotions";
// import { useTypewriter } from "../utils/useTypewriter";

interface BEREPLUSAIResponseProps {
  response: AIResponse | null; // or whatever type your response is
}

interface SimpleTextProp {
  txt: string;
}

const SimpleText = ({ txt }: SimpleTextProp) => (
  <p className="leading-5">{txt}</p>
);

const BEREPLUSAIResponse: FC<BEREPLUSAIResponseProps> = ({ response }) => {
  // Retrieve the object
  const response_Data = sessionStorage.getItem("ai_response_data");
  const parsed_response_data = JSON.parse(response_Data as string);
  const ai_input_prompt = sessionStorage.getItem("ai_input_prompt");

  if (!response) {
    response = parsed_response_data;
  }

  if (!response) return;

  return (
    <div className="mb-1 rounded-2xl border border-white/10 bg-neutral-900 px-4 pt-4 pb-6 min-h-[445px] w-full h-[80vh] xs:h-[60vh] overflow-scroll no-scrollbar text-sm leading-5 text-white/50">
      <div className="w-full flex  pb-3 mb-5 border-b-[0.5px] border-white/10">
        <p className="bg-white/10 w-fit px-2 py-1 rounded-lg rounded-br-none items-end ml-auto">
          {ai_input_prompt}
        </p>
      </div>
      <h4 className="text-lg font-semibold bg-transparent capitalize">
        {response?.emotion}{" "}
        <span className="text-white">{Emotions[`${response?.emotion}`]}</span>
      </h4>
      <p
        className={`mt-2 bg-transparent tracking-widest border-l-[0.5px] pl-3 ${
          intentBorderClasses[response?.intent]
        }`}
      >
        {response?.summary}
      </p>
      <div
        className={`mt-6 p-3 aspect-video rounded-xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] ring-1 ring-inset tracking-widest ${
          intentRingClasses[response?.intent]
        }`}
      >
        {/* message */}
        {response?.message && <SimpleText txt={response?.message} />}

        {response?.response?.map((resp, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-4 mb-5 pb-5 border-b-[0.5px] border-white/10"
          >
            <div className={`${intentColorClasses[response?.emotion]}`}>
              {/* title */}
              {resp?.title && <SimpleText txt={resp?.title} />}
            </div>

            {/* description */}
            {resp?.description && <SimpleText txt={resp?.description} />}

            {/* link */}
            {resp?.link && (
              <a
                href={resp?.link}
                target="_blank"
                className="ellipsis max-w-[200px] w-[200px] hover:text-blue-400 transition-all duration-300 text-xs"
              >
                {resp?.link}
              </a>
            )}

            <>{console.log("resp?.image_url", resp?.image_url)}</>
            {/* image_url */}
            {resp?.image_url && (
              <img
                src={resp?.image_url}
                alt={resp?.title}
                className="w-full h-[250px] object-cover object-center"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BEREPLUSAIResponse;
