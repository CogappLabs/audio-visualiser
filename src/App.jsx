import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AudioVisualizer from "./components/AudioVisualizer";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visualizer" element={<AudioVisualizer />} />
      </Routes>
    </Router>
  );
}

export default App;
