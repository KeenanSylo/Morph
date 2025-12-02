import React from "react";
import "./globals.css";

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
    <div className="min-h-screen bg-neutral-900 text-white antialiased">
      {children}
    </div>
  );
}
