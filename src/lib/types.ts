export interface LpToken {
  index: number;
  address: `0x${string}`;
  symbol: string;
  allocPoint: string;
}

export interface ChefData {
  lpTokens: LpToken[];
  ammRewardsAddress: `0x${string}`;
  rewardTokenPerSecond: bigint;
  rewardTokenSymbol: string;
}

export interface PoolBalance {
  poolId: number;
  poolSymbol: string;
  balance: string;
  formattedBalance: string; // "{SYMBOL} XX.XX"
}

export interface LpRewardData {
  walletAddress: string; // Can be either 0x address or name tag
  stakedBalances: PoolBalance[];
  pendingRewards: PoolBalance[];
  totalPendingRewards: string;
}

export interface RewardsSummaryData {
  totalLPs: number;
  totalOwedAmount: string;
  contractRewardBalance: string;
  rewardTokenSymbol: string;
}
