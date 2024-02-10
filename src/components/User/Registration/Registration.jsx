import React from 'react'
import './css/Registration.css'
import { useState } from 'react'
import RegistrationForm from './RegistrationForm/RegistrationForm'

// Компонента для регистрации нового пользователя
const Registration = () => {
  const [showReg, setShowReg] = useState(false);

  // Открываем окно для регистрации
  const registrationHandler = event => {
    event.preventDefault();
    setShowReg(true); 
  }

  // Закрываем окно для регистрации
  const cancelHandler = event => {
    event.preventDefault();
    setShowReg(false);
  }

  // Закрываем окно для регистрации
  const destroyHandler = () => {
    setShowReg(false);
  }

  return (
    <div>
      <button className='registration-button' onClick={registrationHandler}>Зарегистрироваться</button>
      {showReg ? <RegistrationForm cancelHandler={cancelHandler} destroyHandler={destroyHandler} /> : ''}
    </div>
  )
}

export default Registration