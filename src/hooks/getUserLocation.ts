export interface UserLocation {
  latitude: number | null;
  longitude: number | null;
  city: string;
  country: string;
  source: "gps" | "ip-based" | "none";
}

export const getUserLocation = async (
  api_url: string
): Promise<UserLocation> => {
  // Helper to call backend fallback
  const fetchIPLocation = async (): Promise<UserLocation> => {
    try {
      const res = await fetch(`${api_url}/get-location`);
      if (!res.ok) throw new Error("Failed to fetch IP location");
      const data = await res.json();

      return {
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        city: data.city ?? "Unknown City",
        country: data.country ?? "Unknown Country",
        source: "ip-based",
      };
    } catch (err) {
      console.error("Error fetching IP location:", err);
      throw new Error("Unable to determine location");
    }
  };

  return new Promise<UserLocation>((resolve) => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported — using IP fallback");
      fetchIPLocation()
        .then(resolve)
        .catch(() =>
          resolve({
            latitude: null,
            longitude: null,
            city: "Unknown City",
            country: "Unknown Country",
            source: "none",
          })
        );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position: GeolocationPosition) => {
        try {
          const { latitude, longitude } = position.coords;

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data: any = await res.json();

          const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.state;
          const country = data?.address?.country;

          resolve({
            latitude,
            longitude,
            city: city ?? "Unknown City",
            country: country ?? "Unknown Country",
            source: "gps",
          });
        } catch (err) {
          console.error("Reverse geocoding failed:", err);
          const ipData = await fetchIPLocation().catch(() => null);
          resolve(
            ipData ?? {
              latitude: null,
              longitude: null,
              city: "Unknown City",
              country: "Unknown Country",
              source: "none",
            }
          );
        }
      },
      async (error: GeolocationPositionError) => {
        console.warn(`Geolocation error (${error.code}): ${error.message}`);
        const ipData = await fetchIPLocation().catch(() => null);
        resolve(
          ipData ?? {
            latitude: null,
            longitude: null,
            city: "Unknown City",
            country: "Unknown Country",
            source: "none",
          }
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};
