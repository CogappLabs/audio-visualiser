import { useEffect, useRef, useState } from "react";
import p5 from "p5";
import { useLocation } from "react-router-dom";

// Import modes
import sketchMode from "./modes/sketch";
import sereneMode from "./modes/serene";
import zenMode from "./modes/zen";

// Make p5 available globally
window.p5 = p5;

const MODES = {
  sketch: sketchMode,
  serene: sereneMode,
  zen: zenMode,
  // Add more modes here as they are created
};

const AudioVisualizer = () => {
  const sketchRef = useRef(null);
  const p5Instance = useRef(null);
  const location = useLocation();
  const { audioPath, mode } = location.state || {};

  const [sound, setSound] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const setupControls = () => {
    console.log("Setting up controls...");
    const playButton = document.getElementById("playButton");
    const stopButton = document.getElementById("stopButton");

    if (!playButton || !stopButton) {
      console.error("Control buttons not found in DOM");
      return;
    }

    playButton.addEventListener("click", () => {
      console.log("Play button clicked, sound state:", sound);
      if (sound && !sound.isPlaying()) {
        try {
          console.log("Attempting to play sound...");
          sound.play();
          console.log("Sound play called successfully");
          setIsPlaying(true);
          playButton.style.display = "none";
          stopButton.style.display = "block";
        } catch (error) {
          console.error("Error playing sound:", error);
        }
      }
    });

    stopButton.addEventListener("click", () => {
      console.log("Stop button clicked");
      if (sound && sound.isPlaying()) {
        try {
          sound.stop();
          setIsPlaying(false);
          stopButton.style.display = "none";
          playButton.style.display = "block";
        } catch (error) {
          console.error("Error stopping sound:", error);
        }
      }
    });
  };

  // Set up controls after component is rendered
  useEffect(() => {
    console.log("Controls effect triggered", { isLoading, sound: !!sound });
    if (!isLoading) {
      setupControls();
    }
  }, [isLoading, sound]);

  useEffect(() => {
    let isActive = true; // Flag to track if component is mounted

    const initializeVisualizer = async () => {
      console.log("Initializing visualizer...", { audioPath, mode });
      if (!audioPath || !mode || !isActive) {
        console.log("Missing required props:", { audioPath, mode });
        return;
      }

      try {
        setIsLoading(true);
        console.log("Importing p5.sound...");
        // Dynamically import p5.sound
        await import("p5/lib/addons/p5.sound.js");
        console.log("p5.sound imported successfully");

        const selectedMode = MODES[mode];
        if (!selectedMode) {
          console.error(`Mode ${mode} not found`);
          return;
        }

        // Only create new instance if we don't have one or if it was removed
        if (!p5Instance.current || !p5Instance.current.canvas) {
          console.log("Creating new p5 instance...");
          // Clean up any existing instance
          if (p5Instance.current) {
            p5Instance.current.remove();
          }

          // Create new instance
          p5Instance.current = new p5(selectedMode, sketchRef.current);
          console.log("Loading audio...");
          const loadedSound = await p5Instance.current.setAudio(audioPath);
          console.log("Audio loaded:", !!loadedSound);

          if (loadedSound) {
            console.log("Setting sound state...");
            setSound(loadedSound);

            // Wait for the sound to be fully loaded before playing
            const checkSoundLoaded = () => {
              if (loadedSound.isLoaded()) {
                console.log("Sound is fully loaded, starting playback...");
                try {
                  loadedSound.play();
                  setIsPlaying(true);
                  // Hide play button, show stop button
                  const playButton = document.getElementById("playButton");
                  const stopButton = document.getElementById("stopButton");
                  if (playButton && stopButton) {
                    playButton.style.display = "none";
                    stopButton.style.display = "block";
                  }
                } catch (error) {
                  console.error("Error playing sound:", error);
                }
              } else {
                console.log("Sound still loading, waiting...");
                setTimeout(checkSoundLoaded, 100);
              }
            };

            checkSoundLoaded();
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing visualizer:", error);
        setIsLoading(false);
      }
    };

    initializeVisualizer();

    // Cleanup function
    return () => {
      console.log("Cleaning up...");
      isActive = false; // Prevent any async operations from continuing
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
      if (sound) {
        sound.stop();
      }
    };
  }, [audioPath, mode]);

  if (!audioPath || !mode) {
    console.log("Missing props:", { audioPath, mode });
    return (
      <div>No audio file or mode selected. Please go back and select both.</div>
    );
  }

  if (isLoading) {
    return <div>Loading audio...</div>;
  }

  return (
    <div>
      <div ref={sketchRef}></div>
      <div className="controls">
        <button
          id="playButton"
          style={{ display: isPlaying ? "none" : "block" }}
        >
          Play
        </button>
        <button
          id="stopButton"
          style={{ display: isPlaying ? "block" : "none" }}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default AudioVisualizer;
