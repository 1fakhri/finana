import crypto from "node:crypto";
import { TASK_STATUS, type TaskStatus } from "../../../shared/constants/status.js";
import type { Task, TaskStep } from "../../../shared/types/task.js";

const tasks = new Map<string, Task>();
const activeTasksBySubscription = new Map<number, string>();

export function createTask(subscriptionId: number): Task {
  const existing = activeTasksBySubscription.get(subscriptionId);
  if (existing) {
    const task = tasks.get(existing);
    if (
      task &&
      task.status !== TASK_STATUS.COMPLETED &&
      task.status !== TASK_STATUS.FAILED
    ) {
      throw new Error(
        `Active task already exists for subscription ${subscriptionId}: ${existing}`,
      );
    }
  }

  const taskId = crypto.randomUUID();
  const task: Task = {
    taskId,
    subscriptionId,
    status: TASK_STATUS.PENDING,
    steps: [],
    screenshot: null,
  };

  tasks.set(taskId, task);
  activeTasksBySubscription.set(subscriptionId, taskId);
  return task;
}

export function getTask(taskId: string): Task | undefined {
  return tasks.get(taskId);
}

export function updateTaskStatus(taskId: string, status: TaskStatus): void {
  const task = tasks.get(taskId);
  if (!task) throw new Error(`Task not found: ${taskId}`);
  task.status = status;
}

export function addTaskStep(taskId: string, step: TaskStep): void {
  const task = tasks.get(taskId);
  if (!task) throw new Error(`Task not found: ${taskId}`);
  task.steps.push(step);
}

export function setTaskScreenshot(taskId: string, screenshotBase64: string): void {
  const task = tasks.get(taskId);
  if (!task) throw new Error(`Task not found: ${taskId}`);
  task.screenshot = screenshotBase64;
}
