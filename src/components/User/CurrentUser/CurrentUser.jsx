import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './css/CurrentUser.css'
import { getFetchData } from '../../Lib/fetch'

// Компонента отобрашает пользователя вошедшего в систему
const CurrentUser = () => {
  const currentUser = useSelector(state => state.isLogin);
  const dispatch = useDispatch();
  const diskMode = useSelector(state => state.diskMode);

  // Выход из системы
  const exitHandler = async event => {
    event.preventDefault();

    const { response } = await getFetchData('api/v1/auth/logout/', 'GET');
    if (response.ok) {
      dispatch({
        type: 'SET_ISLOGIN_VALUE', payload: {
          isLogin: false,
          name: '',
          isAdmin: false,
        }
      });
    }
  }

  // Переход в режим администрирования к управлению пользователями
  const adminHandler = event => {
    event.preventDefault();
    dispatch({
      type: 'SET_ADMINMODE_STATE', payload: {
        active: true,
      }
    });
  }

  // Выход из режима просмотра чужого диска
  const diskModeExitHandler = event => {
    event.preventDefault();

    dispatch({
      type: 'SET_ADMINMODE_STATE', payload: {
        active: true,
      }
    });
    
    dispatch({
      type: 'SET_DISKMODE_STATE', payload: {
        active: false,
      }
    });
  }

  return (
    <div className='currentuser-main'>
      {diskMode.active && <button className='currentuser-button' onClick={diskModeExitHandler}>Выйти из режима просмотра чужого диска</button>}
      {currentUser.isAdmin && <button className='currentuser-button' onClick={adminHandler}>Администрирование пользователей</button>}
      <div><b>Пользователь: {currentUser.name}</b></div>
      <button className='currentuser-button' onClick={exitHandler}>Выйти</button>
    </div>
  )
}

export default CurrentUser