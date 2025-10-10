"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DEFAULT_ADDRESS = "0x7a2be8e74f4ae28796828af7b685def78c20416c";

export default function RewardsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the default address rewards page
    router.replace(`/${encodeURIComponent(DEFAULT_ADDRESS)}/rewards`);
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
