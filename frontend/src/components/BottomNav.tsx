"use client";

import { useState } from "react";
import { Trash2, Phone } from "lucide-react";

type Tab = "kill-list" | "panic-button";

interface BottomNavProps {
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: typeof Trash2 }[] = [
  { id: "kill-list", label: "Kill List", icon: Trash2 },
  { id: "panic-button", label: "Panic Button", icon: Phone },
];

export function BottomNav({ activeTab: controlledTab, onTabChange }: BottomNavProps) {
  const [internalTab, setInternalTab] = useState<Tab>("kill-list");
  const activeTab = controlledTab ?? internalTab;

  const handleTabChange = (tab: Tab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  return (
    <nav
      className="glass fixed bottom-0 left-0 right-0 z-40 h-14 safe-bottom lg:hidden"
      role="tablist"
      aria-label="Main navigation"
    >
      <div className="flex h-14 items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTabChange(tab.id)}
              className={[
                "relative flex flex-1 flex-col items-center justify-center gap-0.5 h-14",
                "cursor-pointer transition-colors",
                "duration-[var(--duration-fast)]",
                isActive ? "text-accent-primary" : "text-text-tertiary",
              ].join(" ")}
            >
              {/* Gold dot indicator */}
              {isActive && (
                <span className="absolute top-1 h-1 w-1 rounded-radius-full bg-accent-primary" />
              )}
              <Icon size={22} strokeWidth={1.5} />
              <span className="text-[10px] font-medium tracking-[0.02em]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
