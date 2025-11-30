import React from "react";
import "./globals.css";
import { cn } from "../lib/utils";

export const metadata = {
  title: "Morph",
  description: "Vector-First, Motion-Ready Design Studio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cn("min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-[#0a0a0a] to-black text-white antialiased font-sans selection:bg-orange-500/30")}>
      {children}
    </div>
  );
}