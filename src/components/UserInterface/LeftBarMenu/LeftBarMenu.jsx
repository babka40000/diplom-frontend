import React from 'react'
import './css/LeftBarMenu.css'
import LeftBarMenuItem from './LeftBarMenuItem/LeftBarMenuItem';
import { useDispatch, useSelector } from 'react-redux';
import UploadFile from './UploadFile/UploadFile';
import { getFetchData } from '../../Lib/fetch'

// Компонента левого меню пользовательского интерфейса
const LeftBarMenu = () => {
  const dispatch = useDispatch();

  const parent = useSelector(state => state.parent);
  const currentUser = useSelector(state => state.isLogin);
  const diskMode = useSelector(state => state.diskMode)


  // Создаем новую папку с именем "Новая папка"
  const createNewFolderHandler = async event => {
    event.preventDefault();

    const lastParent = parent[parent.length - 1];

    let path = '';

    if (diskMode.active) {
      path = 'api/v1/filesandfolders/?usr=' + currentUser.id;
    } else {
      path = 'api/v1/filesandfolders/';
    }

    const { response } = await getFetchData(
      path,
      'POST',
      {
        name: 'Не важно что, все равно в Django переопределю',
        is_folder: true,
        parent: lastParent.id,
        user: currentUser.id,
      });
    
    if (response.ok) {
      dispatch({
        type: 'SET_REFRESHFILESANDFOLDERS_VALUE', payload: {
          refresh: true,
        }
      })
    }
  }

  // В компоненте 2 пункта - создать новую папку и загрузить файл
  return (
    <div className='left-menu-main'>
      <LeftBarMenuItem name='Создать папку' onClickHandler={createNewFolderHandler} />
      <UploadFile />
    </div>
  )
}

export default LeftBarMenu