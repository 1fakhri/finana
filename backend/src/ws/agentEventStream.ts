import type { WebSocket } from "ws";
import type { WebSocketEvent } from "../../../shared/types/events.js";

const connections = new Map<string, Set<WebSocket>>();

export function addConnection(taskId: string, ws: WebSocket): void {
  let set = connections.get(taskId);
  if (!set) {
    set = new Set();
    connections.set(taskId, set);
  }
  set.add(ws);
}

export function removeConnection(taskId: string, ws: WebSocket): void {
  const set = connections.get(taskId);
  if (!set) return;
  set.delete(ws);
  if (set.size === 0) connections.delete(taskId);
}

export function broadcast(taskId: string, event: WebSocketEvent): void {
  const set = connections.get(taskId);
  if (!set) return;

  const message = JSON.stringify({ ...event, timestamp: new Date().toISOString() });

  for (const ws of set) {
    if (ws.readyState === ws.OPEN) {
      ws.send(message);
    }
  }
}
