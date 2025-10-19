import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useLoginMutation } from '@/api/api';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/userSlice';
import { parseJwt } from '@/utils/token';
import VirtualKeyboard from '../tolls/VirtualKeyboard';
import { shouldUseVirtualKeyboard } from '@/utils/getTypePlarform';

const Login = ({ onLoginSuccess }) => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
  });
  const [activeField, setActiveField] = useState(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const handleFocus = (field) => {
    setActiveField(field);
    if (shouldUseVirtualKeyboard()) {
      setShowKeyboard(true);
    }
  };

  const handleKeyPress = (key) => {
    if (!activeField) return;

    let newValue = formValues[activeField];

    if (key === 'Backspace') {
      newValue = newValue.slice(0, -1);
    } else if (key === 'Space') {
      newValue += ' ';
    } else {
      newValue += key;
    }

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
      const user = await login(formValues).unwrap();
      const data = parseJwt(user.access);
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
      setErrMsg('');
      onLoginSuccess();
    } catch (error) {
      setErrMsg('Login failed');
      console.error('Login failed:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {errMsg && <p className="text-danger">{errMsg}</p>}
      <Form onFinish={handleSubmit}>
        <Form.Item label="Username">
          <Input
            value={formValues.username}
            onChange={(e) => handleChange(e, 'username')}
            onFocus={() => handleFocus('username')}
          />
        </Form.Item>

        <Form.Item label="Password">
          <Input.Password
            value={formValues.password}
            onChange={(e) => handleChange(e, 'password')}
            onFocus={() => handleFocus('password')}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={isLoading}>
            Вход
          </Button>
        </Form.Item>
      </Form>

      {/* Показываем виртуальную клавиатуру только если нужно */}
      {shouldUseVirtualKeyboard() && showKeyboard && (
        <VirtualKeyboard onKeyPress={handleKeyPress} onClose={() => setShowKeyboard(false)} />
      )}
    </div>
  );
};

export default Login;
