import React from 'react'
import Login from '../Login/Login'
import { useState } from 'react'
import './css/Anonym.css'

// Компонента для отображения пользователя не вошедшего в систему
const Anonym = () => {
  const [loginShow, setLoginShow] = useState(false);

  // Нажали на кнопку "Войти"
  const loginHandler = event => {
    event.preventDefault();
    setLoginShow(true);
  }

  // Закрыли окно для логина
  const destroyLoginWindow = () => {
    setLoginShow(false);
  }

  return (
    <div>
      <b>Вы не вошли в систему</b>
      <button className='anonym-button' onClick={loginHandler}>Войти</button>
      {loginShow ? <Login destroyHandler={destroyLoginWindow}/> : ''}
    </div>
  )
}

export default Anonym