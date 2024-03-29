import React, { useEffect } from 'react';
import { useState } from 'react';
import { useHttp, useMessage } from '../hooks';
import { useContext } from 'react';
import { AuthContext } from '../context';

export default () => {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const { loading, request, error, clearError } = useHttp();
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);
  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  useEffect(() => {
    window.M.updateTextFields();
  }, []);
  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', { ...form });
      message(data.message);
    } catch (error) {}
  };
  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', { ...form });
      auth.login(data.token, data.userId);
    } catch (error) {}
  };
  return (
    <div className="">
      <div className="row">
        <div className="col s6 offset-s3">
          <h1>Сократите ссылку</h1>
          <div className="card blue darken-1">
            <div className="card-content white-text">
              <span className="card-title">Авторизация</span>
              <div>
                <div className="input-field">
                  <input
                    placeholder="Введите E-mail"
                    id="email"
                    type="text"
                    name="email"
                    className="yellow-input"
                    value={form.email}
                    onChange={changeHandler}
                  />
                  <label htmlFor="email">Почта</label>
                </div>

                <div className="input-field">
                  <input
                    placeholder="Введите пароль"
                    id="password"
                    type="password"
                    name="password"
                    className="yellow-input"
                    value={form.password}
                    onChange={changeHandler}
                  />
                  <label htmlFor="password">Пароль</label>
                </div>
              </div>
            </div>
            <div className="card-action">
              <button
                onClick={loginHandler}
                className="btn yellow darken-4"
                style={{ marginRight: 10 }}
                disabled={loading}
              >
                Войти
              </button>
              <button
                onClick={registerHandler}
                disabled={loading}
                className="btn grey lighten-1 black-text"
              >
                Регистрация
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
