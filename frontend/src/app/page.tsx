"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, TrendingDown, AlertTriangle, DollarSign, Eye, Ban } from "lucide-react";

import { Button } from "@/components/Button";
import { CallButton } from "@/components/CallButton";
import { GradientText } from "@/components/GradientText";
import { FloatingParticles } from "@/components/FloatingParticles";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fadeIn, scaleIn, safeVariants } from "@/lib/motion";

import { Aurora } from "@/components/ui/Aurora";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ShinyText } from "@/components/ui/ShinyText";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { BlurText } from "@/components/ui/BlurText";
import { StarBorder } from "@/components/ui/StarBorder";
import { CountUp } from "@/components/ui/CountUp";
import { FlipWords } from "@/components/ui/FlipWords";
import { Marquee, MarqueeItem } from "@/components/ui/Marquee";
import { CornerBracketCard } from "@/components/ui/CornerBracketCard";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/components/ui/ScrollReveal";
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect";
import { Lamp } from "@/components/ui/LampEffect";
import { BackgroundBeams } from "@/components/ui/BackgroundBeams";
import { Meteors } from "@/components/ui/Meteors";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Sparkles } from "@/components/ui/Sparkles";

const FLIP_WORDS = ["subscriptions", "dark patterns", "hidden fees", "guilt trips", "auto-renewals"];

const TICKER_ITEMS = [
  { icon: AlertTriangle, text: "HIDDEN FEE DETECTED", color: "text-kill" },
  { icon: DollarSign, text: "$47.82 SAVED", color: "text-success" },
  { icon: Eye, text: "DARK PATTERN BLOCKED", color: "text-accent-primary" },
  { icon: Ban, text: "AUTO-RENEWAL KILLED", color: "text-kill" },
  { icon: DollarSign, text: "$12.99/MO RECOVERED", color: "text-success" },
  { icon: AlertTriangle, text: "GUILT TRIP NEUTRALIZED", color: "text-accent-primary" },
  { icon: Ban, text: "RETENTION FLOW BYPASSED", color: "text-warning" },
  { icon: DollarSign, text: "$299/YR SUBSCRIPTION CANCELLED", color: "text-success" },
];

export default function Home() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return (
    <div className="page-background film-grain safe-all">
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
            HERO SECTION — with Meteors + Sparkles
           ═══════════════════════════════════════════════════════════ */}
        <section className="relative mb-16 flex flex-col items-center text-center pt-8">
          <Meteors count={10} />

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

          <motion.div
            variants={safeVariants(scaleIn, reducedMotion)}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-display mb-4">
              <Sparkles sparkleCount={6} minSize={10} maxSize={20}>
                <ShinyText
                  text="Finana"
                  speed={3}
                  color="#8B95A5"
                  shineColor="#F5C518"
                  className="text-display"
                />
              </Sparkles>
            </h1>
          </motion.div>

          {/* Subtitle with FlipWords */}
          <motion.div
            variants={safeVariants(fadeIn, reducedMotion)}
            initial="hidden"
            animate="visible"
            className="mb-10 max-w-xl"
          >
            <p className="text-body text-text-secondary">
              Your AI agent that protects you from{" "}
              <span className="text-accent-primary font-semibold">
                <FlipWords words={FLIP_WORDS} interval={2400} />
              </span>
            </p>
          </motion.div>

          <motion.div
            variants={safeVariants(scaleIn, reducedMotion)}
            initial="hidden"
            animate="visible"
          >
            <MagneticButton strength={0.3} radius={200}>
              <CallButton />
            </MagneticButton>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            MARQUEE TICKER — Live agent activity feed
           ═══════════════════════════════════════════════════════════ */}
        <div className="mb-20 -mx-4 border-y border-white/[0.04] bg-bg-surface/50 py-3">
          <Marquee duration={40}>
            {TICKER_ITEMS.map((item, i) => (
              <MarqueeItem key={i} className="gap-2">
                <item.icon className={`h-3.5 w-3.5 ${item.color}`} strokeWidth={2} />
                <span className={`text-xs font-bold uppercase tracking-[0.08em] ${item.color}`}>
                  {item.text}
                </span>
                <span className="text-text-tertiary mx-4">&bull;</span>
              </MarqueeItem>
            ))}
          </Marquee>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            STATS — CountUp in spotlight cards with scroll reveal
           ═══════════════════════════════════════════════════════════ */}
        <ScrollRevealGroup className="mb-20 grid grid-cols-2 gap-4 sm:grid-cols-4" stagger={0.12}>
          {[
            { label: "Avg. Wasted / Year", prefix: "$", value: 2400, suffix: "", color: "text-kill" },
            { label: "Dark Patterns Found", prefix: "", value: 847, suffix: "+", color: "text-accent-primary" },
            { label: "Subscriptions Killed", prefix: "", value: 12300, suffix: "+", color: "text-success" },
            { label: "Money Saved", prefix: "$", value: 3200000, suffix: "+", color: "text-accent-soft" },
          ].map((stat) => (
            <ScrollRevealItem key={stat.label}>
              <SpotlightCard className="p-5 text-center">
                <p className={`text-h1 tabular-nums font-bold font-mono ${stat.color}`}>
                  {stat.prefix}
                  <CountUp to={stat.value} separator="," duration={2.5} />
                  {stat.suffix}
                </p>
                <p className="text-xs text-text-tertiary mt-1 uppercase tracking-[0.06em]">{stat.label}</p>
              </SpotlightCard>
            </ScrollRevealItem>
          ))}
        </ScrollRevealGroup>

        {/* ═══════════════════════════════════════════════════════════
            LAMP + FEATURE CARDS — Dramatic section header
           ═══════════════════════════════════════════════════════════ */}
        <section className="mb-20">
          <Lamp>
            <h2 className="text-h2 text-text-primary text-center mb-2">
              <GradientText>How It Works</GradientText>
            </h2>
            <p className="text-body text-text-tertiary text-center">Three steps to financial freedom.</p>
          </Lamp>

          <ScrollRevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-3" stagger={0.15}>
            {[
              {
                icon: Shield,
                title: "Detect",
                desc: "AI scans your subscriptions and identifies dark patterns — hidden fees, forced renewals, guilt trips.",
                num: "01",
              },
              {
                icon: Zap,
                title: "Neutralize",
                desc: "One-tap cancellation agent navigates retention flows, dodges offers, and completes the kill.",
                num: "02",
              },
              {
                icon: TrendingDown,
                title: "Defend",
                desc: "Continuous monitoring alerts you to new charges, price hikes, and sneaky re-enrollments.",
                num: "03",
              },
            ].map((feature) => (
              <ScrollRevealItem key={feature.title}>
                <CornerBracketCard>
                  <div className="flex items-start justify-between mb-4">
                    <feature.icon className="h-8 w-8 text-accent-primary" strokeWidth={1.5} />
                    <span className="text-mono text-text-tertiary text-xs">{feature.num}</span>
                  </div>
                  <h3 className="text-h3 text-text-primary mb-2">{feature.title}</h3>
                  <p className="text-sm text-text-secondary">{feature.desc}</p>
                </CornerBracketCard>
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            AGENT MESSAGE — TextGenerateEffect showcase
           ═══════════════════════════════════════════════════════════ */}
        <ScrollReveal className="mb-20" variant="blur">
          <div className="relative overflow-hidden rounded-radius-lg surface-card p-8 sm:p-12">
            <BackgroundBeams />
            <div className="relative z-10">
              <p className="text-xs text-accent-primary font-mono uppercase tracking-[0.15em] mb-4">
                // Agent Analysis
              </p>
              <TextGenerateEffect
                words="Scanning 14 active subscriptions. 3 dark patterns detected. 2 hidden fees found. Estimated annual savings: $847.00. Ready to neutralize."
                className="text-h2 text-text-primary leading-relaxed max-w-3xl"
                duration={0.4}
                staggerDelay={0.05}
              />
            </div>
          </div>
        </ScrollReveal>

        {/* ═══════════════════════════════════════════════════════════
            BUTTONS — Magnetic + Star borders
           ═══════════════════════════════════════════════════════════ */}
        <section className="mb-20">
          <ScrollReveal>
            <h2 className="text-h2 text-text-primary mb-2">
              <GradientText>Actions</GradientText>
            </h2>
            <p className="text-body text-text-tertiary mb-8">Every button has weight and purpose.</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap gap-4 items-center mb-6">
              <MagneticButton><Button variant="primary">Primary Gold</Button></MagneticButton>
              <MagneticButton><Button variant="kill">Kill It</Button></MagneticButton>
              <MagneticButton><Button variant="secondary">Secondary</Button></MagneticButton>
              <MagneticButton><Button variant="ghost">Ghost</Button></MagneticButton>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="flex flex-wrap gap-4 items-center">
              <MagneticButton strength={0.25}>
                <StarBorder color="#F5C518" speed="5s">
                  <span className="text-sm font-semibold">Star Border CTA</span>
                </StarBorder>
              </MagneticButton>
              <MagneticButton strength={0.25}>
                <StarBorder color="#E84142" speed="4s">
                  <span className="text-sm font-bold uppercase tracking-[0.1em] text-kill">Cancel Now</span>
                </StarBorder>
              </MagneticButton>
              <MagneticButton strength={0.25}>
                <StarBorder color="#34D399" speed="6s">
                  <span className="text-sm font-semibold text-success">Saved!</span>
                </StarBorder>
              </MagneticButton>
            </div>
          </ScrollReveal>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SURFACES — Depth system with beams
           ═══════════════════════════════════════════════════════════ */}
        <section className="mb-20">
          <ScrollReveal>
            <h2 className="text-h2 text-text-primary mb-2">
              <GradientText>Surfaces</GradientText>
            </h2>
            <p className="text-body text-text-tertiary mb-8">Layered depth with interactive spotlight.</p>
          </ScrollReveal>
          <ScrollRevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
            <ScrollRevealItem>
              <SpotlightCard className="p-6">
                <h3 className="text-h3 text-text-primary mb-2">Spotlight</h3>
                <p className="text-sm text-text-secondary">Gold spotlight tracks your cursor on hover.</p>
              </SpotlightCard>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <SpotlightCard className="p-6" spotlightColor="rgba(129, 140, 248, 0.12)">
                <h3 className="text-h3 text-text-primary mb-2">Info</h3>
                <p className="text-sm text-text-secondary">Custom spotlight colors for different contexts.</p>
              </SpotlightCard>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <div className="glass-premium rounded-radius-lg p-6">
                <h3 className="text-h3 text-text-primary mb-2">Premium Glass</h3>
                <p className="text-sm text-text-secondary">Enhanced frosted glass with inset highlight edge.</p>
              </div>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <CornerBracketCard className="tech-grid">
                <h3 className="text-h3 text-text-primary mb-2">HUD Frame</h3>
                <p className="text-sm text-text-secondary">Corner brackets with tech grid texture.</p>
              </CornerBracketCard>
            </ScrollRevealItem>
          </ScrollRevealGroup>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            TYPOGRAPHY
           ═══════════════════════════════════════════════════════════ */}
        <section className="mb-20">
          <ScrollReveal>
            <h2 className="text-h2 text-text-primary mb-2">
              <GradientText>Typography</GradientText>
            </h2>
            <p className="text-body text-text-tertiary mb-8">Every word makes an entrance.</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1} variant="scale">
            <SpotlightCard className="p-8">
              <div className="space-y-6">
                <p className="text-display">
                  <ShinyText text="Display — 56px" speed={4} color="#EAECF0" shineColor="#F5C518" className="text-display" />
                </p>
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
                  <span className="text-h1 tabular-nums text-accent-primary font-mono">
                    $<CountUp to={12345.67} from={0} separator="," duration={3} />
                  </span>
                </div>
              </div>
            </SpotlightCard>
          </ScrollReveal>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            TEXT EFFECTS — FlipWords + Decrypted + TextGenerate
           ═══════════════════════════════════════════════════════════ */}
        <section className="mb-20">
          <ScrollReveal>
            <h2 className="text-h2 text-text-primary mb-2">
              <GradientText>Text Effects</GradientText>
            </h2>
            <p className="text-body text-text-tertiary mb-8">Interactive text that feels alive.</p>
          </ScrollReveal>
          <ScrollRevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2" stagger={0.12}>
            <ScrollRevealItem>
              <SpotlightCard className="p-6">
                <p className="text-xs text-text-tertiary uppercase tracking-[0.1em] mb-3">Flip Words</p>
                <p className="text-h2 text-text-primary font-semibold">
                  Protecting you from{" "}
                  <span className="text-accent-primary">
                    <FlipWords words={["fraud", "dark patterns", "hidden fees", "guilt trips"]} interval={2200} />
                  </span>
                </p>
              </SpotlightCard>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <SpotlightCard className="p-6">
                <p className="text-xs text-text-tertiary uppercase tracking-[0.1em] mb-3">Text Generate</p>
                <TextGenerateEffect
                  words="Agent deployed. Scanning for threats..."
                  className="text-h2 text-accent-primary font-semibold"
                  duration={0.4}
                  staggerDelay={0.08}
                />
              </SpotlightCard>
            </ScrollRevealItem>
            <ScrollRevealItem>
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
            </ScrollRevealItem>
            <ScrollRevealItem>
              <SpotlightCard className="p-6">
                <p className="text-xs text-text-tertiary uppercase tracking-[0.1em] mb-3">Shiny + Gradient</p>
                <ShinyText
                  text="Your money. Your rules."
                  speed={2}
                  color="#5A6478"
                  shineColor="#FFD966"
                  className="text-h2 font-semibold"
                />
              </SpotlightCard>
            </ScrollRevealItem>
          </ScrollRevealGroup>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SEMANTIC COLORS + GLOW SYSTEM
           ═══════════════════════════════════════════════════════════ */}
        <section className="mb-20">
          <ScrollReveal>
            <h2 className="text-h2 text-text-primary mb-2">
              <GradientText>Status & Glow</GradientText>
            </h2>
            <p className="text-body text-text-tertiary mb-8">Semantic indicators with animated luminance.</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap gap-4 mb-8">
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
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="flex flex-wrap gap-6">
              <div className="glow-gold surface-card rounded-radius-lg p-6">
                <p className="text-sm text-text-primary">Resting</p>
              </div>
              <div className="glow-pulse surface-card rounded-radius-lg p-6">
                <p className="text-sm text-text-primary">Scanning</p>
              </div>
              <div className="glow-pulse-kill surface-card rounded-radius-lg p-6">
                <p className="text-sm text-text-primary">Alert</p>
              </div>
              <div className="glow-gold-focus surface-card rounded-radius-lg p-6">
                <p className="text-sm text-text-primary">Focus</p>
              </div>
            </div>
          </ScrollReveal>
        </section>

      </div>
    </div>
  );
}
