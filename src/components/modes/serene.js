import p5 from "p5";

const serene = (p) => {
  let sound;
  let fft;
  let audioPath;
  let c;

  p.setup = () => {
    console.log("Serene mode setup called");
    p.createCanvas(window.innerWidth, window.innerHeight);
    fft = new p5.FFT();
    p.noStroke();
    p.colorMode(p.HSB, 100);
    c = p.color(10, 20, 50);
  };

  p.setAudio = async (path) => {
    console.log("Serene mode setAudio called with path:", path);
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
    // Check if sound exists and is playing
    if (sound && sound.isPlaying() && fft) {
      console.log("Drawing serene visualization...");
      let spectrum = fft.analyze();
      let size = p.width / spectrum.length;

      for (let i = 0; i < spectrum.length; i++) {
        let x = p.map(i, 0, spectrum.length, 0, p.width);
        let y = p.map(spectrum[i], 0, 255, p.height, 0);
        p.rect(x, y, size, p.height - y);

        let energy = p.map(fft.getEnergy("bass", "treble"), 0, 255, 0, 100);
        let c1 = p.color(50, 50, energy);
        p.background(c1);
      }
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight);
  };
};

export default serene;
