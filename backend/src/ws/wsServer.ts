import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "node:http";
import type { IncomingMessage } from "node:http";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";
import { addConnection, removeConnection } from "./agentEventStream.js";
import { handleVoiceConnection } from "./voiceHandler.js";
import { getTask } from "../orchestration/taskManager.js";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

async function authenticateUpgrade(
  req: IncomingMessage,
): Promise<string | null> {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const token = url.searchParams.get("token");

  if (!token) return DEMO_USER_ID;

  try {
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) return null;
    return user.id;
  } catch {
    return null;
  }
}

function parseRoute(
  url: string,
): { type: "task"; taskId: string } | { type: "voice" } | null {
  const pathname = new URL(url, "http://localhost").pathname;

  const taskMatch = pathname.match(/^\/ws\/tasks\/([^/]+)$/);
  if (taskMatch) return { type: "task", taskId: taskMatch[1] };

  if (pathname === "/ws/voice") return { type: "voice" };

  return null;
}

export function setupWebSocketServer(server: Server): void {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", async (req, socket, head) => {
    const userId = await authenticateUpgrade(req);
    if (!userId) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    const route = parseRoute(req.url ?? "/");
    if (!route) {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      (ws as any).userId = userId;
      wss.emit("connection", ws, req, route);
    });
  });

  wss.on(
    "connection",
    (
      ws: WebSocket,
      _req: IncomingMessage,
      route: { type: "task"; taskId: string } | { type: "voice" },
    ) => {
      if (route.type === "task") {
        handleTaskConnection(ws, route.taskId);
      } else {
        handleVoiceConnection(ws, (ws as any).userId);
      }
    },
  );

  console.log("[ws] WebSocket server attached");
}

function handleTaskConnection(ws: WebSocket, taskId: string): void {
  const task = getTask(taskId);
  if (!task) {
    ws.close(4004, "Task not found");
    return;
  }

  addConnection(taskId, ws);
  console.log(`[ws] Client connected to task ${taskId}`);

  ws.on("close", () => {
    removeConnection(taskId, ws);
    console.log(`[ws] Client disconnected from task ${taskId}`);
  });

  ws.on("error", (err) => {
    console.error(`[ws] Task connection error:`, err.message);
    removeConnection(taskId, ws);
  });
}
