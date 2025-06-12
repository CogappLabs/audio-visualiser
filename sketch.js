let sound;
let fft;
let isPlaying = false;

// Load sound file before setup() function runs
function preload() {
  // Load the sound file (update to own file if using local file)
  sound = loadSound("mp3s/hey-moon.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create a new instance of p5.FFT() object
  fft = new p5.FFT();

  // Add click event to play button
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

  noStroke();
}

function draw() {
  background(0, 30);

  if (isPlaying) {
    // analyze() method returns an array of amplitude values across the frequency spectrum
    // Amplitude values range between 0 and 255, where at 0, the sound at the specific frequency band is silent and at 255, the sound at the specific frequency band is at its loudest
    let spectrum = fft.analyze();
    console.log("spectrum", spectrum);

    // Calculate width of rectangles
    let size = width / spectrum.length;

    // Loop through spectrum array to draw a rectangle per frequency band
    for (let i = 0; i < spectrum.length; i++) {
      // Map the x location of rectangle using the array index
      let x = map(i, 0, spectrum.length, 0, width);
      // Map the y location of rectangle using amplitude at the specific frequency band
      let y = map(spectrum[i], 0, 255, height, 0);

      rect(x, y, size, height - y);
    }
  }
}
