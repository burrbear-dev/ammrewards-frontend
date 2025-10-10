"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { copyToClipboard, generateContractUrl } from "@/lib/url-utils";
import { Copy, Share } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  address: string;
  page: "pools" | "rewards";
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  showText?: boolean;
}

export function ShareButton({
  address,
  page,
  variant = "outline",
  size = "sm",
  showText = true,
}: ShareButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    setIsLoading(true);

    try {
      const url = generateContractUrl(address, page);
      const success = await copyToClipboard(url);

      if (success) {
        toast({
          title: "Link copied!",
          description: "The shareable link has been copied to your clipboard.",
        });
      } else {
        toast({
          title: "Copy failed",
          description:
            "Unable to copy link to clipboard. Please copy the URL manually.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate shareable link.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
      ) : (
        <Share className="h-4 w-4" />
      )}
      {showText && (isLoading ? "Copying..." : "Share")}
    </Button>
  );
}

interface CopyAddressButtonProps {
  address: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function CopyAddressButton({
  address,
  variant = "ghost",
  size = "sm",
}: CopyAddressButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    setIsLoading(true);

    try {
      const success = await copyToClipboard(address);

      if (success) {
        toast({
          title: "Address copied!",
          description: "Contract address has been copied to your clipboard.",
        });
      } else {
        toast({
          title: "Copy failed",
          description: "Unable to copy address to clipboard.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy address.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      disabled={isLoading}
      className="gap-2"
      title="Copy contract address"
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );
}
