import { useEffect, useRef, useState } from "react";
import p5 from "p5";
import { useLocation } from "react-router-dom";
import TextOverlay from "./TextOverlay";
import CaptionOverlay from "./CaptionOverlay";
import { useNavigate } from "react-router-dom";

// Import modes
import sketchMode from "./modes/sketch";
import sereneMode from "./modes/serene";
import circleVizMode from "./modes/circle_viz";
import zenMode from "./modes/zen";
import cursorSpecialMode from "./modes/cursor-special";

// Make p5 available globally
window.p5 = p5;

const MODES = {
  sketch: sketchMode,
  serene: sereneMode,
  circle: circleVizMode,
  zen: zenMode,
  "cursor-special": cursorSpecialMode,
  // Add more modes here as they are created
};

const AudioVisualizer = () => {
  const sketchRef = useRef(null);
  const p5Instance = useRef(null);
  const playBtnRef = useRef(null);
  const stopBtnRef = useRef(null);
  const controlsRef = useRef(null);
  const location = useLocation();
  const { audioFile, mode } = location.state || {};
  const [sound, setSound] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [fragmentPath, setFragmentPath] = useState("");
  const [showCaptionsOverlay, setShowCaptionsOverlay] = useState(false);
  const [captionPath, setCaptionPath] = useState("");
  const [controlsVisible, setControlsVisible] = useState(true);
  const navigate = useNavigate();

  // Auto-hide controls functionality after (5s of) inactivity
  useEffect(() => {
    if (isLoading) return;

    let hideTimeout;
    let fadeTimeout;

    const showControls = () => {
      setControlsVisible(true);
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
      if (fadeTimeout) {
        clearTimeout(fadeTimeout);
      }
    };

    const hideControls = () => {
      setControlsVisible(false);
    };

    const startHideTimer = () => {
      hideTimeout = setTimeout(() => {
        hideControls();
      }, 5000); // 5 seconds
    };

    const handleUserActivity = () => {
      showControls();
      startHideTimer();
    };

    // Start the initial timer after component is loaded
    fadeTimeout = setTimeout(() => {
      startHideTimer();
    }, 1000); // Wait 1 second after loading to start the timer

    // Add event listeners for user activity
    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "keyup",
      "touchstart",
      "touchmove",
    ];

    // Show controls again on user activity
    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Cleanup function
    return () => {
      if (hideTimeout) clearTimeout(hideTimeout);
      if (fadeTimeout) clearTimeout(fadeTimeout);
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [isLoading]);

  const showTextClick = () => {
    console.log("showing text.");
    setFragmentPath(audioFile.html);
    setShowOverlay(true);
  };

  const hideTextClick = () => {
    console.log("hiding text");
    setShowOverlay(false);
  };

  const showCaptionsClick = () => {
    console.log("showing captions");
    setCaptionPath(audioFile.captions);
    setShowCaptionsOverlay(true);
    console.log("sound time", sound.currentTime());
  };

  const hideCaptionsClick = () => {
    console.log("hiding captions");
    setShowCaptionsOverlay(false);
  };

  // Set up controls after component is rendered
  useEffect(() => {
    if (isLoading || !sound) return;

    const playButton = playBtnRef.current;
    const stopButton = stopBtnRef.current;

    if (!playButton || !stopButton) return;

    const handlePlay = () => {
      if (sound && !sound.isPlaying()) {
        sound.play();
        setIsPlaying(true);
        playButton.style.display = "none";
        stopButton.style.display = "block";
      }
    };

    const handleStop = () => {
      if (sound && sound.isPlaying()) {
        sound.stop();
        setIsPlaying(false);
        stopButton.style.display = "none";
        playButton.style.display = "block";
      }
    };

    playButton.addEventListener("click", handlePlay);
    stopButton.addEventListener("click", handleStop);

    // Cleanup: remove listeners on unmount or when dependencies change
    return () => {
      playButton.removeEventListener("click", handlePlay);
      stopButton.removeEventListener("click", handleStop);
    };
  }, [isLoading, sound]);

  // Cleanup effect for sound
  useEffect(() => {
    return () => {
      if (sound) {
        console.log("Cleaning up sound...");
        try {
          sound.stop();
          sound.disconnect();
        } catch (error) {
          console.error("Error cleaning up sound:", error);
        }
      }
    };
  }, [sound]);

  // Handle browser back button and component unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sound) {
        console.log("Stopping sound before unload...");
        sound.stop();
        sound.disconnect();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleBeforeUnload);
      handleBeforeUnload(); // Also clean up when component unmounts
    };
  }, [sound]);

  useEffect(() => {
    let isActive = true; // Flag to track if component is mounted

    const initializeVisualizer = async () => {
      console.log("Initializing visualizer...", { audioFile, mode });
      if (!audioFile?.path || !mode || !isActive) {
        console.log("Missing required props:", { audioFile, mode });
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
          const loadedSound = await p5Instance.current.setAudio(audioFile.path);
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
                  const playButton = playBtnRef.current;
                  const stopButton = stopBtnRef.current;
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
          } else {
            console.error("Failed to load sound");
            setIsLoading(false);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing visualizer:", error);
        setIsLoading(false);
      }
    };

    initializeVisualizer();

    return () => {
      console.log("Cleaning up AudioVisualizer...");
      isActive = false;

      if (p5Instance.current) {
        console.log("Removing p5 instance...");
        try {
          p5Instance.current.remove();
          p5Instance.current = null;
        } catch (error) {
          console.error("Error removing p5 instance:", error);
        }
      }

      setSound(null);
      setIsPlaying(false);
      setShowOverlay(false);
    };
  }, [audioFile, mode]);

  if (!audioFile?.path || !mode) {
    console.log("Missing props:", { audioFile, mode });
    return (
      <div>No audio file or mode selected. Please go back and select both.</div>
    );
  }

  if (isLoading) {
    return <div>Loading audio...</div>;
  }

  const handleReturnToMainMenu = (e) => {
    e.preventDefault();
    // Navigate to Home view
    navigate("/");
  };

  return (
    <div>
      <div ref={sketchRef}></div>
      {showOverlay && <TextOverlay fragmentPath={fragmentPath} />}
      {showCaptionsOverlay && (
        <CaptionOverlay captionPath={captionPath} sound={sound} />
      )}
      <div
        className="controls"
        ref={controlsRef}
        style={{
          opacity: controlsVisible ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
          pointerEvents: controlsVisible ? "auto" : "none",
        }}
      >
        <button
          id="playButton"
          style={{ display: isPlaying ? "none" : "block" }}
          ref={playBtnRef}
        >
          Play
        </button>
        <button
          id="stopButton"
          style={{ display: isPlaying ? "block" : "none" }}
          ref={stopBtnRef}
        >
          Stop
        </button>
        {audioFile.html && !showOverlay && (
          <button onClick={showTextClick}>Show text</button>
        )}
        {showOverlay && <button onClick={hideTextClick}>Hide text</button>}
        {!showCaptionsOverlay && (
          <button onClick={showCaptionsClick}>Show captions</button>
        )}
        {showCaptionsOverlay && (
          <button onClick={hideCaptionsClick}>Hide captions</button>
        )}
        <button onClick={handleReturnToMainMenu}>Return to menu</button>
      </div>
    </div>
  );
};

export default AudioVisualizer;
