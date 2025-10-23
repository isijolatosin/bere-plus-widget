import { useEffect, useRef, useState } from "react";

export function useTypewriter(
  text: string,
  start: boolean,
  speed: number = 25,
  onDone?: () => void
) {
  const [typedText, setTypedText] = useState("");
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    // Prevent retyping if already finished
    if (!start || !text || hasFinishedRef.current) return;

    // Clear any existing interval (StrictMode safety)
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      indexRef.current++;
      setTypedText(text.slice(0, indexRef.current));

      if (indexRef.current >= text.length) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        hasFinishedRef.current = true;
        onDone?.();
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [start, text, speed, onDone]);

  // Reset typed text if input text changes
  useEffect(() => {
    setTypedText("");
    indexRef.current = 0;
    hasFinishedRef.current = false;
  }, [text]);

  return typedText;
}
