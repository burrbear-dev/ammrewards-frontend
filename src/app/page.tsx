"use client";

import { LpTokenTable } from "@/components/lp-token-table";
import { RewardCalculator } from "@/components/reward-calculator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getChefData } from "@/lib/berachain";
import type { ChefData } from "@/lib/types";
import { Loader2, Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import { formatUnits } from "viem";

const AMM_REWARDS_ADDRESSES = [
  "0x7a2be8e74f4ae28796828af7b685def78c20416c",
  "0x834bd0eb271cf98982e11578c2a7037f3e3d1b6b",
] as const;

export default function Home() {
  const [ammRewardsAddress, setAmmRewardsAddress] = useState<`0x${string}`>(
    AMM_REWARDS_ADDRESSES[0]
  );
  const [chefData, setChefData] = useState<ChefData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChefData = async (address: `0x${string}`) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getChefData(address);
      setChefData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      setChefData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChefData(ammRewardsAddress);
  }, [ammRewardsAddress]);

  const handleAddressChange = (value: string) => {
    setAmmRewardsAddress(value as `0x${string}`);
  };

  const monthlyReward = chefData
    ? (chefData.rewardTokenPerSecond * 31536000n) / 12n
    : 0n;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="py-10">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-headline">
            AmmRewards
          </h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 md:px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 space-y-8">
            <Card className="w-full shadow-lg">
              <CardHeader>
                <CardTitle>Reward Contract Selection</CardTitle>
                <CardDescription>
                  Choose the AmmRewards contract to analyze.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      AmmRewards Contract Address
                    </label>
                    <Select
                      value={ammRewardsAddress}
                      onValueChange={handleAddressChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select contract address" />
                      </SelectTrigger>
                      <SelectContent>
                        {AMM_REWARDS_ADDRESSES.map((address) => (
                          <SelectItem key={address} value={address}>
                            <span className="font-mono text-sm">{address}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {loading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading contract data...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {chefData && !loading && (
              <Card className="w-full shadow-lg">
                <CardHeader>
                  <CardTitle>Reward Contract Details</CardTitle>
                  <CardDescription>
                    Key information about the MiniChefV2 rewards contract.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <span className="font-semibold text-foreground">
                        AmmRewards Contract:
                      </span>{" "}
                      <a
                        href={`https://berascan.com/address/${chefData.ammRewardsAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-primary hover:underline break-all"
                      >
                        {chefData.ammRewardsAddress}
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">
                        Reward Tokens / Second:
                      </span>{" "}
                      {formatUnits(chefData.rewardTokenPerSecond, 18)}{" "}
                      {chefData.rewardTokenSymbol}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">
                        Expected Reward Tokens / Month:
                      </span>{" "}
                      {formatUnits(monthlyReward, 18)}{" "}
                      {chefData.rewardTokenSymbol}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            <RewardCalculator />
          </div>
          <div className="lg:col-span-2">
            <Card className="w-full shadow-lg">
              <CardHeader>
                <CardTitle>Liquidity Pool Allocations</CardTitle>
                <CardDescription>
                  A list of pools from the{" "}
                  <a
                    href={`https://berascan.com/address/${ammRewardsAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    MiniChefV2
                  </a>{" "}
                  contract. Click headers to sort.
                </CardDescription>
              </CardHeader>

              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading pool data...
                    </div>
                  </div>
                ) : error ? (
                  <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error Loading Data</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : chefData ? (
                  <LpTokenTable data={chefData.lpTokens} />
                ) : (
                  <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Could Not Fetch Data</AlertTitle>
                    <AlertDescription>
                      There was an issue retrieving data from the Berachain
                      smart contract. Please try again later.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>AmmRewards - Exploring Berachain onchain data.</p>
      </footer>
    </div>
  );
}
