import React from 'react'
import './css/RegistrationForm.css'
import { getFetchData } from '../../../Lib/fetch'
import { useState } from 'react'
import ModalWindow from '../../../ModalWindow/ModalWindow'

// Компонента - форма для регистрации
const RegistrationForm = props => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalHeader, setModalHeader] = useState('');
  const [modalBody, setModalBody] = useState('');

  const showModalWindow = (header, body) => {
    setModalHeader(header);
    setModalBody(body);
    setIsModalVisible(true);
  }

  // Отправляем данные на создание нового пользователя
  // GПеред отправкой делаем проверки. Если проверка не прошла, данные не отправляем
  const submitHandler = async event => {
    event.preventDefault();

    const username = event.target.login.value;
    const email = event.target.email.value;
    const password = event.target.pass.value;

    var re = /^[a-zA-Z][a-zA-Z0-9]*$/;
    if (!re.test(username)) {
      showModalWindow('Неверный формат', 'Имя пользователя должно состоять из латинских букв и цифр. Первый символ - буква');
      return;
    }

    if ((username.length < 4) || (username.length > 20)) {
      showModalWindow('Неверный формат', 'Длина имени пользователя должна быть от 4 до 20-ти символов');
      return;
    }

    re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/

    if (!re.test(email)) {
      showModalWindow('Неверный формат', 'Неверный формат почтового адреса');
      return;
    }

    // re = /^(?=.[A-Z])(?=.\d)(?=.[!@#$%^&])[A-Za-z0-9!@#$%^&*]+$/
    // re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d$@$!%*?&]).*$/

    // if (!re.test(password)) {
    //   showModalWindow('Неверный формат', 'В пароле должна быть как минимум одна заглавная буква, одна цифра и один специальный символ');
    //   return;
    // }

    if (password.length < 6) {
      showModalWindow('Неверный формат', 'Пароль должен состоять минимум из 6 символов');
      return;
    }

    const { response } = await getFetchData(
      'api/v1/auth/register/',
      'POST',
      {
        username: username,
        password: password,
        email: email,
        first_name: event.target.name.value,
        is_staff: false,
      }
    )

    if (response.ok) {
      props.destroyHandler();
    } else {
      showModalWindow('Внимание!', 'Регистрация не удалась, проверьте значения полей');
    }
  }

  return (
    <div>
      <form className='regisrationform-form' onSubmit={submitHandler}>
        <label htmlFor="login">ЛОГИН: </label>
        <input type="text" name='login' className='login' id='login' />
        <label htmlFor="pass">ПАРОЛЬ: </label>
        <input type="text" name='pass' className='pass' id='pass' />
        <label htmlFor="name">ИМЯ: </label>
        <input type="text" name='name' className='name' id='name' />
        <label htmlFor="email">ПОЧТА: </label>
        <input type="text" name='email' className='email' id='email' />
        <button type="submit">Зарегистрироваться</button>
        <button type='button' onClick={props.cancelHandler}>Отмена</button>
      </form>
      {isModalVisible && (
        <ModalWindow
          header={modalHeader}
          body={modalBody}
          closeHandler={() => setIsModalVisible(false)}>
        </ModalWindow>
      )}
    </div>
  )
}

export default RegistrationForm