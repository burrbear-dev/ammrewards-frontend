"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationProps {
  currentAddress?: string;
}

export function Navigation({ currentAddress }: NavigationProps) {
  const pathname = usePathname();

  // Default to first known address if none provided
  const defaultAddress = "0x7a2be8e74f4ae28796828af7b685def78c20416c";
  const address = currentAddress || defaultAddress;

  const navigationItems = [
    {
      name: "Pool Allocations",
      href: `/${encodeURIComponent(address)}`,
      description: "View liquidity pool allocations and rewards",
    },
    {
      name: "LP Rewards",
      href: `/${encodeURIComponent(address)}/rewards`,
      description: "Detailed LP reward information",
    },
  ];

  return (
    <nav className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-8">
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            "hover:bg-muted hover:text-foreground",
            pathname === item.href
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          )}
          title={item.description}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
