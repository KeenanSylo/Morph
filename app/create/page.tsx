import React from "react";
import BlobCanvas from "../../components/canvas/BlobCanvas";
import ControlDeck from "../../components/ControlDeck";
import ActionBar from "../../components/ActionBar";
import FluidShader from "../../components/canvas/FluidShader";

export default function CreatePage() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-slate-950 selection:bg-white/20">
      {/* Layer 0: Fluid Background */}
      <FluidShader />

      {/* Layer 1: Glass Blob (Interactive) */}
      <BlobCanvas interactive={true} />

      {/* Layer 2: UI Controls */}
      <ActionBar />
      <ControlDeck />
    </main>
  );
}