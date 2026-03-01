import type { TaskStatus } from "../constants/status.js";

export interface TaskStep {
  description: string;
  status: TaskStatus;
  timestamp: string;
}

export interface Task {
  taskId: string;
  subscriptionId: number;
  status: TaskStatus;
  steps: TaskStep[];
  screenshot: string | null; // base64
}
