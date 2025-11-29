import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { NeoButton } from "./NeoComponents";
import { Wallet, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getAptBalance } from "@/lib/aptos";

export function WalletConnect() {
  const { connect, disconnect, account, connected, wallets } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (account?.address) {
        const bal = await getAptBalance(account.address.toString());
        setBalance(bal);
      }
    };

    if (connected && account) {
      fetchBalance();
      // Poll for balance updates every 5 seconds
      const interval = setInterval(fetchBalance, 5000);
      return () => clearInterval(interval);
    } else {
      setBalance(null);
    }
  }, [connected, account]);

  const handleConnect = () => {
    // Safely check for wallets
    if (!wallets || wallets.length === 0) {
      toast.error("No wallets found. Please install Petra Wallet.");
      window.open("https://petra.app/", "_blank");
      return;
    }

    const petra = wallets.find((w: any) => w.name === "Petra");
    if (petra) {
      connect(petra.name);
    } else {
      // Fallback to first available
      connect(wallets[0].name);
    }
  };

  if (connected && account) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden md:flex flex-col items-end mr-2">
          <span className="text-xs font-bold uppercase text-muted-foreground">
            {balance !== null ? `${balance.toFixed(2)} APT` : "Loading..."}
          </span>
          <span className="text-xs font-mono truncate w-24">
            {account.address.toString().slice(0, 6)}...{account.address.toString().slice(-4)}
          </span>
        </div>
        <NeoButton
          variant="outline"
          size="sm"
          onClick={disconnect}
          className="bg-red-100 hover:bg-red-200 border-red-900 text-red-900"
        >
          <LogOut className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Disconnect</span>
        </NeoButton>
      </div>
    );
  }

  return (
    <NeoButton onClick={handleConnect} className="bg-teal-400 hover:bg-teal-500 text-black">
      <Wallet className="w-4 h-4 mr-2" />
      Connect Petra
    </NeoButton>
  );
}