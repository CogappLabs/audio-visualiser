import p5 from "p5";

const cursor = (p) => {
  let sound;
  let fft;
  let audioPath;

  p.setup = () => {
    console.log("Cursor mode setup called");
    p.createCanvas(window.innerWidth, window.innerHeight);
    fft = new p5.FFT();
    p.noStroke();
  };

  p.setAudio = async (path) => {
    console.log("Cursor mode setAudio called with path:", path);
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

    // Check if sound exists and is playing
    if (sound && sound.isPlaying() && fft) {
      console.log("Drawing cursor visualization...");
      let spectrum = fft.analyze();
      let size = p.width / spectrum.length;

      for (let i = 0; i < spectrum.length; i++) {
        // Create a circular visualization
        let angle = p.map(i, 0, spectrum.length, 0, p.TWO_PI);
        let radius = p.map(spectrum[i], 0, 255, 50, p.width / 2);
        let x = p.width / 2 + p.cos(angle) * radius;
        let y = p.height / 2 + p.sin(angle) * radius;

        // Use a gradient color based on frequency
        let hue = p.map(i, 0, spectrum.length, 0, 360);
        p.fill(hue, 80, 80, 100);
        p.ellipse(x, y, size * 2, size * 2);
      }
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight);
  };
};

export default cursor;
