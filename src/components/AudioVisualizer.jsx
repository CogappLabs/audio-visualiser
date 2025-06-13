import { useEffect, useRef } from "react";
import p5 from "p5";
import { useLocation } from "react-router-dom";

// Import modes
import sketchMode from "./modes/sketch";
import sereneMode from "./modes/serene";

// Make p5 available globally
window.p5 = p5;

const MODES = {
  sketch: sketchMode,
  serene: sereneMode,
  // Add more modes here as they are created
};

const AudioVisualizer = () => {
  const sketchRef = useRef(null);
  const p5Instance = useRef(null);
  const location = useLocation();
  const { audioPath, mode } = location.state || {};

  useEffect(() => {
    let isActive = true; // Flag to track if component is mounted

    const initializeVisualizer = async () => {
      if (!audioPath || !mode || !isActive) return;

      try {
        // Dynamically import p5.sound
        await import("p5/lib/addons/p5.sound.js");

        const selectedMode = MODES[mode];
        if (!selectedMode) {
          console.error(`Mode ${mode} not found`);
          return;
        }

        // Only create new instance if we don't have one or if it was removed
        if (!p5Instance.current || !p5Instance.current.canvas) {
          // Clean up any existing instance
          if (p5Instance.current) {
            p5Instance.current.remove();
          }

          // Create new instance
          p5Instance.current = new p5(selectedMode, sketchRef.current);
          await p5Instance.current.setAudio(audioPath);
        }
      } catch (error) {
        console.error("Error initializing visualizer:", error);
      }
    };

    initializeVisualizer();

    // Cleanup function
    return () => {
      isActive = false; // Prevent any async operations from continuing
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, [audioPath, mode]);

  if (!audioPath || !mode) {
    return (
      <div>No audio file or mode selected. Please go back and select both.</div>
    );
  }

  return (
    <div>
      <div ref={sketchRef}></div>
      <div className="controls">
        <button id="playButton">Play</button>
        <button id="stopButton" style={{ display: "none" }}>
          Stop
        </button>
      </div>
    </div>
  );
};

export default AudioVisualizer;
