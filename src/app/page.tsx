import { getLpTokens } from "@/lib/berachain";
import { LpTokenTable } from "@/components/lp-token-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default async function Home() {
  const lpTokens = await getLpTokens();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="py-10">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-headline">
            BeraLpView
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
            A simple viewer for LP token allocation points on Berachain.
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 md:px-6 pb-12">
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle>Liquidity Pool Allocations</CardTitle>
            <CardDescription>
              A list of pools from the{" "}
              <a
                href="https://berascan.com/address/0x7a2be8e74f4ae28796828af7b685def78c20416c"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                MiniChefV2
              </a>
              {" "}contract. Click headers to sort.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lpTokens.length > 0 ? (
              <LpTokenTable data={lpTokens} />
            ) : (
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Could Not Fetch Data</AlertTitle>
                <AlertDescription>
                  There was an issue retrieving data from the Berachain smart contract. Please try again later.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>BeraLpView - Exploring Berachain onchain data.</p>
      </footer>
    </div>
  );
}
