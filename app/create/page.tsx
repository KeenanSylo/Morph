import React, { useState } from "react";
import BlobCanvas from "../../components/canvas/BlobCanvas";
import ControlDeck from "../../components/ControlDeck";
import ActionBar from "../../components/ActionBar";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { useMorphStore } from "../../store/useMorphStore";
import { cn } from "../../lib/utils";

export default function CreatePage() {
  const [isExporting, setIsExporting] = useState(false);
  const { darkMode } = useMorphStore();

  const handleDownload = () => {
    setIsExporting(true);

    // Wait for state update and UI to disappear
    setTimeout(async () => {
      const node = document.getElementById("morph-capture-area");
      if (node) {
        try {
          const dataUrl = await toPng(node, { 
            backgroundColor: darkMode ? "#020617" : "#f8fafc", // slate-950 or slate-50
            pixelRatio: 2 // High resolution export
          });
          download(dataUrl, "morph-design.png");
        } catch (error) {
          console.error("Oops, something went wrong!", error);
        } finally {
          setIsExporting(false);
        }
      } else {
        setIsExporting(false);
      }
    }, 100);
  };

  return (
    <main 
      id="morph-capture-area" 
      className={cn(
        "relative h-screen w-full overflow-hidden transition-colors duration-500 ease-in-out selection:bg-blue-500/20",
        darkMode ? "bg-slate-950" : "bg-slate-50"
      )}
    >
      {/* Layer 1: The Main Juice Blob */}
      <BlobCanvas interactive={true} />

      {/* Layer 2: UI Controls (Hidden during export) */}
      {!isExporting && (
        <>
          <ActionBar onDownload={handleDownload} />
          <ControlDeck />
        </>
      )}
    </main>
  );
}