/**
 * Checks if a URL is reachable (not broken).
 * @param url The URL to test
 * @returns Promise<boolean> true if URL is reachable, false otherwise
 */
export async function isIMGUrlWorking(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;

    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
}
