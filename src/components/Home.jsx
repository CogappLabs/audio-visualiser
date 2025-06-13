import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [selectedAudio, setSelectedAudio] = useState("");
  const navigate = useNavigate();

  const audioFiles = [
    { name: "Hey Moon", path: "/mp3s/hey-moon.mp3" },
    // Add more audio files here
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedAudio) {
      navigate("/visualizer", { state: { audioPath: selectedAudio } });
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
        <button type="submit" disabled={!selectedAudio}>
          Start Visualization
        </button>
      </form>
    </div>
  );
};

export default Home;
