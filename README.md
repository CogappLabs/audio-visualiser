# Audio Visualizer

A simple audio visualizer built with p5.js that creates a real-time visualization of audio frequencies. The visualization consists of vertical bars that respond to the frequency spectrum of the audio being played.

## Features

- Real-time audio frequency visualization
- Play/Stop controls
- Responsive design that adapts to window size
- Works with any MP3 file

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, etc.)
- Python 3.x (for running the local server)
- An MP3 file to visualize

## Setup

1. Clone this repository:

```bash
git clone [your-repo-url]
cd audio-visualiser
```

2. Replace the default audio file:

   - Place your MP3 file in the root directory
   - Update the filename in `sketch.js` to match your audio file:

   ```javascript
   sound = loadSound("your-audio-file.mp3");
   ```

3. Start a local server:

   - Open a terminal in the project directory
   - Run the following command:

   ```bash
   python3 -m http.server 8000
   ```

4. Open your web browser and navigate to:

```
http://localhost:8000
```

## Usage

1. Click the "Click to Play" button to start the visualization
2. The visualization will show vertical bars representing different frequency bands
3. Click the "Stop" button to stop the audio and visualization

## Project Structure

- `index.html` - Main HTML file
- `sketch.js` - Contains the p5.js visualization code
- `style.css` - Styling for the play/stop buttons
- `p5/` - p5.js library files
- `hey-moon.mp3` - Example audio file (replace with your own)

## Notes

- The visualization works best with music that has a good range of frequencies
- The bars' heights represent the amplitude of different frequency bands
- The visualization is responsive and will adjust to your window size

## License

[Your chosen license]

## Credits

- Built with [p5.js](https://p5js.org/)
- Uses [p5.sound](https://p5js.org/reference/#/libraries/p5.sound) for audio analysis
