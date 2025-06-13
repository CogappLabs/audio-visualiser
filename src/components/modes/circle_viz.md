# circle_viz.js Settings Documentation

This file explains all the configurable variables at the top of `circle_viz.js` and what each one does. Use this as a reference when tweaking the visual style or hooking up audio data!

---

## Background Colors

- **bgColor1, bgColor2**
  - The two colors used for the animated background gradient.
  - The background smoothly transitions between these colors over time.
  - _Tip: Try different hues for different moods!_

## Circle Fill Colors

- **circleColor1, circleColor2**
  - The two colors used for the animated fill of the main circle.
  - The fill color smoothly morphs between these two.
  - _Tip: Use contrasting or harmonious colors for different effects._

## Outline (Stroke) Settings

- **strokeColor**
  - The base color of the circle's outline (the main visible ring).
- **baseStrokeThickness**
  - The average thickness of the outline.
  - _Higher values = thicker ring._
- **outlineNoiseScale**
  - Controls how much the outline thickness varies around the circle.
  - _Higher values = more wobbly, organic outline._
- **outlineNoiseSpeed**
  - How quickly the outline's random shape animates.
  - _Higher values = faster movement._

## Outline Blur Settings

- **outlineBlurSteps**
  - How many blurred outlines are drawn to create a soft, glowing edge.
  - _Higher values = smoother, softer blur (but more computation)._
- **outlineBlurAlpha**
  - The maximum opacity of the blurred outlines.
  - _Lower values = more subtle blur._
- **outlineBlurRadius**
  - How far the blur spreads out from the main outline.
  - _Higher values = wider, softer glow._

## Fill Blur (Soft Edge) Settings

- **blurSteps**
  - How many blurred circles are drawn to create a soft edge for the main fill.
  - _Higher values = smoother, softer edge._
- **blurAlpha**
  - The maximum opacity of the blurred fill circles.
  - _Lower values = more subtle soft edge._
- **blurRadius**
  - How much larger the blur is than the main circle.
  - _Higher values = wider, softer edge._

---

## Tips for Tweaking

- All these variables can be changed at the top of `circle_viz.js`.
- For a more dramatic effect, increase noise and blur values.
- For a subtle, clean look, use lower noise and blur values.
- You can animate any of these settings over time or with audio data for dynamic visuals!

---

_Feel free to experiment and see how each setting changes the vibe of your visualisation!_
