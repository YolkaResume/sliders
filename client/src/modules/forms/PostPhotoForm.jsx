import { useForm } from 'react-hook-form';
import apiHandler from '../api/apiHandler';
import "./Forms.css";


const PostPhotoForm = ({options})=>{

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();

      return(
    <form onSubmit={handleSubmit((data) => apiHandler.postPhoto(data))}>
        <div>{"Dir name"}</div>
        <select {...register('dirName')}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
          <div>{"File"}</div>
          <input type='file' {...register('file')} />
          <input type="submit" />
        </form>
        )
}
export default PostPhotoForm