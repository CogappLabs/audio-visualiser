import { useEffect, useState, useRef } from "react";

function CaptionOverlay({ captionPath, sound }) {
  // const [htmlContent, setHtmlContent] = useState("");
  const [captions, setCaptions] = useState("");
  const captionBoxRef = useRef(null);

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

  // Converts the srt timestamps to <seconds>.<milliseconds> format to match the currentTime format
  const convertTimestampToSeconds = (timestamp) => {
    // Split by ':' to separate hours, minutes, and the rest
    const [hours, minutes, rest] = timestamp.split(":");
    let seconds, milliseconds;
    // Split the last part by ',' or '.' to separate seconds and milliseconds
    if (rest.includes(",")) {
      [seconds, milliseconds] = rest.split(",");
    } else if (rest.includes(".")) {
      [seconds, milliseconds] = rest.split(".");
    }

    // Convert all parts to integers
    const totalSeconds =
      parseInt(hours, 10) * 3600 +
      parseInt(minutes, 10) * 60 +
      parseInt(seconds, 10) +
      parseInt(milliseconds, 10) / 1000;

    return totalSeconds;
  };

  useEffect(() => {
    if (!captionPath) return;

    // Get captions
    loadVTT(captionPath).then((response) => setCaptions(response));

    // console.log("captions", captions);
    // console.log('p5inst', p5Instance);
    // console.log("sound time in captions", currentTime);

    // Get sound current time
    const currentTime = sound.currentTime();

    for (let i = 0; i < captions.length; i++) {
      const cue = captions[i];
      const cueStart = convertTimestampToSeconds(cue.start);
      const cueEnd = convertTimestampToSeconds(cue.end);

      // console.log("looping", i);

      if (currentTime >= cueStart && currentTime <= cueEnd) {
        // console.log("caption number", i);

        // Update the caption box with the current cue
        if (captionBoxRef.current.innerText !== cue.text) {
          captionBoxRef.current.innerHTML = cue.text;
        }

        // lyricsContainer.innerHTML = cue.formattedText;
        // Only update the image if the cue has changed to avoid
        // DOSing the API.
        break;
      }
    }
  }, [captionPath, sound, loadVTT, captions]);

  return (
    <div className="centered-overlay" ref={captionBoxRef}>
      [Captions have not started]
    </div>
  );
}

export default CaptionOverlay;
