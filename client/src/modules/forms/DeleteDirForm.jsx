import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import apiHandler from '../api/apiHandler';
import "./Forms.css";

const DeleteDirForm = ({ options, refreshFunction }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [deletionSuccess, setDeletionSuccess] = useState(false);

  const onSubmit = async (data) => {
    try {
      // Отправляем POST запрос на сервер для удаления директории
      await apiHandler.deleteDir(data);

      // Помечаем успешное удаление
      setDeletionSuccess(true);
    } catch (error) {
      console.error('Ошибка при удалении директории:', error);
    }
  };

  useEffect(() => {
    // Вызываем refreshFunction только после успешного удаления
    if (deletionSuccess) {
      const fetchData = async () => {
        // Ждем небольшую задержку, чтобы дать серверу обновить данные
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Вызываем refreshFunction после успешного удаления и задержки
        refreshFunction();
        
        // Сбрасываем флаг успешного удаления
        setDeletionSuccess(false);
      };

      fetchData();
    }
  }, [deletionSuccess, refreshFunction]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>{"Select a directory to delete"}</div>
      <select {...register('dirName')}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <input type="submit" />
    </form>
  );
};

export default DeleteDirForm;