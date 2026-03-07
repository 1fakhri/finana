import type { WebSocket } from "ws";
import crypto from "node:crypto";
import {
  startSession,
  processAudio,
  endSession,
} from "../voice/voiceOrchestrator.js";

interface VoiceSession {
  sessionId: string;
  userId: string;
  mode: "continuous" | "push-to-talk";
}

const activeSessions = new Map<WebSocket, VoiceSession>();
const userSessions = new Map<string, WebSocket>();

function sendJson(ws: WebSocket, data: Record<string, unknown>): void {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

export function handleVoiceConnection(ws: WebSocket, userId: string): void {
  // Enforce one session per user
  const existingWs = userSessions.get(userId);
  if (existingWs && existingWs.readyState === existingWs.OPEN) {
    sendJson(existingWs, {
      type: "session_closed",
      reason: "New session opened from another connection",
    });
    cleanupSession(existingWs);
    existingWs.close(4000, "Replaced by new connection");
  }

  console.log(`[voice] Client connected: ${userId}`);

  ws.on("message", (data, isBinary) => {
    if (isBinary) {
      handleAudioFrame(ws, data as Buffer);
    } else {
      handleControlMessage(ws, userId, data.toString());
    }
  });

  ws.on("close", () => {
    console.log(`[voice] Client disconnected: ${userId}`);
    cleanupSession(ws);
  });

  ws.on("error", (err) => {
    console.error(`[voice] Connection error:`, err.message);
    cleanupSession(ws);
  });
}

function handleControlMessage(
  ws: WebSocket,
  userId: string,
  raw: string,
): void {
  let msg: { type: string; mode?: string };
  try {
    msg = JSON.parse(raw);
  } catch {
    sendJson(ws, { type: "error", code: "INVALID_JSON", message: "Invalid JSON" });
    return;
  }

  switch (msg.type) {
    case "session_start": {
      const sessionId = crypto.randomUUID();
      const mode = (msg.mode === "push-to-talk" ? "push-to-talk" : "continuous") as
        | "continuous"
        | "push-to-talk";

      const session: VoiceSession = { sessionId, userId, mode };
      activeSessions.set(ws, session);
      userSessions.set(userId, ws);

      startSession(sessionId, { userId, mode }).then((openingLine) => {
        sendJson(ws, { type: "session_ready", sessionId, openingLine });
        console.log(`[voice] Session started: ${sessionId} (${mode})`);
      });
      break;
    }

    case "session_end": {
      const session = activeSessions.get(ws);
      if (session) {
        endSession(session.sessionId);
        sendJson(ws, {
          type: "session_closed",
          reason: "Client requested session end",
        });
        cleanupSession(ws);
      }
      break;
    }

    case "utterance_end": {
      const session = activeSessions.get(ws);
      if (session) {
        sendJson(ws, { type: "turn_start" });
        // Placeholder: in the real implementation, this triggers AI response
        sendJson(ws, { type: "turn_end" });
      }
      break;
    }

    default:
      sendJson(ws, {
        type: "error",
        code: "UNKNOWN_TYPE",
        message: `Unknown message type: ${msg.type}`,
      });
  }
}

function handleAudioFrame(ws: WebSocket, audioData: Buffer): void {
  const session = activeSessions.get(ws);
  if (!session) return;

  const response = processAudio(session.sessionId, audioData);
  if (response && ws.readyState === ws.OPEN) {
    ws.send(response);
  }
}

function cleanupSession(ws: WebSocket): void {
  const session = activeSessions.get(ws);
  if (session) {
    endSession(session.sessionId);
    userSessions.delete(session.userId);
    activeSessions.delete(ws);
  }
}
