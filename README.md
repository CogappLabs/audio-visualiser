# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Audio Visualizer

A React-based audio visualizer that creates dynamic visualizations using p5.js. The application allows users to select different audio files and visualization modes to create unique visual experiences.

## Features

- Multiple visualization modes
- Audio file selection
- Real-time frequency analysis
- Responsive canvas that adapts to window size
- Play/Stop controls

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd audio-visualiser
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Add your audio files:

   - Create an `mp3s` directory in the `public` folder if it doesn't exist
   - Add your MP3 files to the `public/mp3s` directory
   - Update the `audioFiles` array in `src/components/Home.jsx` with your audio files:

   ```javascript
   const audioFiles = [
     { name: "Your Audio Name", path: "/mp3s/your-audio-file.mp3" },
     // Add more audio files here
   ];
   ```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── modes/           # Visualization mode components
│   │   ├── sketch.js    # Default visualization mode
│   │   └── serene.js    # Alternative visualization mode
│   ├── AudioVisualizer.jsx  # Main visualization component
│   └── Home.jsx         # Home page with file/mode selection
├── App.jsx              # Main app component with routing
└── main.jsx            # Application entry point
```

## Adding New Visualization Modes

1. Create a new file in the `src/components/modes` directory
2. Follow the pattern of existing mode files:
   - Export a p5 sketch function
   - Implement `setup`, `draw`, and `setAudio` methods
   - Add any custom visualization logic
3. Import and add the new mode to the `MODES` object in both:
   - `src/components/Home.jsx`
   - `src/components/AudioVisualizer.jsx`

## Development Notes

- The project uses React 18 with Strict Mode enabled for better development experience
- p5.js is used for canvas rendering and audio analysis
- The application uses React Router for navigation
- All visualization modes are modular and can be easily extended

## License

[Your chosen license]
