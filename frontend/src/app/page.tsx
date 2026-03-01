"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#08090C]">
      <h1 className="font-[family-name:var(--font-bricolage)] text-4xl font-bold text-white">
        Finana
      </h1>
    </div>
  );
}
