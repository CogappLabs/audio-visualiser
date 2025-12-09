import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AudioVisualiser from "./components/AudioVisualiser";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visualiser" element={<AudioVisualiser />} />
      </Routes>
    </Router>
  );
}

export default App;
