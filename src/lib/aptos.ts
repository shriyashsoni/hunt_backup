import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// Configuration with the provided QuickNode RPC URL
const QUICKNODE_RPC_URL = "https://silent-summer-butterfly.aptos-testnet.quiknode.pro/71100b50129ba2d53c643fb1957feab704ff1945/";

// Allow overriding via env vars
const NODE_URL = import.meta.env.VITE_APTOS_NODE_URL || QUICKNODE_RPC_URL;
const API_KEY = import.meta.env.VITE_APTOS_API_KEY;

const config = new AptosConfig({
  network: Network.TESTNET,
  fullnode: NODE_URL,
  clientConfig: API_KEY ? { API_KEY } : undefined,
});

export const aptos = new Aptos(config);

// Helper to get APT balance (CoinStore)
export const getAptBalance = async (address: string): Promise<number> => {
  try {
    const resource = await aptos.getAccountCoinAmount({
      accountAddress: address,
      faMetadataAddress: "0x1::aptos_coin::AptosCoin",
    });
    // Convert Octas to APT (8 decimals)
    return resource / 100_000_000;
  } catch (error) {
    console.error("Failed to fetch APT balance:", error);
    return 0;
  }
};

export const getBlockHeight = async () => {
  try {
    const info = await aptos.getLedgerInfo();
    return info.block_height;
  } catch (error) {
    console.error("Failed to get block height:", error);
    return null;
  }
};