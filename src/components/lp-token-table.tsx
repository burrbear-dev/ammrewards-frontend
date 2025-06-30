"use client";

import * as React from "react";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LpToken } from "@/lib/types";

type SortKey = keyof LpToken;
type SortDirection = "asc" | "desc";

interface SortDescriptor {
  column: SortKey;
  direction: SortDirection;
}

interface LpTokenTableProps {
  data: LpToken[];
}

export function LpTokenTable({ data }: LpTokenTableProps) {
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "index",
    direction: "asc",
  });

  const sortedItems = React.useMemo(() => {
    const sorted = [...data];
    sorted.sort((a, b) => {
      let cmp = 0;

      if (sortDescriptor.column === 'allocPoint') {
          const first = BigInt(a.allocPoint);
          const second = BigInt(b.allocPoint);
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

  const columns: {
    key: SortKey;
    label: string;
    className?: string;
    headerClassName?: string;
  }[] = [
    {
      key: "index",
      label: "Index",
      className: "w-24 font-medium",
      headerClassName: "justify-start",
    },
    { key: "symbol", label: "Symbol", className: "w-48" },
    { key: "address", label: "Address" },
    { key: "allocPoint", label: "Allocation Points", className: "w-48 text-right", headerClassName: "justify-end" },
  ];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={cn(column.className, "px-2")}>
                <Button variant="ghost" onClick={() => onSortChange(column.key)} className={cn("w-full", column.headerClassName)}>
                  {column.label}
                  {renderSortIcon(column.key)}
                </Button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.length > 0 ? (
            sortedItems.map((item) => (
              <TableRow key={item.index}>
                <TableCell className={cn(columns[0].className, "p-2")}>{item.index}</TableCell>
                <TableCell className={cn(columns[1].className, "p-2")}>{item.symbol}</TableCell>
                <TableCell className={cn(columns[2].className, "p-2")}>
                  <a
                    href={`https://berascan.com/address/${item.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-primary hover:underline"
                  >
                    {item.address}
                  </a>
                </TableCell>
                <TableCell className={cn(columns[3].className, "p-2")}>{item.allocPoint}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center p-2">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
