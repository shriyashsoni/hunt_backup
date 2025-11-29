import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { NeoButton } from "./NeoComponents";
import { Wallet, LogOut, AlertTriangle, Coins } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getAptBalance, fundAccount } from "@/lib/aptos";
import { Network } from "@aptos-labs/ts-sdk";

export function WalletConnect() {
  const { connect, disconnect, account, connected, wallets, network } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isFunding, setIsFunding] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    let isActive = true;
    const fetchBalance = async () => {
      if (account?.address && isActive) {
        const bal = await getAptBalance(account.address.toString());
        if (isActive) setBalance(bal);
      }
    };

    if (connected && account) {
      fetchBalance();
      // Poll for balance updates every 5 seconds
      const interval = setInterval(fetchBalance, 5000);
      return () => {
        isActive = false;
        clearInterval(interval);
      };
    } else {
      setBalance(null);
    }
    
    return () => { isActive = false; };
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

  const handleFaucet = async () => {
    if (!account) return;
    setIsFunding(true);
    try {
      toast.loading("Requesting airdrop...");
      await fundAccount(account.address.toString(), 100_000_000); // 1 APT
      toast.dismiss();
      toast.success("Airdrop received! +1 APT");
      // Refresh balance immediately
      const bal = await getAptBalance(account.address.toString());
      setBalance(bal);
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Failed to get airdrop. You might be on Mainnet or rate limited.");
    } finally {
      setIsFunding(false);
    }
  };

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <NeoButton className="bg-teal-400 hover:bg-teal-500 text-black opacity-50 cursor-not-allowed">
        <Wallet className="w-4 h-4 mr-2" />
        Loading...
      </NeoButton>
    );
  }

  if (connected && account) {
    const isTestnet = network?.name?.toLowerCase().includes("testnet");
    
    return (
      <div className="flex items-center gap-2">
        {/* Network Warning */}
        {network && !isTestnet && (
           <div className="hidden md:flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 border border-yellow-600 mr-2" title="Please switch to Testnet">
             <AlertTriangle className="w-3 h-3" />
             <span>{network.name}</span>
           </div>
        )}

        <div className="hidden md:flex flex-col items-end mr-2">
          <span className="text-xs font-bold uppercase text-muted-foreground">
            {balance !== null ? `${balance.toFixed(2)} APT` : "Loading..."}
          </span>
          <span className="text-xs font-mono truncate w-24">
            {account.address.toString().slice(0, 6)}...{account.address.toString().slice(-4)}
          </span>
        </div>

        {/* Faucet Button (Only show if low balance or explicitly on testnet) */}
        {(balance !== null && balance < 1) && (
            <NeoButton 
                size="sm" 
                variant="outline"
                onClick={handleFaucet}
                disabled={isFunding}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-800 px-2"
                title="Get Testnet APT"
            >
                <Coins className={`w-4 h-4 ${isFunding ? 'animate-spin' : ''}`} />
            </NeoButton>
        )}

        <NeoButton
          variant="outline"
          size="sm"
          onClick={() => disconnect()}
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