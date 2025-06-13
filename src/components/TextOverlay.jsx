import React, { useEffect, useState } from 'react';

function TextOverlay({ fragmentPath }) {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    if (!fragmentPath) return;

    fetch(fragmentPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(setHtmlContent)
      .catch(err => console.error('Error loading HTML fragment:', err));
  }, [fragmentPath]);

  return (
    <div className='centered-overlay' dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}

export default TextOverlay;
