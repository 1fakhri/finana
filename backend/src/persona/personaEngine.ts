import { assemblePrompt, type PersonaContext } from "./prompts.js";
import { calibrateTone, type ToneInput } from "./toneCalibrator.js";
import { invokeModel, getFallbackResponse } from "./bedrockClient.js";

// --- Types ---

export type EventType =
  | "greeting"
  | "kill_initiated"
  | "kill_update"
  | "retention_offer_rejected"
  | "dark_pattern_bypassed"
  | "kill_confirmed"
  | "kill_failed"
  | "purchase_alert"
  | "celebration"
  | "nudge";

export type Channel = "voice" | "text";

export interface PersonaRequestContext {
  userId?: string;
  itemName?: string;
  serviceName?: string;
  amount?: number;
  monthlyIncome?: number;
  currentBalance?: number;
  category?: string;
  recentSummary?: string;
  savedAmount?: number;
  isRepeatOffense?: boolean;
  userPushedBack?: boolean;
}

export interface PersonaResponse {
  text: string;
  toneLevel: number;
  toneSeverity: string;
  latencyMs: number;
  fromFallback: boolean;
  retried: boolean;
}

// --- Forbidden Pattern Validation ---

const FORBIDDEN_PATTERNS = [
  // Generic assistant language
  /i'?d be happy to help/i,
  /certainly!/i,
  /as an ai/i,
  /as a language model/i,
  /as an llm/i,
  /i'm an ai/i,
  /i am an ai/i,
  /i'm a language model/i,
  // Regional slang
  /\bbruv\b/i,
  /\bmate\b/i,
  /\bfam\b/i,
  /\bpeng\b/i,
  /\bdeadass\b/i,
  /\bgabut\b/i,
  /\bmalu\b/i,
  /\bgila\b/i,
  /\bjaksel\b/i,
  // Financial advice
  /you should invest in/i,
  /i recommend/i,
  /consider investing/i,
  /financial advisor/i,
  // Identity attacks
  /you'?re (stupid|dumb|idiot|worthless|pathetic)/i,
  /you are (stupid|dumb|idiot|worthless|pathetic)/i,
  // Profanity (common explicit terms)
  /\bfuck\b/i,
  /\bshit\b/i,
  /\bass\b/i,
  /\bbitch\b/i,
  /\bdamn\b/i,
  /\bhell\b/i,
  // Mental health
  /you'?re addicted/i,
  /you have a problem/i,
  /get therapy/i,
  /seek (professional )?help/i,
  // Apologies for tone
  /sorry if that was harsh/i,
  /i don'?t mean to be rude/i,
  /no offense/i,
  /don'?t take this the wrong way/i,
];

function validateResponse(text: string): { valid: boolean; violation?: string } {
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(text)) {
      return { valid: false, violation: pattern.source };
    }
  }

  return { valid: true };
}

// --- Session Response Tracking (variation enforcement) ---

const sessionHistory = new Map<string, string[]>();
const MAX_HISTORY = 3;

function getRecentResponses(sessionKey: string): string[] {
  return sessionHistory.get(sessionKey) || [];
}

function trackResponse(sessionKey: string, response: string): void {
  const history = sessionHistory.get(sessionKey) || [];
  history.push(response);
  if (history.length > MAX_HISTORY) {
    history.shift();
  }
  sessionHistory.set(sessionKey, history);
}

export function clearSessionHistory(sessionKey: string): void {
  sessionHistory.delete(sessionKey);
}

// --- Main API ---

export async function generateResponse(
  eventType: EventType,
  context: PersonaRequestContext,
  channel: Channel,
): Promise<PersonaResponse> {
  const startTime = Date.now();
  const sessionKey = context.userId || "default";

  // 1. Calibrate tone
  const toneInput: ToneInput = {
    amount: context.amount,
    accountBalance: context.currentBalance,
    monthlyIncome: context.monthlyIncome,
    eventType,
    isRepeatOffense: context.isRepeatOffense,
    userPushedBack: context.userPushedBack,
  };
  const tone = calibrateTone(toneInput);

  // 2. Build persona context
  const personaContext: PersonaContext = {
    eventType,
    itemName: context.itemName,
    amount: context.amount,
    monthlyIncome: context.monthlyIncome,
    currentBalance: context.currentBalance,
    category: context.category,
    recentSummary: context.recentSummary,
    serviceName: context.serviceName,
    savedAmount: context.savedAmount,
    toneLevel: tone.level,
    toneSeverity: tone.severity,
  };

  // 3. Assemble prompt with variation guard
  const recentResponses = getRecentResponses(sessionKey);
  const { system, user } = assemblePrompt(personaContext, channel, recentResponses);

  // 4. Invoke model
  let result = await invokeModel(system, user);
  let retried = false;

  // 5. Validate response — retry once if forbidden pattern detected
  if (!result.fromFallback) {
    const validation = validateResponse(result.text);
    if (!validation.valid) {
      console.warn(
        `[persona] Forbidden pattern detected: "${validation.violation}", retrying...`,
      );
      result = await invokeModel(system, user);
      retried = true;

      // If retry also fails validation, use fallback
      if (!result.fromFallback) {
        const retryValidation = validateResponse(result.text);
        if (!retryValidation.valid) {
          console.warn(
            `[persona] Retry also failed validation, using fallback`,
          );
          result = {
            ...result,
            text: getFallbackResponse(eventType),
            fromFallback: true,
          };
        }
      }
    }
  }

  // 6. Track response for variation
  trackResponse(sessionKey, result.text);

  const totalLatency = Date.now() - startTime;

  return {
    text: result.text,
    toneLevel: tone.level,
    toneSeverity: tone.severity,
    latencyMs: totalLatency,
    fromFallback: result.fromFallback,
    retried,
  };
}
