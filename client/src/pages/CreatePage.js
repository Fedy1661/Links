import React, { useState, useEffect, useContext } from 'react';
import { useHttp, useMessage } from '../hooks';
import { AuthContext } from '../context';
import { useHistory } from 'react-router-dom';

export default () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const message = useMessage();
  const { request, error, clearError } = useHttp();
  const [link, setLink] = useState('');
  useEffect(() => {
    window.M.updateTextFields();
  }, []);
  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);
  const pressHandler = async (e) => {
    if (e.key === 'Enter') {
      try {
        const data = await request(
          '/api/link/generate',
          'POST',
          {
            from: link
          },
          { Authorization: `Bearer ${auth.token}` }
        );
        history.push(`/detail/${data.link._id}`);
      } catch (e) {}
    }
  };
  return (
    <div className="row">
      <div className="col s8 offset-s2" style={{ paddingTop: '2rem' }}>
        <div className="input-field">
          <input
            type="text"
            placeholder="Вставьте ссылку"
            id="link"
            name="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyPress={pressHandler}
          />
          <label htmlFor="link">Введите ссылку</label>
        </div>
      </div>
    </div>
  );
};
