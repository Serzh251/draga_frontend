import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useLoginMutation } from '../../api/api';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/userSlice';
import { parseJwt } from '../../utils/token';
import VirtualKeyboard from '../tolls/VirtualKeyboard';

const Login = ({ onLoginSuccess }) => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
  });
  const [activeField, setActiveField] = useState(null); // Текущее активное поле
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [errMsg, setErrMsg] = useState(''); // Сообщение об ошибке

  const handleFocus = (field) => {
    setActiveField(field); // Устанавливаем активное поле
    setShowKeyboard(true); // Показываем клавиатуру
  };

  const handleKeyPress = (key) => {
    if (!activeField) return;

    let newValue = formValues[activeField];

    if (key === 'Backspace') {
      newValue = newValue.slice(0, -1); // Удаляем последний символ
    } else if (key === 'Space') {
      newValue += ' '; // Добавляем пробел
    } else {
      newValue += key; // Добавляем символ
    }

    // Обновляем состояние
    setFormValues((prev) => ({
      ...prev,
      [activeField]: newValue,
    }));
  };

  const handleChange = (e, field) => {
    const { value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const user = await login(formValues).unwrap(); // Отправляем данные на сервер
      const data = parseJwt(user.access); // Парсим JWT-токен
      dispatch(
        setUser({
          accessToken: user.access,
          refreshToken: user.refresh,
          isAuth: true,
          currentUser: data?.user_id,
          firstName: data?.first_name,
          isAdmin: data?.is_admin,
        })
      );
      setErrMsg(''); // Очищаем сообщение об ошибке
      onLoginSuccess(); // Вызываем колбэк для уведомления родительского компонента
    } catch (error) {
      setErrMsg('Login failed'); // Устанавливаем сообщение об ошибке
      console.error('Login failed:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {errMsg && <p className="text-danger">{errMsg}</p>}
      <Form onFinish={handleSubmit}>
        <Form.Item label="Username">
          <Input
            value={formValues.username} // Привязываем значение к состоянию
            onChange={(e) => handleChange(e, 'username')} // Обработка ввода с обычной клавиатуры
            onFocus={() => handleFocus('username')} // Устанавливаем активное поле
          />
        </Form.Item>

        <Form.Item label="Password">
          <Input.Password
            value={formValues.password} // Привязываем значение к состоянию
            onChange={(e) => handleChange(e, 'password')} // Обработка ввода с обычной клавиатуры
            onFocus={() => handleFocus('password')} // Устанавливаем активное поле
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={isLoading}>
            Вход
          </Button>
        </Form.Item>
      </Form>

      {showKeyboard && <VirtualKeyboard onKeyPress={handleKeyPress} onClose={() => setShowKeyboard(false)} />}
    </div>
  );
};

export default Login;
