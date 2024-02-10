import React from 'react'
import './css/Folder.css'
import { useDispatch } from 'react-redux'

// Компонента для отображени папки в компоненте Disk
const Folder = props => {
  const dispatch = useDispatch();

  //  При двойном клике на папку вызываем процедуру изменения из родительского компонента
  const folderDoubleClickHandler = event => {
    event.preventDefault();

    if ('parent' in event.target.dataset) {
      props.changeFolder(event.target.id, event.target.dataset['parent']);
    } else {
      props.changeFolder(event.target.id, null);
    }
  }

  // При нажатии на папку обнуляем все выделения других элементов и выделяем текущую папку
  const folderClickHandler = event => {
    event.preventDefault();

    dispatch({
      type: 'CLEAN_ALL_FILEORFOLDER_ACTIVE_STATE',
    })

    dispatch({
      type: 'SET_FILEORFOLDER_ACTIVE_STATE',
      payload: {
        id: event.target.id,
      }
    })
  }

  return (
    <div className={props.active ? 'main-folder main-folder-activ' : 'main-folder'}>
      <img src='/img/folder.png' alt='folder' className='folder-img' id={props.id} onDoubleClick={folderDoubleClickHandler}
        onClick={folderClickHandler} data-parent={props.parent}></img>  
      <div className='folder-descr'>{props.descr}</div>
    </div>
  )
}

export default Folder