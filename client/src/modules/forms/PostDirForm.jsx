import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import apiHandler from '../api/apiHandler';
import "./Forms.css";

const PostDirForm = ({ refreshFunction }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [creationSuccess, setCreationSuccess] = useState(false);

  const onSubmit = async (data) => {
    try {
      // Отправляем POST запрос на сервер для создания директории
      await apiHandler.postDir(data);

      // Помечаем успешное создание
      setCreationSuccess(true);
    } catch (error) {
      console.error('Ошибка при отправке данных на сервер:', error);
    }
  };

  useEffect(() => {
    // Вызываем refreshFunction только после успешного создания директории
    if (creationSuccess) {
      const fetchData = async () => {
        // Ждем небольшую задержку, чтобы дать серверу обновить данные
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Вызываем refreshFunction после успешного создания директории и задержки
        refreshFunction();
        
        // Сбрасываем флаг успешного создания
        setCreationSuccess(false);
      };

      fetchData();
    }
  }, [creationSuccess, refreshFunction]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>{"dir name for create"}</div>
      <input {...register('dirName')} />
      <input type="submit" />
    </form>
  );
};

export default PostDirForm;