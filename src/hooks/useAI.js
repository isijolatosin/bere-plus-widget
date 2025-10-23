import { useState, useEffect } from "react";
import { getUserLocation } from "./getUserLocation";
import { isIMGUrlWorking } from "../utils/isIMGUrlWorking";

export const useAI = (auth) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const api_url =
    import.meta.env.MODE === "development"
      ? "/api" // Vite dev proxy
      : import.meta.env.VITE_BERE_PLUS_API;

  const sendQuery = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const { city, country } = await getUserLocation(api_url);

      const res = await fetch(`${api_url}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: query,
          location: `${city}, ${country}`,
          auth: auth,
          useMemory: true,
        }),
      });

      const result = await res.json();

      // Fetch images if missing
      const updatedResponses = await Promise.all(
        (result?.response || []).map(async (resp) => {
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
        })
      );

      setResponse({ ...result, response: updatedResponses });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (response) {
      sessionStorage.setItem("ai_response_data", JSON.stringify(response));
    }
  }, [response]);

  return { sendQuery, response, loading, error };
};
