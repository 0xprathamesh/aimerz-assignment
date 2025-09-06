"use client";

import React from "react";
import { useUiStore } from "@/lib/stores/ui-store";

export default function BackgroundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const bg = useUiStore((s) => s.dashboardBackground);
  const bgClass =
    bg === "slate"
      ? "bg-slate-50 dark:bg-slate-900"
      : bg === "zinc"
      ? "bg-zinc-50 dark:bg-zinc-900"
      : bg === "gradient"
      ? "bg-gradient-to-br from-slate-50 via-white to-zinc-50 dark:from-slate-900 dark:via-zinc-950 dark:to-zinc-900"
      : bg === "dots"
      ? "bg-[radial-gradient(theme(colors.slate.200)_1px,transparent_1px)] dark:bg-[radial-gradient(theme(colors.slate.700)_1px,transparent_1px)] [background-size:16px_16px]"
      : "";

  return <div className={bgClass + " min-h-screen"}>{children}</div>;
}
