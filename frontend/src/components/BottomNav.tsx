"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Trash2, Phone, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Hide nav on auth and offline pages, or when not logged in
  if (!user || pathname === "/auth" || pathname === "/offline") {
    return null;
  }

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

        {/* Logout button */}
        <button
          onClick={signOut}
          className={[
            "flex flex-col items-center justify-center gap-0.5 px-4 h-14",
            "cursor-pointer transition-colors duration-[var(--duration-fast)]",
            "text-text-tertiary hover:text-kill",
          ].join(" ")}
          aria-label="Log out"
        >
          <LogOut size={20} strokeWidth={1.5} />
          <span className="text-[10px] font-medium tracking-[0.02em]">
            Log Out
          </span>
        </button>
      </div>
    </nav>
  );
}
