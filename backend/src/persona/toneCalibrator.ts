export interface ToneInput {
  amount?: number;
  accountBalance?: number;
  monthlyIncome?: number;
  eventType: string;
  isRepeatOffense?: boolean;
  userPushedBack?: boolean;
}

export interface ToneResult {
  level: number;        // 1-5
  severity: string;     // "playful" | "teasing" | "sarcastic" | "judgmental" | "alarmed"
}

const SEVERITY_LABELS: Record<number, string> = {
  1: "playful",
  2: "teasing",
  3: "sarcastic",
  4: "judgmental",
  5: "alarmed",
};

// Events that always use low tone
const CELEBRATION_EVENTS = new Set([
  "celebration",
  "kill_confirmed",
]);

const LOW_TONE_EVENTS = new Set([
  "greeting",
  "kill_initiated",
  "dark_pattern_bypassed",
]);

export function calibrateTone(input: ToneInput): ToneResult {
  const { amount, accountBalance, monthlyIncome, eventType, isRepeatOffense, userPushedBack } = input;

  // Celebration / kill events -> Level 1
  if (CELEBRATION_EVENTS.has(eventType)) {
    return { level: 1, severity: SEVERITY_LABELS[1] };
  }

  // Low-tone events -> Level 1-2
  if (LOW_TONE_EVENTS.has(eventType)) {
    return { level: 2, severity: SEVERITY_LABELS[2] };
  }

  // Kill failed -> Level 3 (frustrated but not at the user)
  if (eventType === "kill_failed") {
    return { level: 3, severity: SEVERITY_LABELS[3] };
  }

  // Purchase-based tone calibration
  let level = 2; // default

  if (amount != null) {
    if (amount < 20) {
      level = 1;
    } else if (amount < 100) {
      level = 2;
    } else if (amount < 500) {
      level = 3;
    } else {
      level = 4;
    }
  }

  // Amount-to-income ratio modifier
  if (amount != null && monthlyIncome != null && monthlyIncome > 0) {
    const ratio = amount / monthlyIncome;
    if (ratio > 0.15) {
      level = Math.max(level, 4); // Full intervention
    } else if (ratio > 0.05) {
      level = Math.max(level, 3); // Elevated concern
    }
  }

  // Balance danger modifier: balance < 20% of monthly income -> +1
  if (accountBalance != null && monthlyIncome != null && monthlyIncome > 0) {
    if (accountBalance < monthlyIncome * 0.2) {
      level = Math.min(level + 1, 5);
    }
  }

  // Repeat offense -> +1
  if (isRepeatOffense) {
    level = Math.min(level + 1, 5);
  }

  // User pushback -> +1
  if (userPushedBack) {
    level = Math.min(level + 1, 5);
  }

  // Clamp
  level = Math.max(1, Math.min(5, level));

  return { level, severity: SEVERITY_LABELS[level] };
}
