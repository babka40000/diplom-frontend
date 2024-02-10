import React from 'react'
import './css/File.css'
import { useDispatch } from 'react-redux'

// Компонента для отображения файла в компоненте Disk
const File = props => {
  const dispatch = useDispatch();

  // При нажатии на иконку файла снимается выделение со всех других обьектов и выделяется данный файл
  const fileClickHandler = event => {
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
    <div className={props.active ? 'main-file main-file-activ' : 'main-file'}>
      <img src='/img/file.png' alt='file' className='file-img' id={props.id}
        onClick={fileClickHandler} data-parent={props.parent}></img>
      <div className='file-descr'>{props.descr}</div>
    </div>
  )
}

export default File