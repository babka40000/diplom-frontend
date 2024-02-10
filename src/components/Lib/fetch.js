import Cookies from 'js-cookie';


// Функция служит для получения и отправки данных на сервер
// Использует fetch
export const getFetchData = async (path, method, requestData = '') => {
  const getFetchParam = () => {
    const params = {
      mode: 'cors',
      credentials: 'include',
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      }
    }

    if (method === 'POST' || method === 'PUT') {
      params.body = JSON.stringify(requestData)
    }

    return params;
  }

  const response = await fetch(process.env.REACT_APP_API_URL + path, getFetchParam());

  let data = {};

  if (response.ok) {
    if (method !== 'DELETE') {
      data = await response.json();
    }
  }

  return { response: response, data: data };
}