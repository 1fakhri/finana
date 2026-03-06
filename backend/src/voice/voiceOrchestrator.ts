import { getUserProfile, getSubscriptions } from "../data/dataService.js";

interface SessionConfig {
  userId: string;
  mode: "continuous" | "push-to-talk";
}

interface VoiceSessionState {
  sessionId: string;
  config: SessionConfig;
  active: boolean;
}

const sessions = new Map<string, VoiceSessionState>();

export function startSession(sessionId: string, config: SessionConfig): void {
  sessions.set(sessionId, { sessionId, config, active: true });
  console.log(`[voice-orchestrator] Session created: ${sessionId}`);
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
    sessions.delete(sessionId);
    console.log(`[voice-orchestrator] Session ended: ${sessionId}`);
  }
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
