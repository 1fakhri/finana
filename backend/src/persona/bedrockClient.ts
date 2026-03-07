import {
  BedrockRuntimeClient,
  ConverseCommand,
  type Message,
} from "@aws-sdk/client-bedrock-runtime";

const MODEL_ID = process.env.BEDROCK_MODEL_ID || "amazon.nova-lite-v1:0";
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const MAX_TOKENS = 150;

let client: BedrockRuntimeClient | null = null;

function getClient(): BedrockRuntimeClient {
  if (!client) {
    client = new BedrockRuntimeClient({ region: AWS_REGION });
  }
  return client;
}

export interface InvokeResult {
  text: string;
  latencyMs: number;
  fromFallback: boolean;
}

// Fallback response pools by event type
const FALLBACK_POOLS: Record<string, string[]> = {
  greeting: [
    "Oh look, you're back. What financial mistake are we making today?",
    "Bestie disappeared for a bit. The subscriptions did not.",
    "Back so soon? Let's see what damage we're working with.",
  ],
  kill_initiated: [
    "Starting the hit. This one had it coming.",
    "On it. This subscription's days are numbered.",
    "Consider it done. Well, almost.",
  ],
  kill_update: [
    "Still working on it. They're throwing retention offers at me. Cute.",
    "Navigating their maze of dark patterns. They really don't want to let go.",
    "Making progress. These cancellation flows are UNHINGED.",
  ],
  retention_offer_rejected: [
    "They offered a discount. I said no. You can thank me later.",
    "Nice try with the 50% off. We're not falling for that.",
    "A retention offer? In THIS economy? Rejected.",
  ],
  dark_pattern_bypassed: [
    "They really buried that cancel link, huh? Found it anyway.",
    "Hidden button? Please. I ate and left no crumbs.",
    "Their dark patterns are no match. Moving on.",
  ],
  kill_confirmed: [
    "Done. That subscription is dead. You're welcome.",
    "Cancelled. That's money back in your pocket.",
    "It's over. Another subscription bites the dust.",
  ],
  kill_failed: [
    "Okay, this one fought back. Their cancellation flow is genuinely unhinged.",
    "They got me this time. But I'm not done.",
    "Failed for now. This one has some CRINGE cancellation defenses.",
  ],
  purchase_alert: [
    "You really thought you needed that? In THIS economy?",
    "Another purchase? Bestie, your wallet is crying.",
    "I'm watching you spend money in real time and it's giving cringe.",
  ],
  celebration: [
    "You actually saved money. I'm not crying, you're crying.",
    "Look at you making smart choices. Slay.",
    "No cap, I'm actually proud of you right now. Don't ruin it.",
  ],
  nudge: [
    "Just checking in. Your spending this week? Cringe.",
    "Bestie, we need to talk about your recent purchases.",
    "Your wallet called. It wants a break.",
  ],
};

function getFallbackResponse(eventType: string): string {
  const pool = FALLBACK_POOLS[eventType] || FALLBACK_POOLS.greeting;
  return pool[Math.floor(Math.random() * pool.length)];
}

export async function invokeModel(
  systemPrompt: string,
  userPrompt: string,
): Promise<InvokeResult> {
  const start = Date.now();

  try {
    const messages: Message[] = [
      {
        role: "user",
        content: [{ text: userPrompt }],
      },
    ];

    const command = new ConverseCommand({
      modelId: MODEL_ID,
      system: [{ text: systemPrompt }],
      messages,
      inferenceConfig: {
        maxTokens: MAX_TOKENS,
        temperature: 0.8,
        topP: 0.9,
      },
    });

    const response = await getClient().send(command);
    const latencyMs = Date.now() - start;

    const text =
      response.output?.message?.content?.[0]?.text?.trim() || "";

    if (!text) {
      console.warn("[bedrock] Empty response from model, using fallback");
      return {
        text: getFallbackResponse(extractEventType(userPrompt)),
        latencyMs,
        fromFallback: true,
      };
    }

    console.log(`[bedrock] Response in ${latencyMs}ms`);
    return { text, latencyMs, fromFallback: false };
  } catch (err) {
    const latencyMs = Date.now() - start;
    console.error("[bedrock] Model invocation failed:", err);

    return {
      text: getFallbackResponse(extractEventType(userPrompt)),
      latencyMs,
      fromFallback: true,
    };
  }
}

function extractEventType(userPrompt: string): string {
  const match = userPrompt.match(/Event Type:\s*(\S+)/);
  return match?.[1] || "greeting";
}
