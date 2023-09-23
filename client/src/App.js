import './App.css';
import PostPhotoForm from './modules/forms/PostPhotoForm';
import PostDirForm from './modules/forms/PostDirForm';
import DeleteDirForm from './modules/forms/DeleteDirForm';
import apiHandler from './modules/api/apiHandler';
import { useState, useEffect } from 'react';
import Slider from './modules/UI/Slider/Slider';

function App() {
  const [photos, setPhotos] = useState({});
  const [sliders, setSliders] = useState([]);

  useEffect(() => {
    // Загрузка фотографий асинхронно внутри useEffect
    const fetchPhotos = async () => {
      const fetchedPhotos = await apiHandler.getPhotos();
      setPhotos(fetchedPhotos);
    };

    // Вызываем функцию для загрузки фотографий
    fetchPhotos();

    // Загрузка директорий
    apiHandler.getDirs({ setSliders });
  }, []); // Пустой массив зависимостей, чтобы useEffect выполнялся только при монтировании компонента

  return (
    <div className="App">
      <PostDirForm refreshFunction={() => apiHandler.getDirs({ setSliders })} />
      <DeleteDirForm options={sliders} refreshFunction={() => apiHandler.getDirs({ setSliders })} />
      <PostPhotoForm options={sliders} />
      
      {Object.keys(photos).map((folderName) => (
        <Slider key={folderName} folderName={folderName} photos={photos[folderName]} />
      ))}
    </div>
  );
}

export default App;
