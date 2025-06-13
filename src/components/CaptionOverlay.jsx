import React, { useEffect, useState } from 'react';

function CaptionOverlay({ captionPath }) {

  const [htmlContent, setHtmlContent] = useState('');

    const loadVTT = async (url) => {
      try {
        const response = await fetch(url);
        const vttText = await response.text();
        const jsonLyrics = parseVTT(vttText);
    
        console.log(jsonLyrics);
        return jsonLyrics;
      } catch (error) {
        console.error("Error loading VTT file:", error);
      }
    };
    
    const parseVTT = (data) => {
      const cues = [];
      const lines = data.split("\n").map((line) => line.trim());
      let cue = {};
    
      lines.forEach((line) => {
        if (line.includes("-->")) {
          const [start, end] = line.split("-->");
          cue = { start: start.trim(), end: end.trim(), text: "" };
        } else if (line) {
          if (cue.text) {
            cue.text += " " + line;
          } else {
            cue.text = line;
          }
        } else if (cue.start) {
          cues.push(cue);
          cue = {};
        }
      });
    
      if (cue.start) {
        cues.push(cue);
      }
    
      return cues;
    };
  

  useEffect(() => {
    if (!captionPath) return;

    let captions = loadVTT(captionPath);
    // console.log('p5inst', p5Instance);
  }, [captionPath]);

  return (
    <div className='centered-overlay'>caption</div>
  );
}

export default CaptionOverlay;
