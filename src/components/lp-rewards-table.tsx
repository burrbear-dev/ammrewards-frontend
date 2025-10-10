"use client";

import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LpRewardData } from "@/lib/types";
import { cn } from "@/lib/utils";

type SortKey = "walletAddress" | "totalPendingRewards";
type SortDirection = "asc" | "desc";

interface SortDescriptor {
  column: SortKey;
  direction: SortDirection;
}

interface LpRewardsTableProps {
  data: LpRewardData[];
  loading?: boolean;
}

export function LpRewardsTable({ data, loading = false }: LpRewardsTableProps) {
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "walletAddress",
    direction: "asc",
  });

  const sortedItems = React.useMemo(() => {
    const sorted = [...data];
    sorted.sort((a, b) => {
      let cmp = 0;

      if (sortDescriptor.column === "totalPendingRewards") {
        const first = parseFloat(a.totalPendingRewards);
        const second = parseFloat(b.totalPendingRewards);
        cmp = first < second ? -1 : first > second ? 1 : 0;
      } else {
        const first = a[sortDescriptor.column];
        const second = b[sortDescriptor.column];
        cmp = first < second ? -1 : first > second ? 1 : 0;
      }

      return sortDescriptor.direction === "desc" ? -cmp : cmp;
    });
    return sorted;
  }, [sortDescriptor, data]);

  const onSortChange = (column: SortKey) => {
    if (sortDescriptor.column === column) {
      setSortDescriptor({
        ...sortDescriptor,
        direction: sortDescriptor.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortDescriptor({
        column,
        direction: "asc",
      });
    }
  };

  const renderSortIcon = (column: SortKey) => {
    if (sortDescriptor.column !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortDescriptor.direction === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  const formatPendingRewards = (
    balances: { poolSymbol: string; formattedBalance: string }[]
  ) => {
    if (balances.length === 0)
      return <span className="text-muted-foreground">No rewards</span>;

    return (
      <div className="space-y-1">
        {balances.map((balance, index) => {
          // Extract the amount from formattedBalance (e.g., "0.0234 BGT" -> "0.0234")
          const amount = balance.formattedBalance.split(" ")[0];
          // Format with commas for thousands
          const formattedAmount = parseFloat(amount).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
          });

          return (
            <div key={index} className="flex items-center text-sm">
              <span className="w-2 h-2 bg-primary rounded-full mr-2 flex-shrink-0"></span>
              <span className="font-medium">{balance.poolSymbol}:</span>
              <span className="ml-1">{formattedAmount}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const columns = [
    {
      key: "walletAddress" as SortKey,
      label: "Wallet Address",
      className: "font-mono min-w-[120px] sm:min-w-[200px]",
      headerClassName: "justify-start",
      mobileHidden: false,
    },
    {
      key: null,
      label: "Pending Rewards",
      className: "min-w-[120px] sm:min-w-[200px]",
      headerClassName: "justify-start",
      mobileHidden: false,
    },
    {
      key: "totalPendingRewards" as SortKey,
      label: "Total Rewards",
      className: "text-right min-w-[100px] sm:min-w-[150px]",
      headerClassName: "justify-end",
      mobileHidden: false,
    },
  ];

  if (loading) {
    return (
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead
                    key={index}
                    className={cn(column.className, "px-2")}
                  >
                    <div className={cn("w-full", column.headerClassName)}>
                      {column.label}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="p-2">
                    <Skeleton className="h-4 w-20 sm:w-32" />
                  </TableCell>
                  <TableCell className="p-2">
                    <Skeleton className="h-4 w-16 sm:w-24" />
                  </TableCell>
                  <TableCell className="p-2">
                    <Skeleton className="h-4 w-12 sm:w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={cn(column.className, "px-2")}>
                  {column.key ? (
                    <Button
                      variant="ghost"
                      onClick={() => onSortChange(column.key!)}
                      className={cn("w-full", column.headerClassName)}
                    >
                      {column.label}
                      {renderSortIcon(column.key)}
                    </Button>
                  ) : (
                    <div
                      className={cn("w-full px-4 py-2", column.headerClassName)}
                    >
                      {column.label}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.length > 0 ? (
              sortedItems.map((item, index) => (
                <TableRow key={`${item.walletAddress}-${index}`}>
                  <TableCell className={cn(columns[0].className, "p-2")}>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        {item.walletAddress.startsWith("0x") ? (
                          <a
                            href={`https://berascan.com/address/${item.walletAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline break-all text-xs sm:text-sm"
                            title={item.walletAddress}
                          >
                            <span className="sm:hidden">
                              {`${item.walletAddress.slice(
                                0,
                                6
                              )}...${item.walletAddress.slice(-4)}`}
                            </span>
                            <span className="hidden sm:inline">
                              {item.walletAddress}
                            </span>
                          </a>
                        ) : (
                          <span className="text-primary font-medium text-xs sm:text-sm">
                            {item.walletAddress}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className={cn(columns[1].className, "p-2")}>
                    <div className="break-words text-xs sm:text-sm">
                      {formatPendingRewards(item.pendingRewards)}
                    </div>
                  </TableCell>
                  <TableCell className={cn(columns[2].className, "p-2")}>
                    <div className="font-medium text-xs sm:text-sm">
                      {parseFloat(item.totalPendingRewards).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center p-4"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="text-muted-foreground">
                      No LP rewards data available
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Select a contract to view LP reward information
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
