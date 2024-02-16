import React from 'react'
import './css/UpBarMenu.css'
import UpBarMenuItem from './UpBarMenuItem/UpBarMenuItem';
import { useState } from 'react'
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import fileDownload from 'js-file-download'
import { getFetchData } from '../../Lib/fetch'

// Функция делает случайную комбинацию из латинских букв
function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

// Компонента верхнего меню
// Показывается при выделении файла или папки
// Для папки это "Переименовать" и "Удалить"
// Для файла кроме таких же двух пунктов добавляется "Скачать файл" и "Поделиться" 
const UpBarMenu = () => {
  const [renameWindow, setRenameWindow] = useState(false);
  const [downloadLinkActive, setDownloadLinkActive] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');

  const dispatch = useDispatch();

  const filesAndFolders = useSelector(state => state.filesAndFolders)
  const diskMode = useSelector(state => state.diskMode)
  const currentUser = useSelector(state => state.isLogin)

  // Открывает окно для переименования файла
  const renameFileOrFolder = event => {
    event.preventDefault();
    setRenameWindow(true);
  }

  // Закрывает окно для переименования файла
  const destroyRenameWindow = () => {
    setRenameWindow(false);
  }

  // Удаляет файл/папку и дает команду reduсer, что файл удален
  const deleteFileOrFolder = async event => {
    event.preventDefault();

    for (const fileOrFolder of filesAndFolders) {
      if ('active' in fileOrFolder) {
        if (fileOrFolder.parent === null) {
          const { response } = await getFetchData('api/v1/filesandfolders/' + fileOrFolder.id + '/', 'DELETE');
          if (response.ok) {
            dispatch({
              type: 'DELETE_FILEORFOLDER',
            })
          }
        } else {
          const { response } = await getFetchData('api/v1/filesandfolders/' + fileOrFolder.id + '/?parent=' + fileOrFolder.parent, 'DELETE');
          if (response.ok) {
            dispatch({
              type: 'DELETE_FILEORFOLDER',
            })
          }
        }
      }
    }
  }

  // Функция проверят, выделен ли файл или папка
  const isActiveElementFile = () => {
    for (const fileOrFolder of filesAndFolders) {
      if ('active' in fileOrFolder) {
        if (!fileOrFolder.is_folder) {
          return true;
        }
      }
    }

    return false
  }

  // Отдельный запрос на скачивание файла
  const getFileFromServer = async response => {
    if ('file' in response) {
      const result = await fetch(response.file,
        {
          mode: 'cors',
          credentials: 'include',
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken'),
          }
        }
      )

      if (result.ok) {
        const data = await result.blob();
        fileDownload(data, response.name);
      }
    }
  }
  
  // Скачиваем выделенный файл
  // Сначала ищем ссылку на файл в БД по заданным параметрам
  // А потом по ссылке скачиваем файл
  const downloadFile = async event => {
    event.preventDefault();

    for (const fileOrFolder of filesAndFolders) {
      if ('active' in fileOrFolder) {
        // С помощью запроса получаем ссылку на скачиваемый файл
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

        const { response, data } = await getFetchData(path, 'GET');
        if (response.ok) {
          // Отдельным запросом скачивем файл по ссылке
          getFileFromServer(data);

          // После скачки файла обновляем запись в базе "дата последней скачки файла"
          if (fileOrFolder.parent === null) {
            path = 'api/v1/filesandfolders/' + fileOrFolder.id + '/';
          } else {
            path = 'api/v1/filesandfolders/' + fileOrFolder.id + '/?parent=' + fileOrFolder.parent;
          }

          const now = new Date();
  
          await getFetchData(
            path,
            'PUT',
            {
              name: fileOrFolder.name,
              is_folder: fileOrFolder.is_folder,
              last_download: now,
            });
        }
      }
    }
  }
 
  // Делимся ссылкой для скачивания
  // Для этого генерируем ссылку из 10 случайных символов и отправляем ее на сервер, чтобы "прикрепить" к файлу
  const shareFile = async event => {
    event.preventDefault();
    const idLink = makeid(10);

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

        const { response } = await getFetchData(path, 'PUT', { name: fileOrFolder.name, is_folder: fileOrFolder.is_folder, link: idLink });

        if (response.ok) {
          setDownloadLink(process.env.REACT_APP_LINK_URL + '?link=' + idLink);
          setDownloadLinkActive(true);
        }
      }
    }
  }

  return (
    <div className='upbarmenu-main'>
      {!diskMode.active && <UpBarMenuItem name='Переименовать' onClickHandler={renameFileOrFolder} action={renameWindow} destroyRenameWindow={destroyRenameWindow} />}
      {!diskMode.active && <UpBarMenuItem name='Удалить' onClickHandler={deleteFileOrFolder} />}
      {isActiveElementFile() ? <UpBarMenuItem name='Скачать файл' onClickHandler={downloadFile} /> : ''}
      {isActiveElementFile() ? <UpBarMenuItem name='Поделиться' onClickHandler={shareFile} /> : ''}
      {downloadLinkActive ?
        <div className='share-link-window'>
          <p>Поделиться ссылкой на скачивание: {downloadLink}</p>
        </div> : ''}
    </div >
  )
}

export default UpBarMenu