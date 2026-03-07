import { TASK_STATUS } from "../../../shared/constants/status.js";
import { updateTaskStatus, addTaskStep } from "./taskManager.js";
import { broadcast } from "../ws/agentEventStream.js";
import { generateResponse } from "../persona/personaEngine.js";
import type { PersonaRequestContext } from "../persona/personaEngine.js";

export interface CancelContext {
  userId: string;
  serviceName: string;
  monthlyCost: number;
  monthlyIncome?: number;
  currentBalance?: number;
}

const SIMULATED_STEPS = [
  { action: "navigate", target: "StreamMax Pro login page", thought: "Opening the target site and preparing to log in..." },
  { action: "type", target: "Email input field", thought: "Entering account credentials..." },
  { action: "click", target: "Sign In button", thought: "Submitting login form..." },
  { action: "navigate", target: "Account Settings page", thought: "Looking for subscription management..." },
  { action: "click", target: "Manage Plan link", thought: "Found the plan management section, navigating..." },
  { action: "click", target: "Cancel Subscription button", thought: "Initiating cancellation flow..." },
  { action: "select", target: "Cancellation reason dropdown", thought: "They want a reason — selecting 'Too expensive'..." },
  { action: "click", target: "Reject retention offer", thought: "They're offering a discount. Rejecting..." },
  { action: "click", target: "Confirm cancellation button", thought: "Bypassing guilt trip. Confirming cancellation..." },
  { action: "verify", target: "Cancellation confirmation page", thought: "Verifying cancellation was successful..." },
];

// Maps step indices to persona event types
const PERSONA_EVENTS: Record<number, string> = {
  0: "kill_initiated",           // Starting the cancellation
  6: "kill_update",              // Dealing with reason dropdown
  7: "retention_offer_rejected", // Rejecting retention offer
  8: "dark_pattern_bypassed",    // Bypassing guilt trip
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function broadcastPersona(
  taskId: string,
  eventType: string,
  context: CancelContext,
): Promise<void> {
  try {
    const personaContext: PersonaRequestContext = {
      userId: context.userId,
      serviceName: context.serviceName,
      amount: context.monthlyCost,
      monthlyIncome: context.monthlyIncome,
      currentBalance: context.currentBalance,
    };

    const response = await generateResponse(
      eventType as any,
      personaContext,
      "text",
    );

    broadcast(taskId, {
      type: "persona.commentary",
      taskId,
      text: response.text,
      eventType,
      toneLevel: response.toneLevel,
    });
  } catch (err) {
    console.error(`[orchestrator] Persona generation failed for ${eventType}:`, err);
  }
}

export async function executeCancel(
  taskId: string,
  context?: CancelContext,
): Promise<void> {
  updateTaskStatus(taskId, TASK_STATUS.IN_PROGRESS);

  broadcast(taskId, {
    type: "agent.status",
    taskId,
    status: "IN_PROGRESS",
    message: "Starting subscription cancellation...",
  });

  for (let i = 0; i < SIMULATED_STEPS.length; i++) {
    const step = SIMULATED_STEPS[i];
    await delay(800 + Math.random() * 700);

    broadcast(taskId, {
      type: "agent.thought",
      taskId,
      thought: step.thought,
    });

    // Broadcast persona commentary at key steps
    const personaEvent = PERSONA_EVENTS[i];
    if (personaEvent && context) {
      await broadcastPersona(taskId, personaEvent, context);
    }

    await delay(400 + Math.random() * 300);

    addTaskStep(taskId, {
      description: `${step.action}: ${step.target}`,
      status: TASK_STATUS.COMPLETED,
      timestamp: new Date().toISOString(),
    });

    broadcast(taskId, {
      type: "agent.action",
      taskId,
      action: step.action,
      target: step.target,
    });
  }

  updateTaskStatus(taskId, TASK_STATUS.COMPLETED);

  // Broadcast kill_confirmed persona commentary
  if (context) {
    await broadcastPersona(taskId, "kill_confirmed", context);
  }

  broadcast(taskId, {
    type: "task.complete",
    taskId,
    success: true,
    message: "Subscription cancelled successfully.",
  });
}
