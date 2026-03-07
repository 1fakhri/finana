"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const PUBLIC_ROUTES = ["/auth", "/offline"];

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  useEffect(() => {
    if (loading) return;

    if (!user && !isPublicRoute) {
      router.replace("/auth");
      return;
    }

    if (user && pathname === "/auth") {
      // TODO: Check onboarding_completed from user_preferences
      // For now, redirect to dashboard (home)
      router.replace("/");
      return;
    }
  }, [user, loading, pathname, isPublicRoute, router]);

  // Show loading spinner while checking session state
  if (loading) {
    return (
      <div className="page-background flex items-center justify-center min-h-dvh">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-2 border-accent-primary border-t-transparent animate-spin"
          />
          <span className="text-sm text-text-secondary">Loading...</span>
        </div>
      </div>
    );
  }

  // Block rendering protected content if not authenticated
  if (!user && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}
