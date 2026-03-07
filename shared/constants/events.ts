export const EVENT_TYPES = {
  AGENT_STATUS: "agent.status",
  AGENT_THOUGHT: "agent.thought",
  AGENT_ACTION: "agent.action",
  AGENT_ERROR: "agent.error",
  AGENT_SCREENSHOT: "agent.screenshot",
  PERSONA_COMMENTARY: "persona.commentary",
  TASK_COMPLETE: "task.complete",
  VOICE_CONNECTED: "voice.connected",
  VOICE_TRANSCRIPT: "voice.transcript",
  VOICE_DISCONNECTED: "voice.disconnected",
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];
