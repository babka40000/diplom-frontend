import './css/Login.css'
import { useDispatch } from 'react-redux';
import { useState } from 'react'
import { getFetchData } from '../../Lib/fetch';

// Компонента - окно для логина в систему
const Login = props => {
  const dispatch = useDispatch();

  const [errorDescr, setErrorDescr] = useState('');

  // Отправляем на сервер запрос на авторизацию
  const SubmitHandler = async event => {
    event.preventDefault();

    const username = event.target.login.value;
    const password = event.target.pass.value;

    const { response, data } = await getFetchData(
      'api/v1/auth/login/',
      'POST',
      {
        username: username,
        password: password,
      }
    )

    if (response.ok) {
      dispatch({
        type: 'SET_ISLOGIN_VALUE', payload: {
          isLogin: true,
          name: data.name,
          isAdmin: data.admin,
        }
      });

      dispatch({
        type: 'SET_REFRESHFILESANDFOLDERS_VALUE', payload: {
          refresh: true,
        }
      });
    } else {
      setErrorDescr('Авторизация не удалась');
    }
  };

  // Закрываем окно логина
  const cancelHandler = event => {
    event.preventDefault();
    props.destroyHandler();
  }

  return (
    <div className='login-main'>
      <div>Авторизация в системе</div>
      <form className='login-form' onSubmit={SubmitHandler}>
        <div className='login-login'>
          <label htmlFor="login">Имя пользователя</label>
          <input className='login' name='login' type="text" id='login' />
        </div>
        <div className='flex'>
          <label htmlFor="pass">Пароль</label>
          <input className='pass' name='pass' type="text" id='pass' />
        </div>
        <button className='flex' type="submit">Войти!</button>
        <button className='flex' onClick={cancelHandler}>Отмена</button>
      </form>
      <div className='error_descr'>{errorDescr}</div>
    </div>
  )
}

export default Login