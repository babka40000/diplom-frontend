import React from 'react'
import { useState, useEffect } from 'react';
import fileDownload from 'js-file-download'
import { getFetchData } from '../../Lib/fetch';

// Компонента обнаруживает переданную в командную строку ссылку и скачивает файл по этой ссылке
const DownloadFileLink = props => {

  // Дополнительный запрос. Не пользуюсь getFetchData потому что в данном запросе возвращается blob, а не json
  const getFileFromServer = async data => {
    if ('file' in data[0]) {
      const res = await fetch(data[0].file,
        {
          mode: 'cors',
          credentials: 'include',
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        }
      )

      if (res.ok) {
        const blobData = await res.blob();
        fileDownload(blobData, data[0].name);
      }
    }
  }

  // Процедура скачивания файла
  // Сначала мы по ссылке ищем в БД расположение
  // А потом вторым запросом скачиваем файл
  const downloadFile = async linkPath => {
    const { response, data } = await getFetchData('api/v1/filesandfolders/?link=' + linkPath.replace('/', ''), 'GET');

    if (response.ok) {
      getFileFromServer(data);
    }
  }

  // При создании компонента проверяет, передана ли дополнительная ссылка и запускает процедуру скачивания файла
  useEffect(() => {
    const linkPath = props.link;

    if (linkPath !== undefined) {
      downloadFile(linkPath);
    }
  }, []);

  return (
    <div></div>
  )
}

export default DownloadFileLink