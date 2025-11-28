import React from "react";
import { cn } from "../../lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-2xl",
      className
    )}>
      {children}
    </div>
  );
};