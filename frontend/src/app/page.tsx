"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, Shield, Zap, TrendingDown } from "lucide-react";

import { Button } from "@/components/Button";
import { CallButton } from "@/components/CallButton";
import { GradientText } from "@/components/GradientText";
import { StaggerContainer, StaggerItem } from "@/components/StaggerContainer";
import { FloatingParticles } from "@/components/FloatingParticles";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fadeIn, scaleIn, safeVariants } from "@/lib/motion";

// React Bits components
import { Aurora } from "@/components/ui/Aurora";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ShinyText } from "@/components/ui/ShinyText";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { BlurText } from "@/components/ui/BlurText";
import { StarBorder } from "@/components/ui/StarBorder";
import { CountUp } from "@/components/ui/CountUp";

export default function Home() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return (
    <div className="page-background safe-all">
      {/* Aurora WebGL Background */}
      <div className="aurora-container">
        <Aurora
          colorStops={["#F5C518", "#0C0F14", "#E8A317"]}
          amplitude={1.2}
          blend={0.6}
          speed={0.8}
        />
      </div>

      <FloatingParticles count={22} className="!fixed" />

      <div className="relative z-10 mx-auto max-w-[1320px] px-4 py-12 pb-24 lg:pb-12">

        {/* ═══════════════════════════════════════════════════════════
            HERO SECTION — Cinematic entrance
           ═══════════════════════════════════════════════════════════ */}
        <section className="relative mb-24 flex flex-col items-center text-center pt-8">
          {/* Overline */}
          <motion.div
            variants={safeVariants(fadeIn, reducedMotion)}
            initial="hidden"
            animate="visible"
            className="mb-4"
          >
            <DecryptedText
              text="THE TOXIC FINANCIAL DEFENSE AGENT"
              speed={40}
              sequential
              animateOn="view"
              className="text-accent-primary"
              encryptedClassName="text-text-tertiary"
              parentClassName="text-xs font-bold tracking-[0.2em]"
            />
          </motion.div>

          {/* Hero Title */}
          <motion.div
            variants={safeVariants(scaleIn, reducedMotion)}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-display mb-4">
              <ShinyText
                text="Finana"
                speed={3}
                color="#8B95A5"
                shineColor="#F5C518"
                className="text-display"
              />
            </h1>
          </motion.div>

          {/* Subtitle with blur entrance */}
          <div className="mb-10 max-w-lg">
            <BlurText
              text="Your AI agent that fights toxic subscription patterns, cancels what you forgot, and guards your money with attitude."
              delay={30}
              animateBy="words"
              direction="bottom"
              className="text-body text-text-secondary justify-center"
            />
          </div>

          {/* CTA — Golden Orb */}
          <motion.div
            variants={safeVariants(scaleIn, reducedMotion)}
            initial="hidden"
            animate="visible"
          >
            <CallButton />
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            STATS SECTION — Animated financial numbers
           ═══════════════════════════════════════════════════════════ */}
        <StaggerContainer className="mb-20">
          <StaggerItem>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Avg. Wasted / Year", prefix: "$", value: 2400, suffix: "", color: "text-kill" },
                { label: "Dark Patterns Found", prefix: "", value: 847, suffix: "+", color: "text-accent-primary" },
                { label: "Subscriptions Killed", prefix: "", value: 12300, suffix: "+", color: "text-success" },
                { label: "Money Saved", prefix: "$", value: 3200000, suffix: "+", color: "text-accent-soft" },
              ].map((stat) => (
                <SpotlightCard key={stat.label} className="p-5 text-center">
                  <p className={`text-h1 tabular-nums font-bold ${stat.color}`}>
                    {stat.prefix}
                    <CountUp to={stat.value} separator="," duration={2.5} />
                    {stat.suffix}
                  </p>
                  <p className="text-xs text-text-tertiary mt-1 uppercase tracking-[0.06em]">{stat.label}</p>
                </SpotlightCard>
              ))}
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* ═══════════════════════════════════════════════════════════
            FEATURE CARDS — Spotlight cards with icons
           ═══════════════════════════════════════════════════════════ */}
        <StaggerContainer className="mb-20">
          <StaggerItem>
            <h2 className="text-h2 text-text-primary mb-2">
              <GradientText>How It Works</GradientText>
            </h2>
            <p className="text-body text-text-tertiary mb-8">Three steps to financial freedom.</p>
          </StaggerItem>
          <StaggerItem>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {[
                {
                  icon: Shield,
                  title: "Detect",
                  desc: "AI scans your subscriptions and identifies dark patterns — hidden fees, forced renewals, guilt trips.",
                  glow: "rgba(245, 197, 24, 0.15)",
                },
                {
                  icon: Zap,
                  title: "Neutralize",
                  desc: "One-tap cancellation agent navigates retention flows, dodges offers, and completes the kill.",
                  glow: "rgba(232, 65, 66, 0.15)",
                },
                {
                  icon: TrendingDown,
                  title: "Defend",
                  desc: "Continuous monitoring alerts you to new charges, price hikes, and sneaky re-enrollments.",
                  glow: "rgba(52, 211, 153, 0.15)",
                },
              ].map((feature) => (
                <SpotlightCard key={feature.title} className="p-6" spotlightColor={feature.glow}>
                  <feature.icon className="h-8 w-8 text-accent-primary mb-4" strokeWidth={1.5} />
                  <h3 className="text-h3 text-text-primary mb-2">{feature.title}</h3>
                  <p className="text-sm text-text-secondary">{feature.desc}</p>
                </SpotlightCard>
              ))}
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* ═══════════════════════════════════════════════════════════
            BUTTONS — Star borders + shimmer showcase
           ═══════════════════════════════════════════════════════════ */}
        <StaggerContainer className="mb-20">
          <StaggerItem>
            <h2 className="text-h2 text-text-primary mb-2">
              <GradientText>Actions</GradientText>
            </h2>
            <p className="text-body text-text-tertiary mb-8">Every button has weight and purpose.</p>
          </StaggerItem>
          <StaggerItem>
            <div className="flex flex-wrap gap-4 items-center mb-6">
              <Button variant="primary">Primary Gold</Button>
              <Button variant="kill">Kill It</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="flex flex-wrap gap-4 items-center">
              <StarBorder color="#F5C518" speed="5s">
                <span className="text-sm font-semibold">Star Border CTA</span>
              </StarBorder>
              <StarBorder color="#E84142" speed="4s">
                <span className="text-sm font-bold uppercase tracking-[0.1em] text-kill">Cancel Now</span>
              </StarBorder>
              <StarBorder color="#34D399" speed="6s">
                <span className="text-sm font-semibold text-success">Saved!</span>
              </StarBorder>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* ═══════════════════════════════════════════════════════════
            SURFACES — Depth system with spotlight interaction
           ═══════════════════════════════════════════════════════════ */}
        <StaggerContainer className="mb-20">
          <StaggerItem>
            <h2 className="text-h2 text-text-primary mb-2">
              <GradientText>Surfaces</GradientText>
            </h2>
            <p className="text-body text-text-tertiary mb-8">Layered depth with interactive spotlight.</p>
          </StaggerItem>
          <StaggerItem>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SpotlightCard className="p-6">
                <h3 className="text-h3 text-text-primary mb-2">Card</h3>
                <p className="text-sm text-text-secondary">Hover to reveal the gold spotlight tracking your cursor.</p>
              </SpotlightCard>
              <SpotlightCard className="p-6" spotlightColor="rgba(129, 140, 248, 0.12)">
                <h3 className="text-h3 text-text-primary mb-2">Info</h3>
                <p className="text-sm text-text-secondary">Custom spotlight colors for different contexts.</p>
              </SpotlightCard>
              <SpotlightCard className="p-6" spotlightColor="rgba(232, 65, 66, 0.12)">
                <h3 className="text-h3 text-text-primary mb-2">Danger</h3>
                <p className="text-sm text-text-secondary">Red spotlight for destructive or warning contexts.</p>
              </SpotlightCard>
              <div className="glass rounded-radius-lg p-6">
                <h3 className="text-h3 text-text-primary mb-2">Glass</h3>
                <p className="text-sm text-text-secondary">Frosted backdrop blur overlay surface.</p>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* ═══════════════════════════════════════════════════════════
            TYPOGRAPHY — Blur text entrances + gradient headings
           ═══════════════════════════════════════════════════════════ */}
        <StaggerContainer className="mb-20">
          <StaggerItem>
            <h2 className="text-h2 text-text-primary mb-2">
              <GradientText>Typography</GradientText>
            </h2>
            <p className="text-body text-text-tertiary mb-8">Every word makes an entrance.</p>
          </StaggerItem>
          <StaggerItem>
            <SpotlightCard className="p-8">
              <div className="space-y-6">
                <div>
                  <p className="text-display">
                    <ShinyText text="Display — 56px" speed={4} color="#EAECF0" shineColor="#F5C518" className="text-display" />
                  </p>
                </div>
                <BlurText text="Heading 1 — Blur entrance" delay={60} className="text-h1 text-text-primary" />
                <p className="text-h2 text-text-primary">
                  <GradientText>Heading 2 — Gradient</GradientText>
                </p>
                <p className="text-h3 text-text-primary">Heading 3 — 18px</p>
                <p className="text-body text-text-primary">Body — 15px — The quick brown fox jumps over the lazy dog.</p>
                <p className="text-sm text-text-secondary">Small — 13px — Secondary information and metadata.</p>
                <p className="text-xs text-text-tertiary">Extra Small — 11px — Fine print and labels.</p>
                <p className="text-mono text-text-secondary">Mono — 12px — $1,234.56</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-text-tertiary uppercase tracking-[0.1em]">Savings:</span>
                  <span className="text-h1 tabular-nums text-accent-primary">
                    $<CountUp to={12345.67} from={0} separator="," duration={3} />
                  </span>
                </div>
              </div>
            </SpotlightCard>
          </StaggerItem>
        </StaggerContainer>

        {/* ═══════════════════════════════════════════════════════════
            TEXT EFFECTS — Decrypted + Shiny demonstrations
           ═══════════════════════════════════════════════════════════ */}
        <StaggerContainer className="mb-20">
          <StaggerItem>
            <h2 className="text-h2 text-text-primary mb-2">
              <GradientText>Text Effects</GradientText>
            </h2>
            <p className="text-body text-text-tertiary mb-8">Interactive text that feels alive.</p>
          </StaggerItem>
          <StaggerItem>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <SpotlightCard className="p-6">
                <p className="text-xs text-text-tertiary uppercase tracking-[0.1em] mb-3">Decrypted Text (hover)</p>
                <DecryptedText
                  text="3 dark patterns detected"
                  speed={50}
                  className="text-h2 text-kill font-semibold"
                  encryptedClassName="text-h2 text-text-tertiary font-semibold"
                  parentClassName="cursor-pointer"
                  animateOn="hover"
                  sequential
                  revealDirection="start"
                />
              </SpotlightCard>
              <SpotlightCard className="p-6">
                <p className="text-xs text-text-tertiary uppercase tracking-[0.1em] mb-3">Decrypted Text (on view)</p>
                <DecryptedText
                  text="$2,400 wasted annually"
                  speed={60}
                  className="text-h2 text-accent-primary font-semibold"
                  encryptedClassName="text-h2 text-text-tertiary font-semibold"
                  animateOn="view"
                  sequential
                  revealDirection="center"
                />
              </SpotlightCard>
              <SpotlightCard className="p-6">
                <p className="text-xs text-text-tertiary uppercase tracking-[0.1em] mb-3">Shiny Text</p>
                <ShinyText
                  text="Your money. Your rules."
                  speed={2}
                  color="#5A6478"
                  shineColor="#FFD966"
                  className="text-h2 font-semibold"
                />
              </SpotlightCard>
              <SpotlightCard className="p-6">
                <p className="text-xs text-text-tertiary uppercase tracking-[0.1em] mb-3">Gradient Text</p>
                <p className="text-h2 font-semibold">
                  <GradientText>Financial defense, automated.</GradientText>
                </p>
              </SpotlightCard>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* ═══════════════════════════════════════════════════════════
            SEMANTIC COLORS — Pulse dots with context
           ═══════════════════════════════════════════════════════════ */}
        <StaggerContainer className="mb-20">
          <StaggerItem>
            <h2 className="text-h2 text-text-primary mb-2">
              <GradientText>Semantic Colors</GradientText>
            </h2>
            <p className="text-body text-text-tertiary mb-8">Status indicators with pulsing life.</p>
          </StaggerItem>
          <StaggerItem>
            <div className="flex flex-wrap gap-4">
              {[
                { name: "Kill", bg: "bg-kill-bg", text: "text-kill", dot: "bg-kill text-kill" },
                { name: "Success", bg: "bg-success-bg", text: "text-success", dot: "bg-success text-success" },
                { name: "Warning", bg: "bg-warning-bg", text: "text-warning", dot: "bg-warning text-warning" },
                { name: "Error", bg: "bg-error-bg", text: "text-error", dot: "bg-error text-error" },
                { name: "Info", bg: "bg-info-bg", text: "text-info", dot: "bg-info text-info" },
              ].map((color) => (
                <div key={color.name} className={`flex items-center gap-2 rounded-radius-sm ${color.bg} px-4 py-2`}>
                  <span className={`pulse-dot ${color.dot}`} />
                  <span className={`text-xs font-semibold uppercase tracking-[0.06em] ${color.text}`}>{color.name}</span>
                </div>
              ))}
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* ═══════════════════════════════════════════════════════════
            GLOW EFFECTS
           ═══════════════════════════════════════════════════════════ */}
        <StaggerContainer className="mb-16">
          <StaggerItem>
            <h2 className="text-h2 text-text-primary mb-2">
              <GradientText>Glow System</GradientText>
            </h2>
            <p className="text-body text-text-tertiary mb-8">Layered gold luminance.</p>
          </StaggerItem>
          <StaggerItem>
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
          </StaggerItem>
        </StaggerContainer>

      </div>
    </div>
  );
}
