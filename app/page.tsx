import React from "react";
import BlobCanvas from "../components/canvas/BlobCanvas";
import ControlDeck from "../components/ControlDeck";
import ActionBar from "../components/ActionBar";

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-slate-950 selection:bg-white/20">
      {/* Background Layer: Generative Canvas */}
      <BlobCanvas />

      {/* UI Layer: Floating Controls */}
      <ActionBar />
      <ControlDeck />
    </main>
  );
}