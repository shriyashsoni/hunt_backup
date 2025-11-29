import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NeoCard } from "@/components/NeoComponents";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="container mx-auto p-4 md:p-8 max-w-3xl flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-black uppercase mb-8 text-center">Frequently Asked Questions</h1>
          
          <NeoCard>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b-2 border-black/10">
                <AccordionTrigger className="text-lg font-bold uppercase hover:no-underline">
                  What is Deepfake Hunters?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  Deepfake Hunters is a decentralized platform where users can bet on whether viral content is real or AI-generated. 
                  It uses a "prediction market" model to crowdsource truth, verified by our Veritas AI engine.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-b-2 border-black/10">
                <AccordionTrigger className="text-lg font-bold uppercase hover:no-underline">
                  How do I earn crypto?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  There are two ways to earn:
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li><strong>Betting:</strong> Place a bet on a bounty. If you correctly predict the outcome (Real vs AI), you win a share of the losing pool.</li>
                    <li><strong>Creating Bounties:</strong> Upload suspicious content. You earn PAT tokens and a small APT reward if the community engages with your bounty.</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-b-2 border-black/10">
                <AccordionTrigger className="text-lg font-bold uppercase hover:no-underline">
                  What is Veritas AI?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  Veritas is our proprietary AI analysis engine. It scans images and videos for artifacts common in deepfakes, 
                  such as irregular lighting, frequency anomalies, and compression inconsistencies. It acts as the final judge (Oracle) for resolving bounties.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-b-2 border-black/10">
                <AccordionTrigger className="text-lg font-bold uppercase hover:no-underline">
                  Do I need a wallet to use this?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  Yes. Since this is a Web3 application on the Aptos blockchain, you need a compatible wallet like Petra. 
                  This allows you to sign transactions and hold your APT winnings securely.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-b-2 border-black/10">
                <AccordionTrigger className="text-lg font-bold uppercase hover:no-underline">
                  Is this real money?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  Currently, the platform operates on the <strong>Aptos Testnet</strong>. The APT tokens used are for testing purposes 
                  and have no real-world monetary value. You can get free Testnet APT from the faucet in your wallet or on our dashboard.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6" className="border-b-0">
                <AccordionTrigger className="text-lg font-bold uppercase hover:no-underline">
                  What is the Shelby Protocol?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  Shelby is a decentralized storage layer we use to archive content. Unlike centralized servers that can delete evidence, 
                  Shelby ensures that any content uploaded for verification is permanently stored and accessible for audit.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </NeoCard>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
