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
