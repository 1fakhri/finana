export interface AgentStatusEvent {
  type: "agent.status";
  taskId: string;
  status: string;
  message: string;
}

export interface AgentThoughtEvent {
  type: "agent.thought";
  taskId: string;
  thought: string;
}

export interface AgentActionEvent {
  type: "agent.action";
  taskId: string;
  action: string;
  target: string;
}

export interface AgentErrorEvent {
  type: "agent.error";
  taskId: string;
  error: string;
}

export interface AgentScreenshotEvent {
  type: "agent.screenshot";
  taskId: string;
  screenshot: string; // base64
}

export interface TaskCompleteEvent {
  type: "task.complete";
  taskId: string;
  success: boolean;
  message: string;
}

export interface VoiceConnectedEvent {
  type: "voice.connected";
  sessionId: string;
}

export interface VoiceTranscriptEvent {
  type: "voice.transcript";
  sessionId: string;
  text: string;
  speaker: "user" | "agent";
}

export interface VoiceDisconnectedEvent {
  type: "voice.disconnected";
  sessionId: string;
}

export type WebSocketEvent =
  | AgentStatusEvent
  | AgentThoughtEvent
  | AgentActionEvent
  | AgentErrorEvent
  | AgentScreenshotEvent
  | TaskCompleteEvent
  | VoiceConnectedEvent
  | VoiceTranscriptEvent
  | VoiceDisconnectedEvent;
