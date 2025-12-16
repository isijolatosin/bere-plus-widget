import { useState } from "react";

export function useLocalStorageState(key, initialValue) {
  const [isStreaming, setState] = useState(() => {
    return sessionStorage.getItem(key) ?? initialValue;
  });

  const setValue = (value) => {
    sessionStorage.setItem(key, value);
    setState(value);
  };

  return [isStreaming, setValue];
}
