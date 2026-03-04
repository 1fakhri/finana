"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show after 2nd visit
    const visits = Number(localStorage.getItem("finana-visits") || "0") + 1;
    localStorage.setItem("finana-visits", String(visits));
    if (visits < 2) return;

    // Don't show if already dismissed
    if (localStorage.getItem("finana-install-dismissed")) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!show || !deferredPrompt) return null;

  const handleInstall = async () => {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("finana-install-dismissed", "1");
  };

  return (
    <div className="glass fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-sm rounded-radius-lg p-4 safe-bottom">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm text-text-primary font-semibold mb-1">
            Install Finana
          </p>
          <p className="text-xs text-text-secondary">
            Add to your home screen for the full experience.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <Button variant="primary" size="sm" onClick={handleInstall}>
          Install
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDismiss}>
          Not now
        </Button>
      </div>
    </div>
  );
}
