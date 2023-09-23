import React, { useState } from 'react';
import './Slider.css';

function Slider({ folderName, photos }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return <div>No photos to display.</div>;
  }

  const currentPhoto = photos[currentPhotoIndex];

  const nextPhoto = () => {
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  return (
    <div>
      <h2>{folderName}</h2>
      <div className="slider">
        <div className="slide">
          <img
            src={`http://localhost:3009/photos/${folderName}/${currentPhoto}`}
            alt={currentPhoto}
          />
        </div>
      </div>
      <div className="controls">
        <button onClick={prevPhoto}>Previous</button>
        <button onClick={nextPhoto}>Next</button>
      </div>
    </div>
  );
}

export default Slider;
