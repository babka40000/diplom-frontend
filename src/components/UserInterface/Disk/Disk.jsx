import React from 'react'
import './css/Disk.css'
import { useEffect } from 'react'
import Folder from './Folder/Folder'
import { useSelector, useDispatch } from 'react-redux'
import File from './File/File'
import { getFetchData } from '../../Lib/fetch'


// Компонента для отображение списка файлов и папок
const Disk = () => {
  const loginUser = useSelector(state => state.isLogin);
  const isRefreshFilesAndFolfers = useSelector(state => state.isRefreshFilesAndFolfers);
  const parent = useSelector(state => state.parent);
  const filesAndFolders = useSelector(state => state.filesAndFolders);
  const diskMode = useSelector(state => state.diskMode);

  const dispatch = useDispatch();

  // Функция получает список файлов и папок, сортируем их и передаем в reducer
  const getFilesAndFoldersFromServer = async path => {
    const { response, data } = await getFetchData(path, 'GET');

    if (response.ok) {
      data.sort((a, b) => b.is_folder - a.is_folder);
     
      dispatch({
        type: 'ADD_FILESANDFOLDERS_STRUCT',
        payload: data,
      })
    }
  }

  // При создании компонента получаем список файлов и папок, сортируем их и передаем в reducer
  useEffect(() => {
    getFilesAndFoldersFromServer('api/v1/filesandfolders/');
  }, []);

  // Получаем новые список файлов и папок с сервера только когда нам нужно
  useEffect(() => {
    if (isRefreshFilesAndFolfers.refresh) {
      const lastParent = parent[parent.length - 1];

      // Если у нас включен режим просмотра чужик файлов в GET запрос дополнительно передаем параметр usr
      // Также в параметры запроса передаем родителя (каталог), если это требуется
      if (diskMode.active) {
        if (lastParent.id === null) {
          getFilesAndFoldersFromServer('api/v1/filesandfolders/?usr=' + loginUser.id);
        } else {
          getFilesAndFoldersFromServer('api/v1/filesandfolders/?usr=' + loginUser.id + '&parent=' + lastParent.id);
        }
      } else {
        if (lastParent.id === null) {
          getFilesAndFoldersFromServer('api/v1/filesandfolders/');
        } else {
          getFilesAndFoldersFromServer('api/v1/filesandfolders/?parent=' + lastParent.id);
        }
      }

      dispatch({
        type: 'SET_REFRESHFILESANDFOLDERS_VALUE', payload: {
          refresh: false,
        }
      })
    }
  }, [isRefreshFilesAndFolfers.refresh, dispatch]);

  // При двойном клике на папку меняем родителя и переполучаем данные с сервера 
  const changeFolder = (id, parentId) => {
    dispatch({
      type: 'ADD_PARENT_VALUE',
      payload: {
        id: id,
        parentId: parentId,
      }
    })

    dispatch({
      type: 'SET_REFRESHFILESANDFOLDERS_VALUE',
      payload: {
        refresh: true,
      }
    })
  }

  // При нажатии кнопки "назад" поднимаемся на один уровень иерархии папок вверх и переполучаем данные с сервера
  const backHandler = event => {
    event.preventDefault();

    dispatch({
      type: 'DELETE_PARENT_VALUE',
    })

    dispatch({
      type: 'SET_REFRESHFILESANDFOLDERS_VALUE',
      payload: {
        refresh: true,
      }
    })
  }

  // Если мы кликаем на "пустое" место, выделение с папки или файла снимается, если оно было
  const onEmptyPlaceClickHandler = event => {
    event.preventDefault();

    if (event.target.nodeName === 'DIV') {
      dispatch({
        type: 'CLEAN_ALL_FILEORFOLDER_ACTIVE_STATE',
      })
    }
  }

  return (
    <div className='disk-main' onClick={onEmptyPlaceClickHandler}>
      {parent.length === 1 ? '' : <button className='disk-button-back' onClick={backHandler}>НАЗАД</button>}
      <div className='disk-folders'>
        {loginUser.isLogin ? filesAndFolders.map(element => element.is_folder ?
          <Folder descr={element.name} key={element.id} id={element.id} changeFolder={changeFolder} parent={element.parent} active={element.active} /> :
          <File descr={element.name} key={element.id} id={element.id} parent={element.parent} active={element.active} />) : ''}
      </div>
    </div>
  )
}

export default Disk