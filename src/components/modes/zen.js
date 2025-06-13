import p5 from "p5";

const zen = (p) => {
  let sound;
  let fft;
  let audioPath;

  p.setup = () => {
    console.log("Zen mode setup called");
    p.createCanvas(window.innerWidth, window.innerHeight);
    fft = new p5.FFT();
    p.noStroke();
  };

  p.setAudio = async (path) => {
    console.log("Zen mode setAudio called with path:", path);
    audioPath = path;
    try {
      // Make sure FFT is initialized
      if (!fft) {
        console.log("Initializing FFT...");
        fft = new p5.FFT();
      }

      console.log("Loading sound...");
      sound = await p.loadSound(audioPath);
      console.log("Sound loaded:", !!sound);

      // Connect the sound to the FFT analyzer
      console.log("Connecting sound to FFT...");
      fft.setInput(sound);
      console.log("Sound connected to FFT");

      return sound; // Return the sound object to be managed by AudioVisualizer
    } catch (error) {
      console.error("Error loading sound:", error);
      return null;
    }
  };

  p.draw = () => {
    p.background(0, 30);
  };

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight);
  };
};

export default zen;
