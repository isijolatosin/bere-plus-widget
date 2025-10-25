import React from "react";
import {
  intentBorderClasses,
  intentColorClasses,
  intentRingClasses,
} from "../utils/intentColors";
import { Emotions } from "../utils/emotions";

const SimpleText = ({ txt }) => <p className="leading-5">{txt}</p>;

const BEREPLUSAIResponse = ({ response }) => {
  if (!response) return null;

  return (
    <div className=" bg-neutral-900 text-sm leading-5 text-white/50">
      <div className="w-[90%] bg-white/5 rounded-lg p-3">
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
          {response?.message && <SimpleText txt={response?.message} />}

          {Array.isArray(response.response) &&
            response.response.map((resp, idx) => {
              return (
                <div key={idx} className="flex flex-col gap-4">
                  <div className={`${intentColorClasses[response?.emotion]}`}>
                    {resp?.title && <SimpleText txt={resp?.title} />}
                  </div>

                  {resp?.description && <SimpleText txt={resp?.description} />}

                  {resp?.link && (
                    <a
                      href={resp?.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate max-w-[200px] w-[200px] hover:text-blue-400 transition-all duration-300 text-xs"
                    >
                      {resp?.link}
                    </a>
                  )}

                  {resp?.image_url && (
                    <img
                      src={resp?.image_url}
                      alt={resp?.title || ""}
                      className="w-full h-[250px] object-cover object-center"
                    />
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default BEREPLUSAIResponse;
