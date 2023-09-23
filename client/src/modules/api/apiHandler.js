import axios from "axios";

// URL для запросов
const slidersUrl = "http://localhost:3009/directories/sliders/";

class apiHandler {
  // Метод для отправки POST-запроса для создания директории
  static postDir = (dirName) => {
    axios
      .post(slidersUrl + "add", dirName)
      .then((response) => {
        console.log('POST request successful:', response.data);
      })
      .catch((error) => {
        console.error('POST request error:', error);
      });
  }

  // Метод для отправки POST-запроса для удаления директории
  static deleteDir = (dirName) => {
    axios
      .post(slidersUrl + "delete", dirName)
      .then((response) => {
        console.log('POST request successful:', response.data);
      })
      .catch((error) => {
        console.error('POST request error:', error);
      });
  }

  // Метод для отправки POST-запроса с фотографией
  static postPhoto = async (data) => {
    try {
      // Создаем объект FormData для отправки файлов и текстовых данных
      const formData = new FormData();
      formData.append('dirName', data.dirName);
      formData.append('photo', data.file[0]); // Здесь мы берем первый выбранный файл

      // Отправляем POST запрос на сервер с использованием axios
      const response = await axios.post('http://localhost:3009/post/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Серверный ответ:', response.data);
    } catch (error) {
      console.error('Ошибка при отправке данных на сервер:', error);
    }
  };

  // Метод для отправки GET-запроса для получения данных о директориях
  static getDirs = async ({ setSliders }) => {
    axios.get(slidersUrl + "get").then(function (response) {
      // Обновляем состояние, используя функцию setSliders
      setSliders(response.data.directorys.map((value) => ({ value, label: value })));
    });
  }

  // Метод для отправки GET-запроса для получения фото
  static async getPhotos() {
    try {
      const response = await axios.get("http://localhost:3009/photos");
      return response.data;
    } catch (error) {
      // Обработка ошибки, например, вывод в консоль
      console.error("Ошибка при загрузке фотографий:", error);
      throw error; // Можно выбросить ошибку, чтобы обработать её в вызывающем коде
    }
  }
}

export default apiHandler;
