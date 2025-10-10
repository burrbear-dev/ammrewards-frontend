"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { copyToClipboard, generateContractUrl } from "@/lib/url-utils";
import { Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

interface UrlDisplayProps {
  address: string;
  page: "pools" | "rewards";
  label?: string;
}

export function UrlDisplay({
  address,
  page,
  label = "Shareable URL",
}: UrlDisplayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const url = generateContractUrl(address, page);

  const handleCopy = async () => {
    setIsLoading(true);

    try {
      const success = await copyToClipboard(url);

      if (success) {
        toast({
          title: "URL copied!",
          description: "The shareable URL has been copied to your clipboard.",
        });
      } else {
        toast({
          title: "Copy failed",
          description: "Unable to copy URL to clipboard.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="shareable-url" className="text-sm font-medium">
        {label}
      </Label>
      <div className="flex gap-2">
        <Input
          id="shareable-url"
          value={url}
          readOnly
          className="font-mono text-sm"
          onClick={(e) => e.currentTarget.select()}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={isLoading}
          title="Copy URL"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenInNewTab}
          title="Open in new tab"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Share this URL to let others view the same contract data
      </p>
    </div>
  );
}
