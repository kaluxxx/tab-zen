export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    // For file:// URLs, return the full URL since there's no meaningful hostname
    if (urlObj.protocol === 'file:') {
      return url;
    }
    return urlObj.hostname;
  } catch {
    return url;
  }
}