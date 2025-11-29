import { Navbar } from "@/components/Navbar";
import { NeoButton, NeoCard, NeoBadge } from "@/components/NeoComponents";
import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useWallet, InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { analyzeContent } from "@/lib/veritas";
import { Footer } from "@/components/Footer";
import { getYoutubeThumbnail, isYoutubeUrl, getYoutubeId } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { MODULE_ADDRESS, MODULE_NAME } from "@/lib/aptos";

// Treasury address to collect bets (Demo address)
const TREASURY_ADDRESS = "0x98a5e0efcf102175e75dd459068ade9e845dd61291e6197d1cf01e3d6c590e93";

export default function BountyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { signAndSubmitTransaction, account, network } = useWallet();
  
  // Convex hooks
  const bounty = useQuery(api.bounties.get, { id: id as Id<"bounties"> });
  const placeBetMutation = useMutation(api.bounties.placeBet);
  const resolveBountyMutation = useMutation(api.bounties.resolve);

  const [betAmount, setBetAmount] = useState("1");
  const [isVerifying, setIsVerifying] = useState(false);
  const [veritasLogs, setVeritasLogs] = useState<string[]>([]);

  useEffect(() => {
    if (bounty === null) {
      navigate("/dashboard");
    }
  }, [bounty, navigate]);

  if (!bounty) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

  const displayImage = isYoutubeUrl(bounty.contentUrl) 
    ? getYoutubeThumbnail(bounty.contentUrl) 
    : bounty.contentUrl;

  const youtubeId = isYoutubeUrl(bounty.contentUrl) ? getYoutubeId(bounty.contentUrl) : null;

  const handleBet = async (side: boolean) => {
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (network) {
      const isTestnet = network.name?.toLowerCase().includes("testnet") || network.chainId?.toString() === "2";
      if (!isTestnet) {
        toast.error("Wrong Network", { 
          description: `You are on ${network.name}. Please switch to Aptos Testnet to place a bet.` 
        });
        return;
      }
    }

    try {
      toast.info("Please sign the transaction in your wallet...");
      
      // 1. Trigger Real Aptos Transaction
      const amountOctas = Math.floor(Number(betAmount) * 100_000_000); // Convert APT to Octas
      
      // Use a default market ID of 1 if not set (for demo purposes) or the actual marketId
      const marketId = bounty.marketId ? bounty.marketId.toString() : "1";

      const transaction: InputTransactionData = {
        data: {
          function: `${MODULE_ADDRESS}::${MODULE_NAME}::place_bet`,
          typeArguments: [],
          functionArguments: [marketId, side, amountOctas.toString()], 
        },
        options: {
          maxGasAmount: 10000,
          gasUnitPrice: 100,
        },
      };

      const response = await signAndSubmitTransaction(transaction);
      
      toast.loading("Transaction submitted. Confirming...", { duration: 2000 });

      // 2. Record Bet in Convex with Hash
      await placeBetMutation({
        bountyId: bounty._id,
        amount: Number(betAmount),
        isReal: side,
        txnHash: response.hash
      });
      
      toast.success(`Bet placed on ${side ? "REAL" : "AI"}`, {
        description: `Transaction Hash: ${response.hash.slice(0, 8)}...`
      });
    } catch (error) {
      toast.error("Failed to place bet");
      console.error(error);
    }
  };

  const handleSimulateVerification = async () => {
    setIsVerifying(true);
    setVeritasLogs(["Initializing Veritas AI..."]);
    
    try {
      // 1. Run Veritas AI Analysis
      const analysis = await analyzeContent(bounty.contentUrl);
      
      // Simulate streaming logs
      for (const log of analysis.logs) {
        setVeritasLogs(prev => [...prev, log]);
        await new Promise(r => setTimeout(r, 800)); // Delay for effect
      }

      // 2. Submit Result to Chain/Database
      await resolveBountyMutation({
        bountyId: bounty._id,
        isReal: analysis.isReal,
        confidence: analysis.confidence,
        analysisLog: analysis.logs
      });
      
      if (analysis.isReal) {
        toast.success(`Veritas Verdict: REAL (${analysis.confidence}% Confidence)`, { 
          description: "Winners have been paid out!" 
        });
      } else {
        toast.error(`Veritas Verdict: AI GENERATED (${analysis.confidence}% Confidence)`, { 
          description: "Winners have been paid out!" 
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to resolve bounty");
    } finally {
      setIsVerifying(false);
      setVeritasLogs([]);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="container mx-auto p-4 md:p-8 max-w-4xl flex-1">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8">
            <NeoButton variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
              ← Back to Dashboard
            </NeoButton>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-3xl md:text-4xl font-black uppercase">Bounty #{bounty._id.slice(-4)}</h1>
              <div className="flex flex-wrap gap-2">
                <NeoBadge variant="default" className="bg-blue-600 text-white border-blue-900">
                  <Database className="w-3 h-3 mr-1" />
                  SHELBY STORAGE
                </NeoBadge>
                <NeoBadge 
                  variant={bounty.status === 'pending' ? 'warning' : bounty.status === 'verified_real' ? 'success' : 'danger'}
                  className="text-lg px-4 py-1"
                >
                  {bounty.status === 'pending' ? 'VERIFICATION PENDING' : bounty.status === 'verified_real' ? 'VERIFIED REAL' : 'VERIFIED AI'}
                </NeoBadge>
              </div>
            </div>
          </div>

          <div className="grid gap-8">
            {/* Content Display */}
            <NeoCard className="p-0 overflow-hidden bg-black">
              <div className="relative aspect-video w-full flex items-center justify-center bg-gray-900">
                {youtubeId ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${youtubeId}`} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="absolute inset-0"
                  ></iframe>
                ) : (
                  <img src={displayImage || "/placeholder.svg"} alt="Content" className="max-h-full max-w-full object-contain" />
                )}
                
                {/* Overlay for verification status */}
                <AnimatePresence>
                  {isVerifying && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10 p-8"
                    >
                      <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                      <h3 className="text-2xl font-bold text-white uppercase tracking-widest mb-4 text-center">Veritas AI Scanning...</h3>
                      <div className="w-full max-w-md space-y-2 font-mono text-sm text-green-400">
                        {veritasLogs.map((log, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="truncate"
                          >
                            {">"} {log}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  {bounty.isResolved && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 pointer-events-none"
                    >
                      <div className={`border-8 ${bounty.isReal ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'} p-8 transform -rotate-12 bg-black mb-4`}>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                          {bounty.isReal ? 'REAL' : 'FAKE'}
                        </h2>
                      </div>
                      {bounty.confidence && (
                        <div className="bg-black border-2 border-white text-white px-4 py-2 font-mono font-bold">
                          CONFIDENCE: {bounty.confidence}%
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </NeoCard>

            {/* Source Link */}
            <NeoCard className="bg-blue-50 border-blue-200 flex items-center justify-between p-4">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="bg-blue-100 p-2 rounded-full">
                  <ExternalLink className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold uppercase text-blue-600">Source Content</span>
                  <a href={bounty.contentUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-mono truncate hover:underline text-blue-800">
                    {bounty.contentUrl}
                  </a>
                </div>
              </div>
              <NeoButton size="sm" variant="outline" onClick={() => window.open(bounty.contentUrl, '_blank')}>
                Open Link
              </NeoButton>
            </NeoCard>

            {/* Analysis Logs (Post-Resolution) */}
            {bounty.isResolved && bounty.analysisLog && (
              <NeoCard className="bg-black text-green-400 font-mono text-sm p-4 border-green-900">
                <h3 className="text-white font-bold uppercase mb-2 border-b border-gray-800 pb-2">Veritas Analysis Log</h3>
                <div className="space-y-1">
                  {bounty.analysisLog.map((log: string, i: number) => (
                    <div key={i}>{">"} {log}</div>
                  ))}
                  <div className="text-white mt-2 pt-2 border-t border-gray-800 font-bold">
                    {">"} FINAL VERDICT: {bounty.isReal ? "AUTHENTIC CONTENT" : "AI GENERATED CONTENT"}
                  </div>
                </div>
              </NeoCard>
            )}

            {/* Betting Interface */}
            <div className="grid md:grid-cols-2 gap-8">
              <NeoCard className={`border-green-500 ${bounty.isResolved ? 'opacity-50' : ''}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-black uppercase text-green-600">Real</h3>
                  <ShieldCheck className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-4xl font-black mb-2">{bounty.realPool} APT</div>
                <p className="text-sm text-muted-foreground mb-6">Pool Size</p>
                
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="flex-1 border-2 border-black p-2 font-mono font-bold"
                    disabled={bounty.isResolved}
                  />
                  <NeoButton 
                    className="bg-green-500 hover:bg-green-600 text-white flex-1"
                    onClick={() => handleBet(true)}
                    disabled={bounty.isResolved}
                  >
                    Bet Real
                  </NeoButton>
                </div>
              </NeoCard>

              <NeoCard className={`border-red-500 ${bounty.isResolved ? 'opacity-50' : ''}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-black uppercase text-red-600">AI Generated</h3>
                  <ShieldAlert className="w-8 h-8 text-red-600" />
                </div>
                <div className="text-4xl font-black mb-2">{bounty.aiPool} APT</div>
                <p className="text-sm text-muted-foreground mb-6">Pool Size</p>
                
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="flex-1 border-2 border-black p-2 font-mono font-bold"
                    disabled={bounty.isResolved}
                  />
                  <NeoButton 
                    className="bg-red-500 hover:bg-red-600 text-white flex-1"
                    onClick={() => handleBet(false)}
                    disabled={bounty.isResolved}
                  >
                    Bet AI
                  </NeoButton>
                </div>
              </NeoCard>
            </div>

            {/* Admin Panel */}
            <NeoCard className="bg-gray-100 border-dashed">
              <h3 className="font-bold uppercase mb-4 text-gray-500">Admin Controls (Demo Only)</h3>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="font-mono text-sm">Veritas Oracle Online</span>
                </div>
                <NeoButton 
                  onClick={handleSimulateVerification}
                  disabled={isVerifying || bounty.isResolved}
                  variant="outline"
                  className="w-full md:w-auto"
                >
                  {isVerifying ? 'Verifying...' : 'Trigger Veritas Verification'}
                </NeoButton>
              </div>
            </NeoCard>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}