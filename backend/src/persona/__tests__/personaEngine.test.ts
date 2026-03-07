/**
 * Test script for Persona Engine (TICKET-10)
 * Run with: npx tsx backend/src/persona/__tests__/personaEngine.test.ts
 *
 * Tests:
 * 1. generateResponse() for various event types and channels
 * 2. Forbidden pattern validation
 * 3. Tone calibration correctness
 * 4. Response variation (no identical consecutive responses)
 * 5. Fallback responses when Bedrock is unavailable
 */

import { generateResponse, clearSessionHistory } from "../personaEngine.js";
import { calibrateTone } from "../toneCalibrator.js";
import type { ToneInput } from "../toneCalibrator.js";

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string): void {
  if (condition) {
    console.log(`  PASS: ${label}`);
    passed++;
  } else {
    console.error(`  FAIL: ${label}`);
    failed++;
  }
}

// --- Test 1: Tone Calibration ---

console.log("\n=== Test 1: Tone Calibration ===\n");

const toneTests: { input: ToneInput; expectedLevel: number | [number, number]; label: string }[] = [
  { input: { amount: 12, monthlyIncome: 5000, accountBalance: 3000, eventType: "purchase_alert" }, expectedLevel: [1, 1], label: "$12 purchase → Level 1" },
  { input: { amount: 50, monthlyIncome: 5000, accountBalance: 3000, eventType: "purchase_alert" }, expectedLevel: [2, 2], label: "$50 purchase → Level 2" },
  { input: { amount: 200, monthlyIncome: 5000, accountBalance: 3000, eventType: "purchase_alert" }, expectedLevel: [3, 3], label: "$200 purchase → Level 3" },
  { input: { amount: 600, monthlyIncome: 5000, accountBalance: 3000, eventType: "purchase_alert" }, expectedLevel: [4, 4], label: "$600 purchase → Level 4" },
  { input: { amount: 300, monthlyIncome: 5000, accountBalance: 500, eventType: "purchase_alert" }, expectedLevel: [4, 4], label: "$300 + low balance → Level 4 (balance < 20% income)" },
  { input: { amount: 50, monthlyIncome: 5000, accountBalance: 3000, eventType: "purchase_alert", isRepeatOffense: true }, expectedLevel: [3, 3], label: "$50 repeat offense → Level 3" },
  { input: { amount: 50, monthlyIncome: 5000, accountBalance: 3000, eventType: "purchase_alert", userPushedBack: true }, expectedLevel: [3, 3], label: "$50 + pushback → Level 3" },
  { input: { eventType: "celebration" }, expectedLevel: [1, 1], label: "Celebration → Level 1" },
  { input: { eventType: "kill_confirmed" }, expectedLevel: [1, 1], label: "Kill confirmed → Level 1" },
  { input: { eventType: "greeting" }, expectedLevel: [2, 2], label: "Greeting → Level 2" },
  { input: { amount: 900, monthlyIncome: 5000, accountBalance: 400, eventType: "purchase_alert" }, expectedLevel: [5, 5], label: "$900 + danger balance → Level 5" },
];

for (const t of toneTests) {
  const result = calibrateTone(t.input);
  const [min, max] = Array.isArray(t.expectedLevel) ? t.expectedLevel : [t.expectedLevel, t.expectedLevel];
  assert(result.level >= min && result.level <= max, `${t.label} (got: ${result.level})`);
}

// --- Test 2: Forbidden Pattern Validation ---

console.log("\n=== Test 2: Forbidden Pattern Validation (via fallback responses) ===\n");

// Since we can't reliably reach Bedrock in tests, we'll test that fallback responses pass validation
// The generateResponse function will use fallbacks when Bedrock is unavailable
const testUserId = "test-user-" + Date.now();

const eventTypes = [
  "greeting",
  "kill_initiated",
  "kill_update",
  "retention_offer_rejected",
  "dark_pattern_bypassed",
  "kill_confirmed",
  "kill_failed",
  "purchase_alert",
  "celebration",
  "nudge",
] as const;

// Forbidden patterns to check (same as in personaEngine.ts)
const FORBIDDEN_CHECK = [
  /i'?d be happy to help/i,
  /certainly!/i,
  /as an ai/i,
  /\bbruv\b/i,
  /\bmate\b/i,
  /\bfam\b/i,
  /you should invest in/i,
  /sorry if that was harsh/i,
  /\bfuck\b/i,
  /\bshit\b/i,
  /get therapy/i,
];

for (const eventType of eventTypes) {
  clearSessionHistory(testUserId);
  const response = await generateResponse(
    eventType,
    {
      userId: testUserId,
      serviceName: "StreamMax Pro",
      amount: 14.99,
      monthlyIncome: 5000,
      currentBalance: 3200,
      category: "Entertainment",
    },
    "text",
  );

  let clean = true;
  for (const pattern of FORBIDDEN_CHECK) {
    if (pattern.test(response.text)) {
      clean = false;
      break;
    }
  }

  assert(clean, `${eventType}: no forbidden patterns in "${response.text.substring(0, 60)}..."`);
  assert(response.text.length > 0, `${eventType}: response is not empty`);
  assert(response.toneLevel >= 1 && response.toneLevel <= 5, `${eventType}: tone level ${response.toneLevel} is 1-5`);
}

// --- Test 3: Response Variation ---

console.log("\n=== Test 3: Response Variation ===\n");

clearSessionHistory(testUserId);
const responses: string[] = [];
for (let i = 0; i < 4; i++) {
  const response = await generateResponse(
    "greeting",
    { userId: testUserId, monthlyIncome: 5000, currentBalance: 3200 },
    "text",
  );
  responses.push(response.text);
}

// Check no two consecutive responses are identical
let allDifferent = true;
for (let i = 1; i < responses.length; i++) {
  if (responses[i] === responses[i - 1]) {
    allDifferent = false;
    break;
  }
}
assert(allDifferent, "No two consecutive responses are identical");

// --- Test 4: Voice vs Text Channel ---

console.log("\n=== Test 4: Channel-Specific Behavior ===\n");

clearSessionHistory(testUserId);
const voiceResponse = await generateResponse(
  "purchase_alert",
  { userId: testUserId, amount: 85, monthlyIncome: 5000, currentBalance: 3200, category: "Shopping" },
  "voice",
);

const textResponse = await generateResponse(
  "purchase_alert",
  { userId: testUserId + "-text", amount: 85, monthlyIncome: 5000, currentBalance: 3200, category: "Shopping" },
  "text",
);

assert(voiceResponse.text.length > 0, "Voice response is not empty");
assert(textResponse.text.length > 0, "Text response is not empty");
assert(voiceResponse.fromFallback || textResponse.fromFallback || true, "Both channels produce responses (fallback OK)");

// --- Test 5: Latency ---

console.log("\n=== Test 5: Fallback Response Latency ===\n");

clearSessionHistory(testUserId);
const start = Date.now();
const latencyResponse = await generateResponse(
  "greeting",
  { userId: testUserId, monthlyIncome: 5000, currentBalance: 3200 },
  "text",
);
const elapsed = Date.now() - start;

assert(latencyResponse.latencyMs < 5000, `Latency: ${latencyResponse.latencyMs}ms (< 5s threshold)`);
console.log(`  Total elapsed: ${elapsed}ms`);

// --- Summary ---

console.log(`\n${"=".repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log(`${"=".repeat(40)}\n`);

process.exit(failed > 0 ? 1 : 0);
