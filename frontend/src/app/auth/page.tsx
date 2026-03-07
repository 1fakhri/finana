"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Button } from "@/components/Button";
import { Mail, Eye, EyeOff } from "lucide-react";

type AuthView = "login" | "signup" | "magic-link";

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

const viewVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const shakeVariants = {
  shake: {
    x: [0, -4, 4, -2, 0],
    transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] },
  },
};

export default function AuthPage() {
  const [view, setView] = useState<AuthView>("login");
  const [error, setError] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, signUp, signInWithMagicLink } = useAuth();
  const reducedMotion = useReducedMotion();

  const triggerShake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 250);
  }, []);

  const switchView = useCallback((next: AuthView) => {
    setError(null);
    setMagicLinkSent(false);
    setShowPassword(false);
    setView(next);
  }, []);

  const handleLogin = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setSubmitting(true);

      const form = new FormData(e.currentTarget);
      const email = form.get("email") as string;
      const password = form.get("password") as string;

      const { error } = await signIn(email, password);
      setSubmitting(false);

      if (error) {
        setError(error.message === "Invalid login credentials"
          ? "Wrong email or password. Try again?"
          : error.message);
        triggerShake();
      }
    },
    [signIn, triggerShake],
  );

  const handleSignup = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setSubmitting(true);

      const form = new FormData(e.currentTarget);
      const name = form.get("name") as string;
      const email = form.get("email") as string;
      const password = form.get("password") as string;

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setSubmitting(false);
        triggerShake();
        return;
      }

      const { error } = await signUp(email, password, name);
      setSubmitting(false);

      if (error) {
        setError(error.message);
        triggerShake();
      }
      // On success, AuthContext will update and AuthGate will redirect
    },
    [signUp, triggerShake],
  );

  const handleMagicLink = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setSubmitting(true);

      const form = new FormData(e.currentTarget);
      const email = form.get("email") as string;

      const { error } = await signInWithMagicLink(email);
      setSubmitting(false);

      if (error) {
        setError(error.message);
        triggerShake();
      } else {
        setSentEmail(email);
        setMagicLinkSent(true);
      }
    },
    [signInWithMagicLink, triggerShake],
  );

  return (
    <div className="page-background flex items-center justify-center min-h-dvh px-5">
      <motion.div
        className="w-full max-w-[400px] bg-bg-surface border border-border-default rounded-radius-xl p-8"
        variants={reducedMotion ? undefined : cardVariants}
        initial="hidden"
        animate={shaking ? "shake" : "visible"}
        {...(shaking && !reducedMotion ? { variants: { ...cardVariants, ...shakeVariants } } : {})}
      >
        {/* Finana Wordmark */}
        <div className="text-center mb-8">
          <h1
            className="text-h1 gradient-text gradient-text--animated inline-block"
          >
            finana
          </h1>
        </div>

        {/* View Switcher */}
        <AnimatePresence mode="wait">
          {view === "login" && (
            <motion.div
              key="login"
              variants={reducedMotion ? undefined : viewVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <LoginView
                onSubmit={handleLogin}
                error={error}
                submitting={submitting}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword((p) => !p)}
                onSwitchToSignup={() => switchView("signup")}
                onSwitchToMagicLink={() => switchView("magic-link")}
              />
            </motion.div>
          )}

          {view === "signup" && (
            <motion.div
              key="signup"
              variants={reducedMotion ? undefined : viewVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <SignupView
                onSubmit={handleSignup}
                error={error}
                submitting={submitting}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword((p) => !p)}
                onSwitchToLogin={() => switchView("login")}
              />
            </motion.div>
          )}

          {view === "magic-link" && (
            <motion.div
              key="magic-link"
              variants={reducedMotion ? undefined : viewVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <MagicLinkView
                onSubmit={handleMagicLink}
                error={error}
                submitting={submitting}
                magicLinkSent={magicLinkSent}
                sentEmail={sentEmail}
                onSwitchToLogin={() => switchView("login")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ============================================================
   Login View
   ============================================================ */

function LoginView({
  onSubmit,
  error,
  submitting,
  showPassword,
  onTogglePassword,
  onSwitchToSignup,
  onSwitchToMagicLink,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
  submitting: boolean;
  showPassword: boolean;
  onTogglePassword: () => void;
  onSwitchToSignup: () => void;
  onSwitchToMagicLink: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <h2 className="text-h2 text-text-primary text-center mb-2">
        Welcome back, bestie
      </h2>

      <AuthInput
        name="email"
        type="email"
        placeholder="your@email.com"
        autoComplete="email"
        required
      />

      <div className="relative">
        <AuthInput
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="password"
          autoComplete="current-password"
          required
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && <p className="text-sm text-kill text-center">{error}</p>}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full mt-2"
        disabled={submitting}
      >
        {submitting ? "Logging in..." : "Log In"}
      </Button>

      <div className="flex flex-col items-center gap-2 mt-2">
        <p className="text-sm text-text-secondary">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-accent-primary hover:underline cursor-pointer font-semibold"
          >
            Sign Up
          </button>
        </p>
        <button
          type="button"
          onClick={onSwitchToMagicLink}
          className="text-sm text-text-secondary hover:underline cursor-pointer"
        >
          Use magic link instead
        </button>
      </div>
    </form>
  );
}

/* ============================================================
   Signup View
   ============================================================ */

function SignupView({
  onSubmit,
  error,
  submitting,
  showPassword,
  onTogglePassword,
  onSwitchToLogin,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
  submitting: boolean;
  showPassword: boolean;
  onTogglePassword: () => void;
  onSwitchToLogin: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <h2 className="text-h2 text-text-primary text-center mb-2">
        Let&apos;s get you started
      </h2>

      <AuthInput
        name="name"
        type="text"
        placeholder="Your name"
        autoComplete="name"
        required
      />

      <AuthInput
        name="email"
        type="email"
        placeholder="your@email.com"
        autoComplete="email"
        required
      />

      <div className="relative">
        <AuthInput
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="password (min 6 characters)"
          autoComplete="new-password"
          required
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && <p className="text-sm text-kill text-center">{error}</p>}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full mt-2"
        disabled={submitting}
      >
        {submitting ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-sm text-text-secondary text-center mt-2">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-accent-primary hover:underline cursor-pointer font-semibold"
        >
          Log In
        </button>
      </p>
    </form>
  );
}

/* ============================================================
   Magic Link View
   ============================================================ */

function MagicLinkView({
  onSubmit,
  error,
  submitting,
  magicLinkSent,
  sentEmail,
  onSwitchToLogin,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
  submitting: boolean;
  magicLinkSent: boolean;
  sentEmail: string;
  onSwitchToLogin: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-h2 text-text-primary text-center mb-1">
        Magic link
      </h2>
      <p className="text-sm text-text-secondary text-center mb-2">
        We&apos;ll email you a link to sign in. No password needed.
      </p>

      {!magicLinkSent ? (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <AuthInput
            name="email"
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
            required
          />

          {error && <p className="text-sm text-kill text-center">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            disabled={submitting}
          >
            {submitting ? "Sending..." : "Send Magic Link"}
          </Button>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center">
            <Mail className="w-6 h-6 text-accent-primary" />
          </div>
          <p className="text-body text-text-primary text-center">
            We sent a link to{" "}
            <span className="font-semibold text-accent-primary">
              {sentEmail}
            </span>
          </p>
          <p className="text-sm text-text-tertiary text-center">
            Check your inbox and click the link to sign in.
          </p>
        </div>
      )}

      <p className="text-sm text-text-secondary text-center mt-2">
        Back to{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-accent-primary hover:underline cursor-pointer font-semibold"
        >
          Log In
        </button>
      </p>
    </div>
  );
}

/* ============================================================
   Shared Auth Input
   ============================================================ */

function AuthInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return (
    <input
      {...props}
      className={[
        "w-full bg-bg-surface border border-border-default rounded-radius-lg",
        "px-4 py-3 text-body text-text-primary placeholder:text-text-tertiary",
        "outline-none transition-[border-color,box-shadow] duration-[150ms]",
        "focus:border-accent-primary/40 focus:shadow-[0_0_0_2px_rgba(245,197,24,0.15)]",
        props.className ?? "",
      ].join(" ")}
    />
  );
}
