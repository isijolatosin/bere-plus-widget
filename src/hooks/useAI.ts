import { useState } from "react";
import { getUserLocation } from "./getUserLocation";
import { isIMGUrlWorking } from "../utils/isIMGUrlWorking";

export interface AIResponse {
  emotion: string;
  intent: string;
  summary: string;
  message?: string;
  response: {
    description?: string;
    image_url?: string;
    link?: string;
    title?: string;
  }[];
}

export interface AuthProp {
  status: boolean;
  level: number;
  intent?: string;
}

export const useAI = (auth: AuthProp) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const api_url =
    import.meta.env.MODE === "development"
      ? "/api" // will use the Vite proxy in dev
      : import.meta.env.VITE_BERE_PLUS_API;

  const sendQuery = async (query: string) => {
    setLoading(true);
    setError(null);

    const { city, country } = await getUserLocation(api_url);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      text: query,
      location: `${city}, ${country}`,
      auth: auth,
      useMemory: true,
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const res = await fetch(`${api_url}/analyze`, requestOptions);
      const result = await res.json();

      // Fetch images for responses that have a name
      const updatedResponses = await Promise.all(
        (result?.response || []).map(
          async (resp: { title: string; image_url: string }) => {
            const isWorkingUrl = await isIMGUrlWorking(resp?.image_url);

            if (resp?.title && (!resp?.image_url || !isWorkingUrl)) {
              try {
                const imgRes = await fetch(
                  `${api_url}/images?keyword=${encodeURIComponent(
                    resp.title
                  )}&num=1`
                );

                if (!imgRes.ok)
                  throw new Error(`Image fetch failed for ${resp.title}`);
                const imgData = await imgRes.json();
                return { ...resp, image_url: imgData.images?.[0] || "" };
              } catch (err) {
                console.error("Error fetching images for:", resp.title, err);
                return { ...resp, image_url: "" };
              }
            }
            return resp;
          }
        )
      );

      setResponse({ ...result, response: updatedResponses });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  sessionStorage.setItem("ai_response_data", JSON.stringify(response));
  return { sendQuery, response, loading, error };
};
