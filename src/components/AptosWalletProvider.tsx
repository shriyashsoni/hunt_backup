import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { PropsWithChildren, useMemo } from "react";
import { Network } from "@aptos-labs/ts-sdk";

export function AptosWalletProvider({ children }: PropsWithChildren) {
  // Initialize wallets with useMemo to ensure stable reference across renders
  const wallets = useMemo(() => [new PetraWallet()], []);

  return (
    <AptosWalletAdapterProvider
      {...({
        plugins: wallets,
        autoConnect: true,
        dappConfig: { network: Network.TESTNET },
        onError: (error: any) => {
          console.log("wallet error", error);
        }
      } as any)}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}