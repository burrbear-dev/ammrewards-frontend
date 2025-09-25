import { createPublicClient, defineChain, http } from "viem";
import type { ChefData, LpToken } from "./types";

const berachain = defineChain({
  id: 80085,
  name: "Berachain Artio",
  nativeCurrency: {
    decimals: 18,
    name: "BERA",
    symbol: "BERA",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.berachain.com/"],
    },
  },
  blockExplorers: {
    default: { name: "Berascan", url: "https://berascan.com" },
  },
});

const publicClient = createPublicClient({
  chain: berachain,
  transport: http(),
});

// Default MiniChef addresses
const defaultMiniChefAddress =
  "0x7a2be8e74f4ae28796828af7b685def78c20416c" as const;

const miniChefAbi = [
  {
    inputs: [],
    name: "poolLength",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "poolInfo",
    outputs: [
      { internalType: "uint128", name: "accBeraPerShare", type: "uint128" },
      { internalType: "uint64", name: "lastRewardTime", type: "uint64" },
      { internalType: "uint64", name: "allocPoint", type: "uint64" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_pid", type: "uint256" }],
    name: "lpToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "REWARD_TOKEN",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardTokenPerSecond",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const erc20Abi = [
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export async function getChefData(
  ammRewardsAddress: `0x${string}` = defaultMiniChefAddress
): Promise<ChefData | null> {
  try {
    const [poolLength, rewardTokenPerSecond, rewardTokenAddress] =
      await Promise.all([
        publicClient.readContract({
          address: ammRewardsAddress,
          abi: miniChefAbi,
          functionName: "poolLength",
        }),
        publicClient.readContract({
          address: ammRewardsAddress,
          abi: miniChefAbi,
          functionName: "rewardTokenPerSecond",
        }),
        publicClient.readContract({
          address: ammRewardsAddress,
          abi: miniChefAbi,
          functionName: "REWARD_TOKEN",
        }),
      ]);

    const rewardTokenSymbol = await publicClient.readContract({
      address: rewardTokenAddress,
      abi: erc20Abi,
      functionName: "symbol",
    });

    const poolIndexes = Array.from({ length: Number(poolLength) }, (_, i) => i);

    const lpTokensData = await Promise.all(
      poolIndexes.map(async (index) => {
        try {
          const [lpTokenAddress, poolInfo] = await Promise.all([
            publicClient.readContract({
              address: ammRewardsAddress,
              abi: miniChefAbi,
              functionName: "lpToken",
              args: [BigInt(index)],
            }),
            publicClient.readContract({
              address: ammRewardsAddress,
              abi: miniChefAbi,
              functionName: "poolInfo",
              args: [BigInt(index)],
            }),
          ]);

          let symbol = "N/A";
          if (lpTokenAddress !== "0x0000000000000000000000000000000000000000") {
            try {
              symbol = await publicClient.readContract({
                address: lpTokenAddress,
                abi: erc20Abi,
                functionName: "symbol",
              });
            } catch (e) {
              console.warn(`Could not fetch symbol for ${lpTokenAddress}:`, e);
            }
          }

          const allocPoint = poolInfo[2];

          return {
            index,
            address: lpTokenAddress,
            symbol,
            allocPoint: allocPoint.toString(),
          };
        } catch (error) {
          console.error(`Failed to fetch data for pool index ${index}:`, error);
          return null;
        }
      })
    );

    const lpTokens = lpTokensData.filter(
      (token): token is LpToken => token !== null
    );

    return {
      lpTokens,
      ammRewardsAddress,
      rewardTokenPerSecond,
      rewardTokenSymbol,
    };
  } catch (error) {
    console.error("Failed to fetch chef data:", error);
    return null;
  }
}
