"use client";

export default function OfflinePage() {
  return (
    <div className="page-background safe-all">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 text-6xl">🍌</div>
        <h1 className="text-h1 text-text-primary mb-3">
          Bestie, you&apos;re offline
        </h1>
        <p className="text-body text-text-secondary max-w-sm mb-8">
          Even your toxic financial bestie needs a signal. Reconnect and
          we&apos;ll get back to roasting your subscriptions.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center gap-2 rounded-radius-md bg-gradient-to-br from-accent-primary to-accent-warm px-7 py-3 text-sm font-semibold text-bg-void tracking-[0.02em] transition-all duration-[200ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-px active:translate-y-0 active:scale-[0.98] cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
