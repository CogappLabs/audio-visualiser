import p5 from "p5";

const sketch = (p) => {
  let sound;
  let fft;
  let isPlaying = false;
  let audioPath;

  p.setup = async () => {
    p.createCanvas(window.innerWidth, window.innerHeight);
    fft = new p5.FFT();
    p.noStroke();
  };

  p.setAudio = async (path) => {
    audioPath = path;
    try {
      sound = await p.loadSound(audioPath);
      setupControls();
    } catch (error) {
      console.error("Error loading sound:", error);
    }
  };

  const setupControls = () => {
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

export default sketch;
