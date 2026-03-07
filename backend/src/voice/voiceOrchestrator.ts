import { getUserProfile, getSubscriptions } from "../data/dataService.js";
import { generateResponse, clearSessionHistory } from "../persona/personaEngine.js";
import { assemblePrompt } from "../persona/prompts.js";
import { calibrateTone } from "../persona/toneCalibrator.js";

interface SessionConfig {
  userId: string;
  mode: "continuous" | "push-to-talk";
}

interface VoiceSessionState {
  sessionId: string;
  config: SessionConfig;
  active: boolean;
  personaSystemPrompt: string | null;
}

const sessions = new Map<string, VoiceSessionState>();

export async function startSession(sessionId: string, config: SessionConfig): Promise<string | null> {
  // Build persona system prompt from user's financial context
  let personaSystemPrompt: string | null = null;
  let openingLine: string | null = null;

  try {
    const context = await getFinancialContext(config.userId);
    if (context) {
      const { system } = assemblePrompt(
        {
          eventType: "greeting",
          monthlyIncome: Number(context.profile.monthly_income),
          currentBalance: Number(context.profile.account_balance),
        },
        "voice",
      );
      personaSystemPrompt = system;

      // Generate an opening line for the voice session
      const response = await generateResponse(
        "greeting",
        {
          userId: config.userId,
          monthlyIncome: Number(context.profile.monthly_income),
          currentBalance: Number(context.profile.account_balance),
        },
        "voice",
      );
      openingLine = response.text;
    }
  } catch (err) {
    console.error("[voice-orchestrator] Failed to build persona context:", err);
  }

  sessions.set(sessionId, { sessionId, config, active: true, personaSystemPrompt });
  console.log(`[voice-orchestrator] Session created: ${sessionId}`);

  return openingLine;
}

export function processAudio(
  sessionId: string,
  _audioChunk: Buffer,
): Buffer | null {
  const session = sessions.get(sessionId);
  if (!session || !session.active) return null;

  // Placeholder: returns silence (320 samples of 16-bit zeros = 640 bytes = 20ms at 16kHz)
  return Buffer.alloc(640);
}

export function endSession(sessionId: string): void {
  const session = sessions.get(sessionId);
  if (session) {
    session.active = false;
    clearSessionHistory(session.config.userId);
    sessions.delete(sessionId);
    console.log(`[voice-orchestrator] Session ended: ${sessionId}`);
  }
}

export function getSessionPersonaPrompt(sessionId: string): string | null {
  return sessions.get(sessionId)?.personaSystemPrompt || null;
}

export function getToneForAmount(
  amount: number,
  balance: number,
  income: number,
): { level: number; severity: string } {
  return calibrateTone({
    amount,
    accountBalance: balance,
    monthlyIncome: income,
    eventType: "purchase_alert",
  });
}

export async function getFinancialContext(
  userId: string,
): Promise<{ profile: any; subscriptions: any[] } | null> {
  try {
    const [profile, subscriptions] = await Promise.all([
      getUserProfile(userId),
      getSubscriptions(userId),
    ]);
    return { profile, subscriptions };
  } catch (err) {
    console.error(`[voice-orchestrator] Failed to get financial context:`, err);
    return null;
  }
}
