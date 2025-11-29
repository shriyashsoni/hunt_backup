import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { NeoButton } from "./NeoComponents";
import { Wallet, LogOut, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Network } from "@aptos-labs/ts-sdk";

export function WalletConnect() {
  const { connect, disconnect, account, connected, wallets, network } = useWallet();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  useEffect(() => {
    if (connected && network) {
      // Check if network is Mainnet (chainId 1) instead of Testnet (chainId 2)
      // Note: network.name might be "mainnet" or "testnet" depending on the wallet
      // chainId can be number or string depending on the wallet/sdk version
      const isTestnet = network.name.toLowerCase().includes("testnet") || network.chainId.toString() === "2";
      setIsWrongNetwork(!isTestnet);
      
      if (!isTestnet) {
        toast.warning("Wrong Network Detected", {
          description: "Please switch your wallet to Aptos Testnet to use this app.",
          duration: 5000,
        });
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