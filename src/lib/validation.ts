import { isAddress } from "viem";

/**
 * Validates if a string is a valid Ethereum address
 */
export function isValidAddress(address: string): address is `0x${string}` {
  return isAddress(address);
}

/**
 * Validates if an address is in the list of known AMM rewards addresses
 */
export function isKnownAmmRewardsAddress(address: string): boolean {
  const knownAddresses = [
    "0x7a2be8e74f4ae28796828af7b685def78c20416c",
    "0x834bd0eb271cf98982e11578c2a7037f3e3d1b6b",
  ];

  return knownAddresses.includes(address.toLowerCase());
}

/**
 * Formats an address for display (truncated version)
 */
export function formatAddress(address: string, chars = 4): string {
  if (!isValidAddress(address)) return address;

  return `${address.slice(0, 2 + chars)}...${address.slice(-chars)}`;
}

/**
 * Validates contract interaction parameters
 */
export function validateContractParams(address: string): {
  isValid: boolean;
  error?: string;
} {
  if (!address) {
    return { isValid: false, error: "Contract address is required" };
  }

  if (!isValidAddress(address)) {
    return { isValid: false, error: "Invalid contract address format" };
  }

  if (!isKnownAmmRewardsAddress(address)) {
    return {
      isValid: false,
      error:
        "Contract address is not in the list of known AMM rewards contracts",
    };
  }

  return { isValid: true };
}
