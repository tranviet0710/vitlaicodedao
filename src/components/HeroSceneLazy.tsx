"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * three.js is ~550 KB of JavaScript for a decorative background. Loading it
 * statically put it on the critical path of the home page, delaying first paint
 * and interactivity for every visitor. It is fetched here only after the page
 * has gone idle, and skipped entirely for visitors who ask for reduced motion
 * or are on a low-core / data-saving device.
 */
const HeroScene = dynamic(() => import("@/components/HeroScene"), {
  ssr: false,
});

function shouldRenderScene(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
    return false;
  }
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return !connection?.saveData;
}

export default function HeroSceneLazy() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!shouldRenderScene()) return;

    const idle =
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) => window.setTimeout(() => cb({} as IdleDeadline), 400));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;

    const handle = idle(() => setEnabled(true), { timeout: 3000 });
    return () => cancelIdle(handle as number);
  }, []);

  if (!enabled) return null;
  return <HeroScene />;
}
