import p5 from "p5";

const zen = (p) => {
  let sound;
  let isPlaying = false;
  let audioPath;

  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight);
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

  };

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight);
  };
};

export default zen;
