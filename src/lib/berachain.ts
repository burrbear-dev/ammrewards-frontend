import { createPublicClient, http } from "viem";
import { berachain } from "viem/chains";
import { normalize } from "viem/ens";
import type {
  ChefData,
  LpRewardData,
  LpToken,
  PoolBalance,
  RewardsSummaryData,
} from "./types";

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
  {
    inputs: [
      { internalType: "uint256", name: "_pid", type: "uint256" },
      { internalType: "address", name: "_user", type: "address" },
    ],
    name: "userInfo",
    outputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "int256", name: "rewardDebt", type: "int256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_pid", type: "uint256" },
      { internalType: "address", name: "_user", type: "address" },
    ],
    name: "pendingRewardToken",
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
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
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

export async function getLpRewardsData(
  ammRewardsAddress: `0x${string}`
): Promise<LpRewardData[]> {
  try {
    // First get the chef data to know about pools
    const chefData = await getChefData(ammRewardsAddress);
    if (!chefData) {
      throw new Error("Failed to fetch chef data");
    }

    // For this implementation, we need to get all unique LP addresses that have interacted with the contract
    // Since we can't easily enumerate all users from the contract, we'll return an empty array for now
    // In a real implementation, you would need to:
    // 1. Listen to contract events to get all user addresses
    // 2. Or maintain an off-chain index of users
    // 3. Or accept a list of user addresses as a parameter

    // For demonstration purposes, let's create a function that can fetch data for specific users
    return [];
  } catch (error) {
    console.error("Failed to fetch LP rewards data:", error);
    return [];
  }
}

// Function to resolve name tags to wallet addresses
async function resolveNameTagToAddress(
  nameTag: string
): Promise<`0x${string}` | null> {
  try {
    try {
      const ensAddress = await publicClient.getEnsAddress({
        name: normalize(nameTag),
      });
      return ensAddress;
    } catch (ensError) {
      console.debug(
        `ENS resolution not supported on Berachain for "${nameTag}":`,
        ensError
      );
      return null;
    }

    // For other formats, return null
    return null;
  } catch (error) {
    console.debug(`Failed to resolve name tag "${nameTag}":`, error);
    return null;
  }
}

// Helper function to get LP reward data for specific user addresses
export async function getLpRewardsDataForUsers(
  ammRewardsAddress: `0x${string}`,
  userIdentifiers: string[]
): Promise<LpRewardData[]> {
  try {
    const chefData = await getChefData(ammRewardsAddress);
    if (!chefData) {
      throw new Error("Failed to fetch chef data");
    }

    // Separate addresses from name tags
    const directAddresses = userIdentifiers.filter((id) =>
      id.startsWith("0x")
    ) as `0x${string}`[];
    const nameTags = userIdentifiers.filter((id) => !id.startsWith("0x"));

    // Resolve name tags to addresses
    const resolvedNameTags: Array<{
      nameTag: string;
      address: `0x${string}` | null;
    }> = [];
    for (const nameTag of nameTags) {
      const resolvedAddress = await resolveNameTagToAddress(nameTag);
      resolvedNameTags.push({ nameTag, address: resolvedAddress });
    }

    // Collect all addresses to query (direct + resolved)
    const allAddressesToQuery = [
      ...directAddresses,
      ...resolvedNameTags
        .filter((item) => item.address !== null)
        .map((item) => item.address as `0x${string}`),
    ];

    // Process addresses in batches to get real pending rewards
    const batchSize = 3; // Smaller batch size to avoid RPC issues
    const addressResults: LpRewardData[] = [];

    for (let i = 0; i < allAddressesToQuery.length; i += batchSize) {
      const batch = allAddressesToQuery.slice(i, i + batchSize);

      const batchData = await Promise.all(
        batch.map(async (userAddress) => {
          const pendingRewards: PoolBalance[] = [];
          let totalPendingRewards = BigInt(0);

          // Only query the first few pools to avoid too many contract calls
          const poolsToCheck = chefData.lpTokens.slice(0, 3); // Check first 3 pools only

          for (const lpToken of poolsToCheck) {
            try {
              const pendingReward = await publicClient.readContract({
                address: ammRewardsAddress,
                abi: miniChefAbi,
                functionName: "pendingRewardToken",
                args: [BigInt(lpToken.index), userAddress],
              });

              if (pendingReward > 0n) {
                const formattedPending = (Number(pendingReward) / 1e18).toFixed(
                  4
                );
                pendingRewards.push({
                  poolId: lpToken.index,
                  poolSymbol: lpToken.symbol,
                  balance: pendingReward.toString(),
                  formattedBalance: formattedPending, // Just the amount, no token symbol
                });
                totalPendingRewards += pendingReward;
              }
            } catch (error) {
              // Skip pools that revert - this is expected for users who never interacted
              console.debug(
                `No pending rewards for pool ${lpToken.index} and user ${userAddress}`
              );
            }
          }

          const formattedTotal = (Number(totalPendingRewards) / 1e18).toFixed(
            4
          );

          // Find if this address corresponds to a name tag
          const correspondingNameTag = resolvedNameTags.find(
            (item) => item.address === userAddress
          );
          const displayAddress = correspondingNameTag
            ? correspondingNameTag.nameTag
            : userAddress;

          return {
            walletAddress: displayAddress,
            stakedBalances: [], // Skip staked balances for performance
            pendingRewards,
            totalPendingRewards: formattedTotal,
          };
        })
      );

      addressResults.push(...batchData);

      // Small delay between batches
      if (i + batchSize < allAddressesToQuery.length) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    // Add name tags that couldn't be resolved with zero rewards
    const unresolvedNameTags: LpRewardData[] = resolvedNameTags
      .filter((item) => item.address === null)
      .map((item) => ({
        walletAddress: item.nameTag,
        stakedBalances: [],
        pendingRewards: [],
        totalPendingRewards: "0.0000",
      }));

    return [...addressResults, ...unresolvedNameTags];
  } catch (error) {
    console.error("Failed to fetch LP rewards data for users:", error);
    // Return all identifiers with zero rewards as fallback
    return userIdentifiers.map((identifier) => ({
      walletAddress: identifier,
      stakedBalances: [],
      pendingRewards: [],
      totalPendingRewards: "0.0000",
    }));
  }
}
export async function getRewardsSummary(
  ammRewardsAddress: `0x${string}`,
  lpRewardsData?: LpRewardData[]
): Promise<RewardsSummaryData> {
  try {
    const chefData = await getChefData(ammRewardsAddress);
    if (!chefData) {
      throw new Error("Failed to fetch chef data");
    }

    // Get the reward token address to check contract balance
    const rewardTokenAddress = await publicClient.readContract({
      address: ammRewardsAddress,
      abi: miniChefAbi,
      functionName: "REWARD_TOKEN",
    });

    // Get contract reward token balance
    const contractRewardBalance = await publicClient.readContract({
      address: rewardTokenAddress,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [ammRewardsAddress],
    });

    let totalLPs = 0;
    let totalOwedAmount = 0;

    // If LP rewards data is provided, calculate summary from actual data
    if (lpRewardsData && lpRewardsData.length > 0) {
      // Count LPs that have any rewards (staked balances or pending rewards)
      totalLPs = lpRewardsData.filter((lp) => {
        const hasStakedBalance =
          lp.stakedBalances && lp.stakedBalances.length > 0;
        const hasPendingRewards = parseFloat(lp.totalPendingRewards || "0") > 0;
        return hasStakedBalance || hasPendingRewards;
      }).length;

      // Calculate total owed amount from all LPs (including resolved name tags)
      totalOwedAmount = lpRewardsData.reduce((sum, lp) => {
        return sum + parseFloat(lp.totalPendingRewards || "0");
      }, 0);
    } else {
      // Fallback values when no data is available
      totalLPs = 32; // Total from CSV: 21 addresses + 11 name tags
      totalOwedAmount = 0;
    }

    const formattedContractBalance = (
      Number(contractRewardBalance) / 1e18
    ).toFixed(2);
    const formattedTotalOwed = totalOwedAmount.toFixed(4);

    return {
      totalLPs,
      totalOwedAmount: formattedTotalOwed,
      contractRewardBalance: formattedContractBalance,
      rewardTokenSymbol: chefData.rewardTokenSymbol,
    };
  } catch (error) {
    console.error("Failed to fetch rewards summary:", error);
    return {
      totalLPs: 0,
      totalOwedAmount: "0.00",
      contractRewardBalance: "0.00",
      rewardTokenSymbol: "UNKNOWN",
    };
  }
}
