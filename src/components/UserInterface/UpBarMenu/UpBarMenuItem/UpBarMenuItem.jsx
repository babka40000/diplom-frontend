import React from 'react'
import './css/UpBarMenuPoint.css'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getFetchData } from '../../../Lib/fetch';

// Компонента - пункт в верхнем меню
const UpBarMenuItem = props => {
  const filesAndFolders = useSelector(state => state.filesAndFolders)
  const diskMode = useSelector(state => state.diskMode)
  const currentUser = useSelector(state => state.isLogin)
  
  const dispatch = useDispatch();

  // Переименовываем папку или файл
  const submitHandler = async event => {
    event.preventDefault();
  
    for (const fileOrFolder of filesAndFolders) {
      if ('active' in fileOrFolder) {
        let path = '';

        if (fileOrFolder.parent === null) {
          if (diskMode.active) {
            path = 'api/v1/filesandfolders/' + fileOrFolder.id + '/?usr=' + currentUser.id;
          } else {
            path = 'api/v1/filesandfolders/' + fileOrFolder.id + '/';
          } 
        } else {
          if (diskMode.active) {
            path = 'api/v1/filesandfolders/' + fileOrFolder.id + '/?usr=' + currentUser.id + '&parent=' + fileOrFolder.parent;
          } else {
            path = 'api/v1/filesandfolders/' + fileOrFolder.id + '/?parent=' + fileOrFolder.parent;
          }
        }

        const { response } = await getFetchData(
          path,
          'PUT',
          {
            name: event.target.newName.value,
            is_folder: fileOrFolder.is_folder
          });
        
        if (response.ok) {
          dispatch({
            type: 'RENAME_FILEORFOLDER',
            payload: {
              name: event.target.newName.value,
            }
          })
        }
      }
    }

    props.destroyRenameWindow();
  }

  // Закрывает окно с переименованием
  const cancelHandler = event => {
    event.preventDefault();
    props.destroyRenameWindow();
  }

  return (
    <div className='up-bar-menu-pount-main'>
      <button onClick={props.onClickHandler}>{props.name}</button>
      {props.action ?
        <form onSubmit={submitHandler} className='rename-form'>
          <label htmlFor='newName'>Новое имя:</label>
          <input type='text' name='newName' />
          <button type='submit'>ОК</button>
          <button type="button" onClick={cancelHandler}>Отмена</button>
        </form> : ''}
    </div>
  )
}

export default UpBarMenuItem