// import './App.css';
// import './styles.css';
// import { saveAs } from 'file-saver';
// import React, { useState } from 'react';

// export default function App() {
//   const [userTemplate, setUserTemplate] = useState(' ');
//   const [userTopText, setUserTopText] = useState('');
//   const [userBottomText, setUserBottomText] = useState('');
//   const initial = `https://api.memegen.link/images/${userTemplate}.png`;
//   let templates = initial;

//   if (userTopText || userBottomText) {
//     templates =
//       'https://api.memegen.link/images/' +
//       `${userTemplate}/` +
//       `${userTopText}/` +
//       userBottomText +
//       '.png';
//   }

//   function downloadImage() {
//     saveAs(templates, `${userTemplate}.png`);
//   }

//   return (
//     <div className="frame">
//       <div className="wrapper">
//         <div className="input">
//           <label className="label1">
//             Top text <br />
//             <input
//               value={userTopText}
//               onChange={(top) => setUserTopText(top.target.value)}
//             />
//           </label>
//           <br />

//           <label className="label2">
//             Bottom text <br />
//             <input
//               value={userBottomText}
//               onChange={(bottom) => setUserBottomText(bottom.target.value)}
//             />
//           </label>
//           <br />

//           <label className="label3">
//             Meme template <br />
//             <input
//               value={userTemplate}
//               onChange={(bottom) => setUserTemplate(bottom.target.value)}
//             />
//           </label>
//           <br />

//           <button className="button" onClick={downloadImage}>
//             Download
//           </button>
//         </div>

//         <div className="content">
//           <img src={templates} alt={userTemplate} data-test-id="meme-image" />
//         </div>
//       </div>
//     </div>
//   );
// // }

import './App.css';
import './styles.css';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';

export default function App() {
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [memeImageUrl, setMemeImageUrl] = useState('');
  const [templateImageUrl, setTemplateImageUrl] = useState('');

  useEffect(() => {
    // Fetch the data
    fetch('https://api.memegen.link/templates/')
      .then((response) => response.json())
      .then((data) => {
        // Extract template names from the data
        const templateNames = data.map(
          (item) => item.blank.split('.png')[0].split('/')[4],
        );
        setTemplates(templateNames);
        // Set an initial template when the templates are fetched
        if (templateNames.length > 0) {
          setSelectedTemplate(templateNames[0]);
        }
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  useEffect(() => {
    // Update meme template image URL when the selected template changes
    if (selectedTemplate) {
      setTemplateImageUrl(
        `https://api.memegen.link/images/${selectedTemplate}.png`,
      );
    }
  }, [selectedTemplate]);

  useEffect(() => {
    // Generate the meme image URL when topText, bottomText, or selectedTemplate changes
    if (selectedTemplate) {
      let memeUrl = `https://api.memegen.link/images/${selectedTemplate}`;

      if (topText) {
        memeUrl += `/${encodeURIComponent(topText)}`;
      }

      if (bottomText) {
        memeUrl += `/${encodeURIComponent(bottomText)}`;
      } else {
        memeUrl += '/_';
      }

      memeUrl += '.png';

      setMemeImageUrl(memeUrl);
    }
  }, [selectedTemplate, topText, bottomText]);

  // Function to download the new meme
  function saveMemeImage() {
    if (memeImageUrl) {
      saveAs(memeImageUrl, 'meme.png');
    }
  }

  // Function to get a random meme template
  function getRandomTemplate() {
    if (templates.length > 0) {
      const randomIndex = Math.floor(Math.random() * templates.length);
      setSelectedTemplate(templates[randomIndex]);
      setTopText('');
      setBottomText('');
    }
  }

  return (
    <main>
      <div className="section-1">
        <h1>Meme Generator</h1>
      </div>

      <form onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="topText">Top text</label>
        <input
          value={topText}
          id="topText"
          onChange={(event) => setTopText(event.target.value)}
        />

        <label htmlFor="bottomText">Bottom text</label>
        <input
          value={bottomText}
          id="bottomText"
          onChange={(event) => setBottomText(event.target.value)}
        />

        <div className="section-2">
          <div className="template-preview">
            <label>
              Meme Template
              <select
                onChange={(event) => setSelectedTemplate(event.target.value)}
                value={selectedTemplate}
              >
                {templates.map((template) => (
                  <option key={template} value={template}>
                    {template}
                  </option>
                ))}
              </select>
            </label>
            {templateImageUrl && (
              <div className="template-image">
                <img
                  src={templateImageUrl}
                  alt="Selected Template"
                  style={{ maxWidth: '300px', maxHeight: '300px' }}
                />
              </div>
            )}
          </div>
        </div>
      </form>

      {memeImageUrl && (
        <div>
          <h2>Generated Meme</h2>
          <img
            src={memeImageUrl}
            alt="Generated Meme"
            style={{ maxWidth: '300px', maxHeight: '300px' }}
          />
        </div>
      )}

      <div className="button">
        <button onClick={getRandomTemplate}>Get a new meme</button>
      </div>

      <div className="download">
        <button onClick={saveMemeImage}>Download</button>
      </div>
    </main>
  );
}
