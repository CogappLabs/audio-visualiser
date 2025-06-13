import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MODES = {
  sketch: "Level meter",
  serene: "Serene",
  circle: "Circle",
  zen: "Zen",
  "cursor-special": "Cursor Special",
  // Add more modes here as they are created
};

const Home = () => {
  const [selectedAudio, setSelectedAudio] = useState("");
  const [selectedMode, setSelectedMode] = useState("sketch");
  const navigate = useNavigate();

  const audioFiles = [
    {
      name: "Hey Moon",
      path: "/sources/hey-moon/hey-moon.mp3",
      html: "/sources/hey-moon/hey-moon.html",
    },
    {
      name: "Gaps",
      path: "/sources/gaps/gaps.mp3",
      html: "/sources/gaps/gaps.html",
    },
    { name: "The Jellyfish", path: "/sources/jellyfish/jellyfish.mp3" },
    { name: "FunK with IIIF", path: "/sources/iiif/iiif.mp3" },
    // Add more audio files here
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedAudio) {
      // Find the selected audio file object
      const selectedAudioFile = audioFiles.find(
        (file) => file.path === selectedAudio
      );

      // Go into fullscreen
      document.body.requestFullscreen();
      // Navigate to AudioVisualizer view
      navigate("/visualizer", {
        state: {
          audioFile: selectedAudioFile,
          mode: selectedMode,
        },
      });
    }
  };

  return (
    <div className="home-container">
      <h1>Audio Visualizer</h1>
      <form onSubmit={handleSubmit}>
        <div className="audio-selector">
          <label htmlFor="audio-select">Choose an audio file:</label>
          <select
            id="audio-select"
            value={selectedAudio}
            onChange={(e) => setSelectedAudio(e.target.value)}
            required
          >
            <option value="">Select an audio file</option>
            {audioFiles.map((file) => (
              <option key={file.path} value={file.path}>
                {file.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mode-selector">
          <label htmlFor="mode-select">Choose a visualization mode:</label>
          <select
            id="mode-select"
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            required
          >
            {Object.entries(MODES).map(([mode, label]) => (
              <option key={mode} value={mode}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={!selectedAudio}>
          Start Visualization
        </button>
      </form>
    </div>
  );
};

export default Home;
