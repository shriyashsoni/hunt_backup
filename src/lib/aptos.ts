import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// Use official Testnet URL as primary if QuickNode fails or is not set
// The QuickNode URL might be rate limited or down
const OFFICIAL_TESTNET_URL = "https://api.testnet.aptoslabs.com/v1";
const QUICKNODE_RPC_URL = "https://silent-summer-butterfly.aptos-testnet.quiknode.pro/71100b50129ba2d53c643fb1957feab704ff1945/";

// Allow overriding via env vars, fallback to Official Testnet for reliability
const NODE_URL = import.meta.env.VITE_APTOS_NODE_URL || OFFICIAL_TESTNET_URL;
const API_KEY = import.meta.env.VITE_APTOS_API_KEY;

const config = new AptosConfig({
  network: Network.TESTNET,
  fullnode: NODE_URL,
  clientConfig: API_KEY ? { API_KEY } : undefined,
});

export const aptos = new Aptos(config);

// Helper to fund account (Testnet only)
export const fundAccount = async (address: string, amount: number) => {
  try {
    await aptos.fundAccount({
      accountAddress: address,
      amount: amount,
    });
  } catch (error) {
    console.error("Failed to fund account:", error);
    throw error;
  }
};

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