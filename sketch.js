let sound;
let fft;
let isPlaying = false;
let visualizationMode = "circle"; // 'bars' or 'circle'

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
    let spectrum = fft.analyze();
    // console.log(spectrum);

    if (visualizationMode === "bars") {
      drawBars(spectrum);
    } else {
      drawCircle(spectrum);
    }
  }
}

function drawBars(spectrum) {
  // Calculate width of rectangles
  let size = width / spectrum.length;

  // Loop through spectrum array to draw a rectangle per frequency band
  for (let i = 0; i < spectrum.length; i++) {
    // Map the x location of rectangle using the array index
    let x = map(i, 0, spectrum.length, 0, width);
    // Map the y location of rectangle using amplitude at the specific frequency band
    let y = map(spectrum[i], 0, 255, height, 0);

    // Map the frequency value to a color
    colorMode(HSB, 255);
    let hue = map(i, 0, spectrum.length, 0, 255);
    let brightness = map(spectrum[i], 0, 255, 50, 255);
    fill(hue, 255, brightness);

    rect(x, y, size, height - y);
  }
}

function drawCircle(spectrum) {
  // Set up the circle parameters
  let circleDiameter = width * 0.6;
  let centerX = width / 2;
  let centerY = height / 2;

  // Calculate the angle for each segment
  let angleStep = TWO_PI / spectrum.length;

  // Draw each segment
  for (let i = 0; i < spectrum.length; i++) {
    let angle = i * angleStep;

    // Map the amplitude to the radius
    let radius = map(spectrum[i], 0, 255, 0, circleDiameter / 2);

    // Set the color based on frequency and amplitude
    colorMode(HSB, 255);
    let hue = map(i, 0, spectrum.length, 0, 255);
    let brightness = map(spectrum[i], 0, 255, 50, 255);
    fill(hue, 255, brightness);

    // Draw the segment
    beginShape();
    vertex(centerX, centerY); // Center point
    vertex(centerX + cos(angle) * radius, centerY + sin(angle) * radius);
    vertex(
      centerX + cos(angle + angleStep) * radius,
      centerY + sin(angle + angleStep) * radius
    );
    endShape(CLOSE);
  }
}
