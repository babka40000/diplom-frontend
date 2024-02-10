import React from 'react'
import UserItem from './UserItem/UserItem'
import './css/UserList.css'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getFetchData } from '../../Lib/fetch';

// Компонента для вывода списка пользователей и инструментов управления ими в административном интерфейсе
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isNewUserWindow, setIsNewUserWindow] = useState(false);

  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.isLogin);

  // Функция получения списка пользователей с сервера
  const getUsersFromServer = async () => {
    const { response, data } = await getFetchData('api/v1/adminoperations/', 'GET');

    if (response.ok) {
      setUsers(data);
    }
  }

  // При открытии компоненты получаем список пользователей с сервера
  useEffect(() => {
    getUsersFromServer();
  }, []);

  // При нажатии кнопки создания нового пользователя открываем окно для ввода основных параметров
  const newUserHandler = event => {
    event.preventDefault();
    setIsNewUserWindow(true);
  }

  // Создание нового пользователя (при нажатии кнопки ОК диалогового окна)
  const newUserOnSubmitHandler = async event => {
    event.preventDefault();

    const { response } = await getFetchData(
      'api/v1/auth/register/',
      'POST',
      {
        username: event.target.username.value,
        password: event.target.password.value,
        email: event.target.email.value,
        first_name: event.target.name.value,
        is_staff: event.target.isadmin.checked,
      }
    );

    if (response.ok) {
      getUsersFromServer();
    }

    setIsNewUserWindow(false);
  }

  // При нажатии кнопки "Отмена" диалоговое окно создания нового пользователя закрывается
  const newUserCancelHandler = event => {
    event.preventDefault();
    setIsNewUserWindow(false);
  }

  // Удаление пользователя
  const deleteUserHandler = async event => {
    event.preventDefault();
    const { response } = await getFetchData('api/v1/adminoperations/' + event.target.id + '/', 'DELETE');
    if (response.ok) {
      getUsersFromServer();
    }
  }

  // Переход к файлам пользователя
  const gotoDiskHandler = event => {
    event.preventDefault();

    // Убираем признак администрирования, чтобы перейти в интерфейс диска
    dispatch({
      type: 'SET_ADMINMODE_STATE', payload: {
        active: false,
      }
    })

    // Устанавливаем специальный режим "DiskMode".
    // В нем мы сможем отправлять серверу специальные запросы для получения данных о файлах других пользователей
    dispatch({
      type: 'SET_DISKMODE_STATE', payload: {
        active: true,
        user: currentUser.name,
      }
    })

    // Меняем текущего пользователя на пользователя, чьи файлы мы хотим посмотреть
    dispatch({
      type: 'SET_ISLOGIN_VALUE', payload: {
        isLogin: true,
        name: event.target.name,
        id: event.target.id,
        isAdmin: false,
      }
    })

    // Перечитываем файлы из хранилища
    dispatch({
      type: 'SET_REFRESHFILESANDFOLDERS_VALUE', payload: {
        refresh: true,
      }
    })
  }

  // Выходим из режима администрирования пользователей, возвражаемся к своим файлам
  const adminExitHandler = event => {
    event.preventDefault();
    dispatch({
      type: 'SET_ADMINMODE_STATE', payload: {
        active: false,
      }
    })
  }

  // Изменение признака "администратор" у пользователя
  const redoUserHandler = async event => {
    event.preventDefault();
    const findUser = users.find(item => item.id == event.target.id);
    
    const { response } = await getFetchData(
      'api/v1/adminoperations/' + event.target.id + '/',
      'PUT',
      { 
        username: findUser.username,
        is_staff: !findUser.is_staff,
      });
    
    if (response.ok) {
      getUsersFromServer();
    }
  }

  return (
    <div>
      <h1>Пользователи</h1>
      <button className='user-list-new-user-button' onClick={newUserHandler}>Новый пользователь</button>
      <button className='user-list-button' onClick={adminExitHandler}>Выйти из режима администрирования</button>
      <div className='user-list-title'>
        <div className='user-list-username'>Логин</div>
        <div className='user-list-name'>Имя</div>
        <div className='user-list-isadmin'>Администратор</div>
        <div className='user-list-amount'>Количество файлов</div>
        <div className='user-list-size'>Общий размер файлов</div>
      </div>
      {users.map(element =>
        <UserItem
          username={element.username}
          name={element.first_name}
          admin={element.is_staff || element.is_superuser}
          key={element.id}
          id={element.id}
          fileAmount={element.files_count}
          fileSize={element.file_size_sum}
          deleteUserHandler={deleteUserHandler}
          redoUserHandler={redoUserHandler}
          gotoDiskHandler={gotoDiskHandler}>
        </UserItem>
      )}
      {isNewUserWindow &&
        <form className='user-list-new-user-form' onSubmit={newUserOnSubmitHandler}>
          <label htmlFor="username">Логин</label>
          <input type="text" name='username' id='username' />
          <label htmlFor="name">Имя пользователя</label>
          <input type="text" name='name' id='name' />
          <label htmlFor="password">Пароль</label>
          <input type="text" name='password' id='password' />
          <label htmlFor="email">e-mail</label>
          <input type="text" name='email' id='email' />
          <input type="checkbox" name='isadmin' id='isadmin' />
          <label htmlFor="isadmin">Администратор</label>
          <button>Создать пользователя</button>
          <button type='button' onClick={newUserCancelHandler}>Отмена</button>
        </form>
      }
    </div>
  )
}

export default UserList