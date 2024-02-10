import React from 'react'
import './css/User.css'
import { useEffect } from 'react'
import Anonym from './Anonym/Anonym'
import CurrentUser from './CurrentUser/CurrentUser'
import { useSelector, useDispatch } from 'react-redux'
import Registration from './Registration/Registration'
import { getFetchData } from '../Lib/fetch'

// Компонента, объединяющая все компоненты работы с пользователем
// Такие как регистрация, войти в систему, выйти из системы итд
const User = () => {
  const isLogin = useSelector(state => state.isLogin);
  const dispatch = useDispatch();
  const diskMode = useSelector(state => state.diskMode);

  // Получаем текущего пользователя. Если пользователь не вошел в систему отмечаем это в reducer
  const getUser = async () => {
    const { response, data } = await getFetchData('api/v1/auth/getcurrentuser/', 'GET');
    if (response.ok) {
      dispatch({
        type: 'SET_ISLOGIN_VALUE', payload: {
          isLogin: true,
          name: data.name,
          isAdmin: data.admin,
          id: data.id,
        }
      })
    } else {
      dispatch({
        type: 'SET_ISLOGIN_VALUE', payload: {
          isLogin: false,
          name: '',
          isAdmin: false,
          id: '',
        }
      })
    }
  }

  // При создании компонента запрашиваем текущего пользователя (если не diskMode режим)
  useEffect(() => {
    if (!diskMode.active) {
      getUser();
    }
  }, []);

  return (
    <div className='user-main'>
      {isLogin.isLogin ? <CurrentUser /> : <Anonym />}
      <Registration />
    </div>
  )
}

export default User