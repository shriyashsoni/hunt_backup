import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { Network } from "@aptos-labs/ts-sdk";
import { PropsWithChildren } from "react";
import { toast } from "sonner";

export function AptosWalletProvider({ children }: PropsWithChildren) {
  const wallets = [new PetraWallet()];

  return (
    <AptosWalletAdapterProvider
      // @ts-ignore - plugins prop exists in runtime but types might be mismatched in v7
      plugins={wallets}
      autoConnect={true}
      dappConfig={{ 
        network: Network.TESTNET,
        aptosConnectDappId: undefined, // Add your dapp ID here if you have one
        mizuwallet: {
          manifestURL: "https://assets.mz.xyz/static/config/mizuwallet-connect-manifest.json",
        },
      }}
      onError={(error) => {
        console.error("Wallet error:", error);
        if (error.name === "WalletAccountChangeError") {
            // Suppress account change errors
            return;
        }
        toast.error("Wallet Error: " + error.message);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}