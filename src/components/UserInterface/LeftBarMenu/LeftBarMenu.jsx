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

  // Создаем новую папку с именем "Новая папка"
  const createNewFolderHandler = async event => {
    event.preventDefault();

    const lastParent = parent[parent.length - 1];

    const { response } = await getFetchData(
      'api/v1/filesandfolders/',
      'POST',
      {
        name: 'Не важно что, все равно в Django переопределю',
        is_folder: true,
        parent: lastParent.id,
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