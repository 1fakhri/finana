import { Router } from "express";
import { createTask, getTask } from "../orchestration/taskManager.js";
import { getScreenshot } from "../orchestration/screenshotStore.js";
import { executeCancel, type CancelContext } from "../orchestration/orchestrator.js";
import { getUserProfile, getSubscriptions } from "../data/dataService.js";

export const taskRouter = Router();

// POST /api/tasks/cancel -- create a cancellation task
taskRouter.post("/cancel", async (req, res) => {
  const { subscriptionId } = req.body;

  if (subscriptionId == null) {
    res.status(400).json({ error: "subscriptionId is required" });
    return;
  }

  try {
    const task = createTask(Number(subscriptionId));

    // Build context for persona engine (best-effort, non-blocking)
    let cancelContext: CancelContext | undefined;
    try {
      const userId = (req as any).userId as string;
      const [profile, subscriptions] = await Promise.all([
        getUserProfile(userId),
        getSubscriptions(userId),
      ]);
      const sub = subscriptions.find(
        (s: { id: number }) => s.id === Number(subscriptionId),
      );
      if (sub && profile) {
        cancelContext = {
          userId,
          serviceName: sub.name,
          monthlyCost: Number(sub.monthly_cost),
          monthlyIncome: Number(profile.monthly_income),
          currentBalance: Number(profile.account_balance),
        };
      }
    } catch (err) {
      console.warn("[tasks] Could not build cancel context for persona:", err);
    }

    // Fire-and-forget: run the simulated cancellation
    executeCancel(task.taskId, cancelContext).catch((err) => {
      console.error(`[tasks] Cancel execution failed for ${task.taskId}:`, err);
    });

    res.status(201).json({ taskId: task.taskId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(409).json({ error: message });
  }
});

// GET /api/tasks/:taskId -- get task state
taskRouter.get("/:taskId", (req, res) => {
  const task = getTask(req.params.taskId);
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json(task);
});

// GET /api/tasks/:taskId/screenshot -- get screenshot image
taskRouter.get("/:taskId/screenshot", (req, res) => {
  const task = getTask(req.params.taskId);
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  const screenshot = getScreenshot(req.params.taskId);
  if (!screenshot) {
    res.status(404).json({ error: "No screenshot available" });
    return;
  }

  res.setHeader("Content-Type", screenshot.mimeType);
  res.send(screenshot.buffer);
});
