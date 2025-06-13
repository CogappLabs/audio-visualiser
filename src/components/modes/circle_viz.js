// circle_viz.js
// Demo: Animated circle with gradient fill, animated background, variable stroke, and blurred edge
// All key variables are set at the top for easy control

// === Configurable Variables ===
let bgColor1, bgColor2; // Background gradient colors
let circleColor1, circleColor2; // Circle fill gradient colors
let strokeColor; // Outline color
let baseStrokeThickness; // Base outline thickness
let outlineNoiseScale; // How much noise affects thickness
let outlineNoiseSpeed; // How fast the noise animates
let outlineBlurSteps; // How many blurred outlines to draw
let outlineBlurAlpha; // Max alpha for blurred outlines
let outlineBlurRadius; // How much the blur spreads
let blurSteps; // Number of steps for fake fill blur
let blurAlpha; // Max alpha for fill blur
let blurRadius; // How much larger the blur is than the main circle
let sound;
let fft;
let isPlaying = false;

function preload() {
  sound = loadSound("mp3s/hey-moon.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);

  // === Set initial values ===
  bgColor1 = color(10, 100, 30); // dark blue
  bgColor2 = color(0, 255, 60); // dark red
  circleColor1 = color(0, 255, 80); // red
  circleColor2 = color(120, 255, 80); // green
  strokeColor = color(0, 0, 255); // white
  baseStrokeThickness = 80;
  outlineNoiseScale = 3;
  outlineNoiseSpeed = 0.2;
  outlineBlurSteps = 8;
  outlineBlurAlpha = 60;
  outlineBlurRadius = 18;
  blurSteps = 20;
  blurAlpha = 40;
  blurRadius = 60;

  // Set up FFT
  fft = new p5.FFT();

  // Button logic
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
}

function draw() {
  // Animate background gradient
  let t = millis() * 0.0002;
  let lerpAmt = (sin(t) + 1) / 2;
  let bgCol = lerpColor(bgColor1, bgColor2, lerpAmt);
  setGradient(
    0,
    0,
    width,
    height,
    bgCol,
    lerpColor(bgColor2, bgColor1, lerpAmt),
    1
  );

  // Animate circle fill gradient
  let cLerp = (cos(t * 1.5) + 1) / 2;
  let fillCol = lerpColor(circleColor1, circleColor2, cLerp);

  // --- Audio-driven circle size ---
  let baseRadius = min(width, height) * 0.3;
  let cx = width / 2;
  let cy = height / 2;
  let audioScale = 1;
  if (isPlaying) {
    let spectrum = fft.analyze();
    let avg = spectrum.reduce((a, b) => a + b, 0) / spectrum.length;
    // Map avg: 0 -> 0.1, 255 -> 1.0
    audioScale = map(avg, 0, 255, 0.1, 1.0);
  } else {
    audioScale = 0.1;
  }
  let animatedRadius = baseRadius * audioScale;

  // Draw blurred edge (fake blur by drawing many circles)
  noStroke();
  for (let i = blurSteps; i > 0; i--) {
    let r = animatedRadius + map(i, 0, blurSteps, 0, blurRadius);
    let a = blurAlpha * (i / blurSteps);
    fill(hue(fillCol), saturation(fillCol), brightness(fillCol), a);
    ellipse(cx, cy, r * 2, r * 2);
  }

  // Draw main filled circle
  fill(fillCol);
  ellipse(cx, cy, animatedRadius * 2, animatedRadius * 2);

  // Draw blurred, noisy outline
  for (let b = outlineBlurSteps; b > 0; b--) {
    let blurR =
      animatedRadius + map(b, 0, outlineBlurSteps, 0, outlineBlurRadius);
    let blurT =
      baseStrokeThickness +
      map(b, 0, outlineBlurSteps, 0, outlineBlurRadius * 1.2);
    let blurA = outlineBlurAlpha * (b / outlineBlurSteps);
    drawNoisyOutline(cx, cy, blurR, blurT, blurA, fillCol, t);
  }
  // Draw main outline
  drawNoisyOutline(
    cx,
    cy,
    animatedRadius,
    baseStrokeThickness,
    255,
    strokeColor,
    t
  );
}

// Draw a noisy, variable-thickness ring outline
function drawNoisyOutline(cx, cy, radius, thickness, alpha, col, t) {
  let steps = 180;
  let noiseSeed = t * outlineNoiseSpeed;
  let angleStep = TWO_PI / steps;
  noFill();
  stroke(col);
  strokeWeight(baseStrokeThickness * 1.2);
  beginShape();
  for (let i = 0; i <= steps; i++) {
    let angle = i * angleStep;
    let n = noise(
      cos(angle) * outlineNoiseScale + 100,
      sin(angle) * outlineNoiseScale + 100,
      noiseSeed
    );
    let localThickness = thickness * (0.7 + 0.6 * n);
    let rOuter = radius + localThickness / 2;
    let x = cx + cos(angle) * rOuter;
    let y = cy + sin(angle) * rOuter;
    stroke(red(col), green(col), blue(col), alpha);
    if (i === 0) {
      beginShape();
    }
    vertex(x, y);
  }
  endShape();
  beginShape();
  for (let i = steps; i >= 0; i--) {
    let angle = i * angleStep;
    let n = noise(
      cos(angle) * outlineNoiseScale + 100,
      sin(angle) * outlineNoiseScale + 100,
      noiseSeed
    );
    let localThickness = thickness * (0.7 + 0.6 * n);
    let rInner = radius - localThickness / 2;
    let x = cx + cos(angle) * rInner;
    let y = cy + sin(angle) * rInner;
    stroke(red(col), green(col), blue(col), alpha);
    vertex(x, y);
  }
  endShape(CLOSE);
}

// Helper: Draw vertical or horizontal gradient
function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  if (axis === 1) {
    // Y axis
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else {
    // X axis
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}
