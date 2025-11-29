import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { NeoButton } from "./NeoComponents";
import { Wallet, LogOut, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState, useRef } from "react";

export function WalletConnect() {
  const { connect, disconnect, account, connected, wallets, network } = useWallet();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (connected && network) {
      // Check if network is Testnet (chainId 2)
      // Some wallets return chainId as number, some as string
      const chainId = network.chainId?.toString();
      const name = network.name?.toLowerCase();
      
      // Robust check for Testnet
      const isTestnet = 
        (name && name.includes("testnet")) || 
        chainId === "2";
        
      setIsWrongNetwork(!isTestnet);
      
      if (!isTestnet) {
        if (!hasShownToast.current) {
          toast.warning("Wrong Network Detected", {
            description: `You are connected to ${network.name || "Unknown Network"} (Chain ID: ${network.chainId}). Please switch to Aptos Testnet.`,
            duration: 8000,
          });
          hasShownToast.current = true;
        }
      } else {
        hasShownToast.current = false; // Reset if they switch to correct network
      }
    }
  }, [connected, network]);

  const handleConnect = async () => {
    try {
      const petra = wallets.find((w) => w.name === "Petra");
      if (petra) {
        await connect(petra.name);
      } else if (wallets.length > 0) {
        await connect(wallets[0].name);
      } else {
        window.open("https://petra.app/", "_blank");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("Failed to connect wallet");
    }
  };

  if (connected && account) {
    return (
      <div className="flex items-center gap-2">
        {isWrongNetwork && (
          <div className="hidden md:flex items-center gap-1 text-yellow-600 bg-yellow-100 px-2 py-1 border-2 border-yellow-600 font-bold text-xs animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            <span>SWITCH TO TESTNET</span>
          </div>
        )}
        <NeoButton 
          variant="outline" 
          className={`flex items-center gap-2 ${isWrongNetwork ? "border-red-500 text-red-500" : ""}`}
          onClick={disconnect}
        >
          <Wallet className="w-4 h-4" />
          <span className="hidden sm:inline">
            {account.address.toString().slice(0, 6)}...{account.address.toString().slice(-4)}
          </span>
          <LogOut className="w-4 h-4 ml-1" />
        </NeoButton>
      </div>
    );
  }

  return (
    <NeoButton onClick={handleConnect} className="flex items-center gap-2">
      <Wallet className="w-4 h-4" />
      <span className="hidden sm:inline">Connect Wallet</span>
      <span className="sm:hidden">Connect</span>
    </NeoButton>
  );
}