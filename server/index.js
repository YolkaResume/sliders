const express = require("express");
const cors = require("cors");
const parser = require("body-parser");
const path = require('path');
const fs = require('fs').promises;
const fsold = require('fs');
const multer  = require('multer')

const photosDirectory = './sliders/test3';

const PORT = 3009;

const jsonParser = parser.json()

// Настройка хранилища и настроек для Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dirName = req.body.dirName || 'default';
    cb(null, `sliders/${dirName}`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

const app = express();
app.use(cors())

// Обработчик GET-запроса для получения списка директорий
app.get("/directories/sliders/get", (req, res) => {
  const directoryPath = path.join(__dirname, 'sliders');
  
  if (!fsold.existsSync(directoryPath)) {
    return res.status(404).send("Директория не существует");
  }

  fsold.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Ошибка при чтении директории: ' + err);
      return res.status(500).send("Ошибка сервера");
    }

    const fileNames = [];

    files.forEach((file) =>  {
      fileNames.push(file);
    });

    res.json({ directorys: fileNames });
  });
});


app.get('/photos/:folder/:photoName', (req, res) => {
  const { folder, photoName } = req.params;
  const imagePath = path.join(__dirname, 'sliders', folder, photoName);

  // Отправляем изображение как бинарные данные
  res.sendFile(imagePath);
});


app.get('/photos', (req, res) => {
  const directoryPath = path.join(__dirname, 'sliders');
  fsold.readdir(directoryPath, (err, folders) => {
    if (err) {
      console.error('Ошибка при чтении директории:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
      return;
    }

    const folderData = {};

    // Итерируемся по каждой папке
    folders.forEach((folder) => {
      const folderPath = path.join(directoryPath, folder);
      fsold.readdir(folderPath, (err, files) => {
        if (err) {
          console.error('Ошибка при чтении директории:', err);
          res.status(500).json({ error: 'Ошибка сервера' });
          return;
        }

        // Добавляем данные о папке в объект
        folderData[folder] = files;

        // Если это последняя папка, отправляем ответ
        if (Object.keys(folderData).length === folders.length) {
          res.json(folderData);
        }
      });
    });
  });
});

// Обработчик POST-запроса для загрузки фотографии
app.post('/post/photo', upload.single('photo'), function (req, res) {
  if (!req.file) {
    res.status(400).send('Файл не был загружен');
  } else {
    res.status(200).send(`Файл ${req.file.originalname} успешно загружен`);
  }
});

// Обработчик POST-запроса для создания директории
app.post('/directories/sliders/add', jsonParser, async (req, res) => {
  const dirName = req.body.dirName;
  const dirPath = `sliders/${dirName}`;

  try {
    await fs.mkdir(dirPath, { recursive: true });

    console.log(`Directory '${dirPath}' has been successfully created.`);
    res.status(200).send(`Directory '${dirPath}' has been successfully created.`);
  } catch (error) {
    if (error.code === 'EEXIST') {
      console.log(`Directory '${dirPath}' already exists.`);
      res.status(400).send(`Directory '${dirPath}' already exists.`);
    } else {
      console.error('Error creating directory:', error);
      res.status(500).send('Error creating directory');
    }
  }
});

// Обработчик POST-запроса для удаления директории
app.post('/directories/sliders/delete', jsonParser, async (req, res) => {
  const dirName = req.body.dirName;
  const dirPath = `sliders/${dirName}`;

  try {
    await fs.rm(dirPath, { recursive: true });

    console.log(`Directory '${dirPath}' and its contents have been deleted.`);
    res.status(200).send(`Directory '${dirPath}' and its contents have been deleted.`);
  } catch (error) {
    console.error(`Error deleting directory: ${error}`);
    res.status(500).send('Error deleting directory');
  }
});

app.listen(PORT, () => {
  console.log(`server started on ${PORT} port`)
})

