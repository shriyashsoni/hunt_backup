import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { PropsWithChildren } from "react";
import { Network } from "@aptos-labs/ts-sdk";

// Initialize wallets outside the component to ensure stable reference
const wallets = [new PetraWallet()];

export function AptosWalletProvider({ children }: PropsWithChildren) {
  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={true}
      dappConfig={{ network: Network.TESTNET }}
      onError={(error: any) => {
        console.log("wallet error", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}