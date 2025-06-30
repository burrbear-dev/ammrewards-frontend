"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { parseEther, formatUnits } from "viem";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const SECONDS_IN_YEAR = 31536000n;

export function RewardCalculator() {
  const [rewardsPerMonth, setRewardsPerMonth] = useState("");
  const [rewardPerSecond, setRewardPerSecond] = useState<bigint | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRewardsPerMonth(value);

    if (value && !isNaN(Number(value)) && Number(value) >= 0) {
      try {
        const rewardsInWei = parseEther(value);
        const yearlyRewards = rewardsInWei * 12n;
        const perSecond = yearlyRewards / SECONDS_IN_YEAR;
        setRewardPerSecond(perSecond);
      } catch (error) {
        console.error("Error calculating rewards:", error);
        setRewardPerSecond(null);
      }
    } else {
      setRewardPerSecond(null);
    }
  };

  const copyToClipboard = () => {
    if (rewardPerSecond !== null) {
      navigator.clipboard.writeText(rewardPerSecond.toString());
      toast({
        title: "Copied!",
        description: "Reward per second value (in wei) copied to clipboard.",
      });
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Reward Token Calculator</CardTitle>
        <CardDescription>
          Calculate `rewardTokenPerSecond` from a monthly reward amount.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rewards-per-month">WBERA Rewards / Month</Label>
            <Input
              id="rewards-per-month"
              type="number"
              placeholder="e.g., 100000"
              value={rewardsPerMonth}
              onChange={handleInputChange}
            />
          </div>
          {rewardPerSecond !== null && (
            <div className="space-y-4 rounded-lg bg-muted p-4">
               <div>
                <Label className="text-xs text-muted-foreground">Decimal Value</Label>
                <p className="font-mono text-lg text-foreground break-all">
                  {formatUnits(rewardPerSecond, 18)}
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Value in Wei (for contract)</Label>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm text-foreground break-all flex-grow">
                    {rewardPerSecond.toString()}
                  </p>
                  <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
