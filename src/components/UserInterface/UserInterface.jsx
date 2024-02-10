import React from 'react'
import './css/UserInterface.css'
import LeftBarMenu from './LeftBarMenu/LeftBarMenu'
import Disk from './Disk/Disk';
import User from './User/User';
import UpBarMenu from './UpBarMenu/UpBarMenu';
import DownloadFileLink from './DownloadFileLink/DownloadFileLink';
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom';
import DownPanel from './DownPanel/DownPanel';

// Основная компонента для пользовательского интерфейса. Все пользователи изначально попадают в нее
// Администраторы могут изменить режим на административный
const UserInterface = () => {
  const filesAndFolders = useSelector(state => state.filesAndFolders);
  const currentUser = useSelector(state => state.isLogin)
  const diskMode = useSelector(state => state.diskMode)

  const location = useLocation();

  // Функция проверяет, есль ли в данный момент выделенная папка или файл
  const isActiveFileOrFolder = () => {
    for (const fileOrFolder of filesAndFolders) {
      if ('active' in fileOrFolder) {
        return true;
      }
    }
    return false;
  }

  return (
    <div className='app-main'>
      {currentUser.isLogin && !diskMode.active ? <LeftBarMenu /> : ''}
      <div className='app-right'>
        <div className='app-top'>
          <div className='app-up-bar-menu'>
            {isActiveFileOrFolder() ? <UpBarMenu /> : ''}
          </div>
          <div className='app-user'>
            <User />
          </div>
        </div>
        <Disk />
        {isActiveFileOrFolder() && <DownPanel />}
        <DownloadFileLink link={location} />
      </div>
    </div>
  )
}

export default UserInterface