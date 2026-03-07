import { Router } from "express";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

export const authRouter = Router();

// POST /api/auth/init-user
// Called after signup to create user_profiles and user_preferences rows
authRouter.post("/init-user", async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: "name and email are required" });
    return;
  }

  try {
    // Check if profile already exists (idempotent)
    const { data: existing } = await supabaseAdmin
      .from("user_profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (existing) {
      res.json({ status: "already_initialized" });
      return;
    }

    // Create user_profiles row
    const { error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .insert({
        user_id: userId,
        name,
        email,
      });

    if (profileError) {
      throw new Error(`user_profiles insert: ${profileError.message}`);
    }

    // Create user_preferences row with defaults
    const { error: prefsError } = await supabaseAdmin
      .from("user_preferences")
      .insert({
        user_id: userId,
        roast_level: "balanced",
        onboarding_completed: false,
      });

    if (prefsError) {
      throw new Error(`user_preferences insert: ${prefsError.message}`);
    }

    res.status(201).json({ status: "initialized" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[auth] init-user error:", message);
    res.status(500).json({ error: message });
  }
});
