// Mock Aptos and Photon interactions for the demo
// TODO: Replace with real Aptos SDK and Photon SDK integration
// import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
// import { Photon } from "@photon-sdk/photon-lib";

import { toast } from "sonner";

export interface Bounty {
  id: number;
  contentUrl: string;
  creator: string;
  deadline: number;
  isResolved: boolean;
  isReal?: boolean;
  realPool: number;
  aiPool: number;
  status: "pending" | "verified_real" | "verified_ai";
}

// Mock Data
let bounties: Bounty[] = [
  {
    id: 1,
    contentUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=2550&auto=format&fit=crop",
    creator: "0x123...abc",
    deadline: Date.now() + 86400000,
    isResolved: false,
    realPool: 150,
    aiPool: 80,
    status: "pending"
  },
  {
    id: 2,
    contentUrl: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=2600&auto=format&fit=crop",
    creator: "0x456...def",
    deadline: Date.now() + 43200000,
    isResolved: false,
    realPool: 50,
    aiPool: 200,
    status: "pending"
  },
  {
    id: 3,
    contentUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2670&auto=format&fit=crop",
    creator: "0x789...ghi",
    deadline: Date.now() - 10000, // Expired
    isResolved: true,
    isReal: true,
    realPool: 300,
    aiPool: 20,
    status: "verified_real"
  }
];

export const getBounties = () => bounties;

export const getBounty = (id: number) => bounties.find(b => b.id === id);

export const createBounty = (contentUrl: string, creator: string) => {
  const newBounty: Bounty = {
    id: bounties.length + 1,
    contentUrl,
    creator,
    deadline: Date.now() + 86400000,
    isResolved: false,
    realPool: 0,
    aiPool: 0,
    status: "pending"
  };
  bounties = [newBounty, ...bounties];
  return newBounty;
};

export const placeBet = (bountyId: number, isReal: boolean, amount: number) => {
  const bounty = bounties.find(b => b.id === bountyId);
  if (bounty) {
    if (isReal) bounty.realPool += amount;
    else bounty.aiPool += amount;
  }
};

export const resolveBounty = (bountyId: number, isReal: boolean) => {
  const bounty = bounties.find(b => b.id === bountyId);
  if (bounty) {
    bounty.isResolved = true;
    bounty.isReal = isReal;
    bounty.status = isReal ? "verified_real" : "verified_ai";
  }
};

// Mock Photon
export const photon = {
  points: 1250,
  trackEvent: (event: string, data: any) => {
    console.log(`[Photon] Tracked event: ${event}`, data);
    if (event === 'bounty_created') photon.points += 10;
    if (event === 'prediction_won') photon.points += 50; // Simplified
  },
  getPoints: () => photon.points,
};