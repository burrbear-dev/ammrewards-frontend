"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLPDataStatistics, getLPDepositHistory } from "@/lib/lp-data-loader";
import { formatAddress } from "@/lib/validation";
import { Activity, ExternalLink, Users } from "lucide-react";
import { useState } from "react";

interface LPInfoPanelProps {
  contractAddress: string;
}

export function LPInfoPanel({ contractAddress }: LPInfoPanelProps) {
  const [showDetails, setShowDetails] = useState(false);
  const statistics = getLPDataStatistics();

  // Check if this is the contract we have data for
  const isTargetContract =
    contractAddress.toLowerCase() ===
    "0x834bd0eb271cf98982e11578c2a7037f3e3d1b6b";

  if (!isTargetContract) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            LP Information
          </CardTitle>
          <CardDescription>
            Historical deposit data is available for contract
            0x834BD0EB271Cf98982E11578C2A7037f3e3d1B6b
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          LP Deposit History
        </CardTitle>
        <CardDescription>
          Historical deposit data from blockchain transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {statistics.uniqueLPs}
              </div>
              <div className="text-xs text-muted-foreground">Unique LPs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {statistics.successfulDeposits}
              </div>
              <div className="text-xs text-muted-foreground">Successful</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {statistics.failedDeposits}
              </div>
              <div className="text-xs text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {statistics.totalTransactions}
              </div>
              <div className="text-xs text-muted-foreground">Total Txns</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              <Activity className="h-4 w-4 mr-2" />
              {showDetails ? "Hide" : "Show"} LP Addresses
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://berascan.com/address/${contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Berascan
              </a>
            </Button>
          </div>

          {/* LP Addresses List */}
          {showDetails && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Known LP Addresses:</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {statistics.uniqueAddresses
                  .slice(0, 20)
                  .map((address: string) => (
                    <div
                      key={address}
                      className="flex items-center justify-between p-2 bg-muted rounded text-xs"
                    >
                      <span className="font-mono">
                        {formatAddress(address, 6)}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {getLPDepositHistory(address).length} deposits
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-6 w-6 p-0"
                        >
                          <a
                            href={`https://berascan.com/address/${address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View on Berascan"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                {statistics.uniqueAddresses.length > 20 && (
                  <div className="text-xs text-muted-foreground text-center py-2">
                    ... and {statistics.uniqueAddresses.length - 20} more
                    addresses
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Data includes all {statistics.totalTransactions} deposit
            transactions to this AmmRewards contract.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
