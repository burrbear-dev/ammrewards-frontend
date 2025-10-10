/**
 * Utility functions for URL handling and sharing
 */

/**
 * Generates a shareable URL for a specific AMM rewards contract
 */
export function generateContractUrl(
  address: string,
  path: "pools" | "rewards" = "pools"
): string {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const encodedAddress = encodeURIComponent(address);

  if (path === "rewards") {
    return `${baseUrl}/${encodedAddress}/rewards`;
  }

  return `${baseUrl}/${encodedAddress}`;
}

/**
 * Extracts the contract address from the current URL
 */
export function extractAddressFromUrl(pathname: string): string | null {
  // Match patterns like /0x123.../rewards or /0x123...
  const match = pathname.match(/^\/([^\/]+)(?:\/rewards)?$/);
  if (match) {
    return decodeURIComponent(match[1]);
  }
  return null;
}

/**
 * Copies a URL to the clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand("copy");
      textArea.remove();
      return result;
    }
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
}

/**
 * Validates if a URL path contains a valid contract address
 */
export function isValidContractPath(pathname: string): boolean {
  const address = extractAddressFromUrl(pathname);
  if (!address) return false;

  // Basic Ethereum address validation
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
