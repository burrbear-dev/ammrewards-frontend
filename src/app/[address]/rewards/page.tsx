"use client";

import { ErrorBoundary } from "@/components/error-boundary";
import { ErrorDisplay, NoDataDisplay } from "@/components/error-display";
import { LPInfoPanel } from "@/components/lp-info-panel";
import { LpRewardsTable } from "@/components/lp-rewards-table";
import { Navigation } from "@/components/navigation";
import { RewardsSummary } from "@/components/rewards-summary";
import { ShareButton } from "@/components/share-button";
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
import { getLpRewardsDataForUsers, getRewardsSummary } from "@/lib/berachain";
import { loadLPAddresses } from "@/lib/lp-data-loader";
import type { LpRewardData, RewardsSummaryData } from "@/lib/types";
import { validateContractParams } from "@/lib/validation";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

const AMM_REWARDS_ADDRESSES = [
  "0x7a2be8e74f4ae28796828af7b685def78c20416c",
  "0x834bd0eb271cf98982e11578c2a7037f3e3d1b6b",
] as const;

interface PageProps {
  params: Promise<{
    address: string;
  }>;
}

export default function AddressRewardsPage({ params }: PageProps) {
  const router = useRouter();
  const [lpRewardsData, setLpRewardsData] = useState<LpRewardData[]>([]);
  const [summaryData, setSummaryData] = useState<RewardsSummaryData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");

  // Unwrap the params Promise and decode the address from URL
  const resolvedParams = use(params);
  const ammRewardsAddress = decodeURIComponent(
    resolvedParams.address
  ) as `0x${string}`;

  const fetchRewardsData = async (address: `0x${string}`) => {
    try {
      setLoading(true);
      setError(null);

      // Validate contract address
      const validation = validateContractParams(address);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Get all LP identifiers from CSV data (addresses + name tags)
      const allLPIdentifiers = loadLPAddresses();

      setProgress(`Checking ${allLPIdentifiers.length} known LPs...`);

      // First fetch LP rewards data
      const lpData = await getLpRewardsDataForUsers(address, allLPIdentifiers);

      setProgress("");
      setLpRewardsData(lpData);

      // Then fetch summary data using the LP rewards data for accurate calculations
      const summary = await getRewardsSummary(address, lpData);
      setSummaryData(summary);
    } catch (err) {
      console.error("Error fetching rewards data:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch rewards data";

      // Provide more helpful error messages
      if (errorMessage.includes("ContractFunctionExecutionError")) {
        setError(
          "Some contract calls failed. This may be normal if LPs haven't interacted with all pools."
        );
      } else if (
        errorMessage.includes("network") ||
        errorMessage.includes("fetch")
      ) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(errorMessage);
      }

      setLpRewardsData([]);
      setSummaryData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchRewardsData(ammRewardsAddress);
  };

  useEffect(() => {
    if (ammRewardsAddress) {
      fetchRewardsData(ammRewardsAddress);
    }
  }, [ammRewardsAddress]);

  const handleAddressChange = (value: string) => {
    // Navigate to the new address rewards page
    router.push(`/${encodeURIComponent(value)}/rewards`);
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen bg-background">
        <header className="py-10">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-headline">
              LP Rewards
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Detailed reward information for liquidity providers
            </p>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 md:px-6 pb-12">
          <div className="flex items-center justify-between mb-4">
            <Navigation currentAddress={ammRewardsAddress} />
            <ShareButton address={ammRewardsAddress} page="rewards" />
          </div>
          <div className="space-y-8">
            {/* Contract Selection Section */}
            <Card className="w-full shadow-lg">
              <CardHeader>
                <CardTitle>Reward Contract Selection</CardTitle>
                <CardDescription>
                  Choose the AmmRewards contract to analyze LP rewards.
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
                      {progress || "Loading rewards data for known LPs..."}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* LP Information Panel */}
            <LPInfoPanel contractAddress={ammRewardsAddress} />

            {/* Summary Statistics Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Rewards Summary</h2>
              <RewardsSummary data={summaryData} loading={loading} />
            </div>

            {/* LP Rewards Table Section */}
            <Card className="w-full shadow-lg">
              <CardHeader>
                <CardTitle>LP Rewards Details</CardTitle>
                <CardDescription>
                  All known liquidity providers from historical deposits to this
                  contract. Click headers to sort.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <LpRewardsTable data={[]} loading={true} />
                ) : error ? (
                  <ErrorDisplay
                    error={error}
                    onRetry={handleRetry}
                    title="Error Loading LP Rewards"
                  />
                ) : lpRewardsData.length > 0 ? (
                  <LpRewardsTable data={lpRewardsData} loading={false} />
                ) : (
                  <NoDataDisplay
                    message="No LP Rewards Found"
                    description="None of the known liquidity providers from historical deposits currently have staked tokens or pending rewards."
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        <footer className="py-6 text-center text-sm text-muted-foreground">
          <p>LP Rewards - Exploring Berachain LP reward data.</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
