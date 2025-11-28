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
    <div className={cn("min-h-screen bg-slate-950 text-white antialiased font-sans selection:bg-white/20")}>
      {children}
    </div>
  );
}
