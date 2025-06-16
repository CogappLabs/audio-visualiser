import React, { useEffect, useState } from 'react';

function CaptionOverlay({ captionPath, sound }) {

  const [htmlContent, setHtmlContent] = useState('');

    const loadVTT = async (url) => {
      try {
        const response = await fetch(url);
        const vttText = await response.text();
        const jsonLyrics = parseVTT(vttText);
    
        //console.log(jsonLyrics);
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
    console.log("captions", captions);
    // console.log('p5inst', p5Instance);
    
    let currentTime = sound.currentTime();

    console.log("sound time in captions", currentTime);

    for (let i = 0; i < captions.length; i++) {
			let cue = captions[i];
      console.log("looping", i);
			if (currentTime >= cue.start && currentTime <= cue.end) {
        console.log("caption number", i);
				lyricsContainer.innerHTML = cue.formattedText;
				// Only update the image if the cue has changed to avoid
				// DOSing the API.
				break;
			} else {
        const randomEmojis = getRandomMusicEmojis();
        lyricsContainer.textContent = randomEmojis.join(" ");
      }
		}



  }, [captionPath], [sound]);

  return (
    <div className='centered-overlay'>caption</div>
  );
}

export default CaptionOverlay;
