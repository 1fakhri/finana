"use client";

import { useEffect } from "react";
import { Button } from "@/components/Button";

export default function Home() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return (
    <div className="page-background safe-all">
      <div className="relative z-10 mx-auto max-w-[1320px] px-4 py-12">
        {/* Hero */}
        <div className="stagger-in mb-12 text-center">
          <h1 className="text-display text-accent-primary mb-2">Finana</h1>
          <p className="text-body text-text-secondary">
            The Toxic Financial Defense Agent
          </p>
        </div>

        {/* Button Variants */}
        <section className="stagger-in mb-12">
          <h2 className="text-h2 text-text-primary mb-6">Buttons</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary">Primary Gold</Button>
            <Button variant="kill">Kill It</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </section>

        {/* Surface & Depth */}
        <section className="stagger-in mb-12">
          <h2 className="text-h2 text-text-primary mb-6">Surfaces</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="surface-card rounded-radius-lg p-6">
              <h3 className="text-h3 text-text-primary mb-2">Surface Card</h3>
              <p className="text-body text-text-secondary">Level 2 elevation</p>
            </div>
            <div className="surface-elevated rounded-radius-lg p-6">
              <h3 className="text-h3 text-text-primary mb-2">Elevated</h3>
              <p className="text-body text-text-secondary">Level 3 elevation</p>
            </div>
            <div className="surface-float rounded-radius-lg p-6">
              <h3 className="text-h3 text-text-primary mb-2">Float</h3>
              <p className="text-body text-text-secondary">Level 4 elevation</p>
            </div>
            <div className="glass rounded-radius-lg p-6">
              <h3 className="text-h3 text-text-primary mb-2">Glass</h3>
              <p className="text-body text-text-secondary">Backdrop blur overlay</p>
            </div>
          </div>
        </section>

        {/* Typography Scale */}
        <section className="stagger-in mb-12">
          <h2 className="text-h2 text-text-primary mb-6">Typography</h2>
          <div className="surface-card rounded-radius-lg p-6 space-y-4">
            <p className="text-display text-text-primary">Display — 56px</p>
            <p className="text-h1 text-text-primary">Heading 1 — 36px</p>
            <p className="text-h2 text-text-primary">Heading 2 — 24px</p>
            <p className="text-h3 text-text-primary">Heading 3 — 18px</p>
            <p className="text-body text-text-primary">Body — 15px</p>
            <p className="text-sm text-text-secondary">Small — 13px</p>
            <p className="text-xs text-text-tertiary">Extra Small — 11px</p>
            <p className="text-mono text-text-secondary">Mono — 12px — $1,234.56</p>
            <p className="text-body tabular-nums text-accent-primary">$12,345.67 (tabular-nums)</p>
          </div>
        </section>

        {/* Semantic Colors */}
        <section className="stagger-in mb-12">
          <h2 className="text-h2 text-text-primary mb-6">Semantic Colors</h2>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-radius-sm bg-kill-bg px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em] text-kill">Kill</span>
            <span className="rounded-radius-sm bg-success-bg px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em] text-success">Success</span>
            <span className="rounded-radius-sm bg-warning-bg px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em] text-warning">Warning</span>
            <span className="rounded-radius-sm bg-error-bg px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em] text-error">Error</span>
            <span className="rounded-radius-sm bg-info-bg px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em] text-info">Info</span>
          </div>
        </section>

        {/* Glow Effects */}
        <section className="stagger-in mb-12">
          <h2 className="text-h2 text-text-primary mb-6">Glow Effects</h2>
          <div className="flex flex-wrap gap-6">
            <div className="glow-gold surface-card rounded-radius-lg p-6">
              <p className="text-sm text-text-primary">Resting Glow</p>
            </div>
            <div className="glow-gold-hover surface-card rounded-radius-lg p-6">
              <p className="text-sm text-text-primary">Hover Glow</p>
            </div>
            <div className="glow-gold-focus surface-card rounded-radius-lg p-6">
              <p className="text-sm text-text-primary">Focus Glow</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
