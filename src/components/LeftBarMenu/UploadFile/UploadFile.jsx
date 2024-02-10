import React from 'react'
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';

const inputStyle = { display: 'none' };

// Компонента с помощью которой можно загрузить файл в хранилище
const UploadFile = () => {
  const dispatch = useDispatch();

  const inputRef = React.useRef(null);

  const parent = useSelector(state => state.parent)

  const [commentWindow, setCommentWindow] = useState(false);
  const [files, setFiles] = useState([]);

  // Использую не стандартную функцию getFetchData
  // Потому что запрос не стандартный
  // Тело передается как formdata, а не как JSON
  const getFetchData = async (path, method, requestData = '') => {
    const getFetchParam = () => {
      const params = {
        mode: 'cors',
        credentials: 'include',
        method: method,
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken')
        }
      }

      if (method === 'POST') {
        params.body = requestData;
      }

      return params;
    }

    return await fetch('http://localhost:8000/' + path,
      getFetchParam()
    )
  }
   
  // Отправляем выбранный файл на сервер и обновляем список файлов и папок
  const handleFileChange = async event => {
    event.preventDefault();
        
    // const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      let lastParentid = parent[parent.length - 1].id;

      if (lastParentid === null) {
        lastParentid = '';
      }

      const formData = new FormData();
      
      formData.append('name', file.name);
      formData.append('is_folder', false);
      formData.append('parent', lastParentid);
      formData.append('file', file);
      formData.append('file_size', file.size);
      formData.append('remark', event.target.comment.value);

      const response = await getFetchData(
        'api/v1/filesandfolders/',
        'POST',
        formData,
      )

      if (response.ok) {
        dispatch({
          type: 'SET_REFRESHFILESANDFOLDERS_VALUE', payload: {
            refresh: true,
          }
        })
      } 
    }
    setCommentWindow(false);
  };

  // Открываем окно для ввода коментария
  const openCommentWindow = event => {
    event.preventDefault();
    setFiles(event.target.files);
    setCommentWindow(true);
  }

  // Открываем диалоговое окно для выбора файла
  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <input ref={inputRef} style={inputStyle} type="file" onChange={openCommentWindow} />
      <button onClick={handleButtonClick}>Загрузить файл</button>
      {commentWindow && (
        <form onSubmit={handleFileChange}>
          <label htmlFor="comment">Введите комментарий</label>
          <input type="text" name='comment' id='comment' />
          <button>ОК</button>
        </form>
      )}
    </div>
  );
};

export default UploadFile