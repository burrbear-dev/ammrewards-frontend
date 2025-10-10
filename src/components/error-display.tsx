import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from "lucide-react";

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  title?: string;
  showRetry?: boolean;
}

export function ErrorDisplay({
  error,
  onRetry,
  title = "Error Loading Data",
  showRetry = true,
}: ErrorDisplayProps) {
  const isNetworkError =
    error.toLowerCase().includes("network") ||
    error.toLowerCase().includes("fetch") ||
    error.toLowerCase().includes("connection");

  const isContractError =
    error.toLowerCase().includes("contract") ||
    error.toLowerCase().includes("revert") ||
    error.toLowerCase().includes("invalid address");

  const getErrorIcon = () => {
    if (isNetworkError) return <WifiOff className="h-4 w-4" />;
    if (isContractError) return <AlertTriangle className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  const getErrorMessage = () => {
    if (isNetworkError) {
      return "Unable to connect to the blockchain. Please check your internet connection and try again.";
    }
    if (isContractError) {
      return "There was an issue with the smart contract. Please verify the contract address is correct.";
    }
    return error;
  };

  return (
    <Alert className="my-4">
      {getErrorIcon()}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        {getErrorMessage()}
        {showRetry && onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-3"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

export function NoDataDisplay({
  message = "No data available",
  description = "There is currently no data to display for the selected contract.",
}: {
  message?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Wifi className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">{message}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
}
