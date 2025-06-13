import p5 from "p5";

const sketch = (p) => {
  let fft;
  let audioPath;
  let sound;

  p.setup = () => {
    console.log("p5 setup called");
    p.createCanvas(window.innerWidth, window.innerHeight);
    fft = new p5.FFT();
    p.noStroke();
  };

  p.setAudio = async (path) => {
    console.log("setAudio called with path:", path);
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
      console.log("Drawing visualization...");
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
