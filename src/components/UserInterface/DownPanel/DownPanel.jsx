import React from 'react'
import './css/DownPanel.css'
import { useSelector } from 'react-redux'

const DownPanel = () => {
  const filesAndFolders = useSelector(state => state.filesAndFolders);

  return (
    <div className='down-panel-main'>
      {filesAndFolders.map(element => element.active &&
        <div className='down-panel-main'>
          <div className='down-panel-item'>Размер файла: {element.file_size}</div>
          <div className='down-panel-item'>Дата создания: {element.uploaded_on}</div>
          <div className='down-panel-item'>Дата последнего скачивания: {element.last_download}</div>
          <div className='down-panel-item'>Комментарий: {element.remark}</div>
        </div>
      )}
    </div>
  )
}

export default DownPanel