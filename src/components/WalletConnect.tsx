import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { NeoButton } from "./NeoComponents";
import { Wallet, LogOut, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState, useRef } from "react";
import { Network } from "@aptos-labs/ts-sdk";

export function WalletConnect() {
  // @ts-ignore - changeNetwork might not be in the type definition depending on version
  const { connect, disconnect, account, connected, wallets, network, changeNetwork } = useWallet();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (connected && network) {
      // Check if network is Testnet (chainId 2)
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
            action: {
              label: "Switch Network",
              onClick: handleSwitchNetwork
            }
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

  const handleSwitchNetwork = async () => {
    try {
      if (changeNetwork) {
        await changeNetwork(Network.TESTNET);
        toast.success("Switched to Aptos Testnet");
      } else {
        toast.error("Automatic switch failed. Please switch to Testnet manually in your wallet.");
      }
    } catch (error) {
      console.error("Failed to switch network:", error);
      toast.error("Failed to switch network. Please do it manually in your wallet.");
    }
  };

  if (connected && account) {
    return (
      <div className="flex items-center gap-2">
        {isWrongNetwork && (
          <NeoButton 
            size="sm" 
            variant="destructive" 
            className="hidden md:flex items-center gap-1 font-bold text-xs animate-pulse"
            onClick={handleSwitchNetwork}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>SWITCH TO TESTNET</span>
          </NeoButton>
        )}
        <NeoButton 
          variant="outline" 
          className={`flex items-center gap-2 ${isWrongNetwork ? "border-red-500 text-red-500 bg-red-50" : ""}`}
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