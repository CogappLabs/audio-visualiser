import { useEffect, useRef } from "react";
import p5 from "p5";
import { useLocation } from "react-router-dom";

// Make p5 available globally
window.p5 = p5;

const AudioVisualizer = () => {
  const sketchRef = useRef(null);
  const p5Instance = useRef(null);
  const location = useLocation();
  const audioPath = location.state?.audioPath;

  useEffect(() => {
    if (!audioPath) return;

    // Dynamically import p5.sound
    import("p5/lib/addons/p5.sound.js").then(() => {
      const sketch = (p) => {
        let sound;
        let fft;
        let isPlaying = false;

        p.setup = async () => {
          p.createCanvas(window.innerWidth, window.innerHeight);

          // Initialize FFT after p5.sound is loaded
          fft = new p5.FFT();

          try {
            // Load sound file using async/await
            sound = await p.loadSound(audioPath);

            const playButton = document.getElementById("playButton");
            const stopButton = document.getElementById("stopButton");

            playButton.addEventListener("click", () => {
              if (!isPlaying) {
                sound.loop();
                isPlaying = true;
                playButton.style.display = "none";
                stopButton.style.display = "block";
              }
            });

            stopButton.addEventListener("click", () => {
              if (isPlaying) {
                sound.stop();
                isPlaying = false;
                stopButton.style.display = "none";
                playButton.style.display = "block";
              }
            });
          } catch (error) {
            console.error("Error loading sound:", error);
          }

          p.noStroke();
        };

        p.draw = () => {
          p.background(0, 30);

          if (isPlaying && fft) {
            let spectrum = fft.analyze();
            let size = p.width / spectrum.length;

            for (let i = 0; i < spectrum.length; i++) {
              let x = p.map(i, 0, spectrum.length, 0, p.width);
              let y = p.map(spectrum[i], 0, 255, p.height, 0);
              p.rect(x, y, size, p.height - y);
            }
          }
        };

        p.windowResized = () => {
          p.resizeCanvas(window.innerWidth, window.innerHeight);
        };
      };

      p5Instance.current = new p5(sketch, sketchRef.current);
    });

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
      }
    };
  }, [audioPath]);

  if (!audioPath) {
    return (
      <div>
        No audio file selected. Please go back and select an audio file.
      </div>
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
