import React from 'react'
import './css/ModalWindow.css'

// Компонента модального окна с заголовком и телом
const ModalWindow = props => {
  return (
    <div className='modal-window-main'>
      <div className='modal-windows-header'>
        <h3>{props.header}</h3>
      </div>
      <div className='modal-windows-body'>
        {props.body}
      </div>
      <button onClick={props.closeHandler}>Закрыть</button>
    </div>
  )
}

export default ModalWindow