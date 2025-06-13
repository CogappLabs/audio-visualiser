// circle_viz.js
// Demo: Animated circle with gradient fill, animated background, variable stroke, and blurred edge
// All key variables are set at the top for easy control

import p5 from "p5";

const circleViz = (p) => {
  // === Configurable Variables ===
  let bgColor1, bgColor2; // Background gradient colors
  let baseHue; // Base hue for the circle
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
  let lastEnergy = 0; // For smooth transitions

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.colorMode(p.HSB, 255);

    // === Set initial values ===
    bgColor1 = p.color(10, 100, 30); // dark blue
    bgColor2 = p.color(0, 255, 60); // dark red
    baseHue = 180; // Base hue for the circle
    baseStrokeThickness = 80;
    outlineNoiseScale = 50;
    outlineNoiseSpeed = 0.2;
    outlineBlurSteps = 8;
    outlineBlurAlpha = 60;
    outlineBlurRadius = 18;
    blurSteps = 20;
    blurAlpha = 40;
    blurRadius = 60;

    // Set up FFT
    console.log("Initializing FFT in circle_viz");
    fft = new p5.FFT();
    console.log("FFT initialized:", fft);
    p.noStroke();
  };

  p.setAudio = async (path) => {
    try {
      // Wait for FFT to be initialized
      if (!fft) {
        console.log("Waiting for FFT initialization...");
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      console.log("Loading sound in circle_viz...");
      sound = await p.loadSound(path);
      console.log("Sound loaded in circle_viz:", sound);

      if (fft) {
        console.log("Connecting sound to FFT in circle_viz");
        sound.connect(fft);
        return sound; // Return the sound object
      } else {
        console.error("FFT not initialized in circle_viz");
        return null;
      }
    } catch (error) {
      console.error("Error loading sound in circle_viz:", error);
      return null;
    }
  };

  p.draw = () => {
    // Animate background gradient
    let t = p.millis() * 0.0002;
    let lerpAmt = (p.sin(t) + 1) / 2;
    let bgCol = p.lerpColor(bgColor1, bgColor2, lerpAmt);
    setGradient(
      0,
      0,
      p.width,
      p.height,
      bgCol,
      p.lerpColor(bgColor2, bgColor1, lerpAmt),
      1
    );

    // Analyze the audio
    fft.analyze();

    // Get current energy from FFT
    let currentEnergy = fft.getEnergy("highMid");
    console.log("Current energy:", currentEnergy); // Debug log

    // Smooth the energy transition
    lastEnergy = p.lerp(lastEnergy, currentEnergy, 0.1);

    // Create circle color based on energy
    let fillCol = p.color(
      (baseHue + lastEnergy) % 255, // Rotate hue based on energy
      200, // High saturation
      p.map(lastEnergy, 0, 255, 100, 255) // Brightness based on energy
    );

    // Circle parameters
    let cx = p.width / 2;
    let cy = p.height / 2;
    let baseRadius = p.min(p.width, p.height) * 0.3;

    // Draw blurred edge (fake blur by drawing many circles)
    p.noStroke();
    for (let i = blurSteps; i > 0; i--) {
      let r = baseRadius + p.map(i, 0, blurSteps, 0, blurRadius);
      let a = blurAlpha * (i / blurSteps);
      p.fill(p.hue(fillCol), p.saturation(fillCol), p.brightness(fillCol), a);
      p.ellipse(cx, cy, r * 2, r * 2);
    }

    // Draw main filled circle
    p.fill(fillCol);
    p.ellipse(cx, cy, baseRadius * 2, baseRadius * 2);

    // Draw blurred, noisy outline
    for (let b = outlineBlurSteps; b > 0; b--) {
      let blurR =
        baseRadius + p.map(b, 0, outlineBlurSteps, 0, outlineBlurRadius);
      let blurT =
        baseStrokeThickness +
        p.map(b, 0, outlineBlurSteps, 0, outlineBlurRadius * 1.2);
      let blurA = outlineBlurAlpha * (b / outlineBlurSteps);
      drawNoisyOutline(cx, cy, blurR, blurT, blurA, fillCol, t);
    }
  };

  // Draw a noisy, variable-thickness ring outline
  function drawNoisyOutline(cx, cy, radius, thickness, alpha, col, t) {
    let steps = 180;
    let noiseSeed = t * outlineNoiseSpeed;
    let angleStep = p.TWO_PI / steps;
    p.noFill();
    p.stroke(col);
    p.strokeWeight(baseStrokeThickness * 1.2);
    p.beginShape();
    for (let i = 0; i <= steps; i++) {
      let angle = i * angleStep;
      let n = p.noise(
        p.cos(angle) * outlineNoiseScale + 100,
        p.sin(angle) * outlineNoiseScale + 100,
        noiseSeed
      );
      let localThickness = thickness * (0.7 + 0.6 * n);
      let rOuter = radius + localThickness / 2;
      let x = cx + p.cos(angle) * rOuter;
      let y = cy + p.sin(angle) * rOuter;
      p.stroke(p.red(col), p.green(col), p.blue(col), alpha);
      if (i === 0) {
        p.beginShape();
      }
      p.vertex(x, y);
    }
    p.endShape();
    p.beginShape();
    for (let i = steps; i >= 0; i--) {
      let angle = i * angleStep;
      let n = p.noise(
        p.cos(angle) * outlineNoiseScale + 100,
        p.sin(angle) * outlineNoiseScale + 100,
        noiseSeed
      );
      let localThickness = thickness * (0.7 + 0.6 * n);
      let rInner = radius - localThickness / 2;
      let x = cx + p.cos(angle) * rInner;
      let y = cy + p.sin(angle) * rInner;
      p.stroke(p.red(col), p.green(col), p.blue(col), alpha);
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);
  }

  // Helper: Draw vertical or horizontal gradient
  function setGradient(x, y, w, h, c1, c2, axis) {
    p.noFill();
    if (axis === 1) {
      // Y axis
      for (let i = y; i <= y + h; i++) {
        let inter = p.map(i, y, y + h, 0, 1);
        let c = p.lerpColor(c1, c2, inter);
        p.stroke(c);
        p.line(x, i, x + w, i);
      }
    } else {
      // X axis
      for (let i = x; i <= x + w; i++) {
        let inter = p.map(i, x, x + w, 0, 1);
        let c = p.lerpColor(c1, c2, inter);
        p.stroke(c);
        p.line(i, y, i, y + h);
      }
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

export default circleViz;
