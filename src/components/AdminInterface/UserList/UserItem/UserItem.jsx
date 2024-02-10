import React from 'react'
import './css/UserItem.css'

// Компонента для вывода одного пользователя в спиcке компоненты UserList
const UserItem = props => {
  return (
    <div className='user-item-main'>
      <div className='user-item-username'>{props.username}</div>
      <div className='user-item-name'>{props.name}</div>
      <div className='user-item-isadmin'>{props.admin ? 'ДА' : 'НЕТ'}</div>
      <div className='user-item-isadmin'>{props.fileAmount}</div>
      <div className='user-item-isadmin'>{props.fileSize}</div>
      <button className='user-item-redo-button' onClick={props.redoUserHandler} id={props.id}>Изменить признак администратора</button>
      <button className='user-item-delete-button' onClick={props.deleteUserHandler} id={props.id}>Удалить</button>
      <button className='user-item-goto-button' onClick={props.gotoDiskHandler} id={props.id} name={props.username}>Перейти к файлам</button>
    </div>
  )
}

export default UserItem