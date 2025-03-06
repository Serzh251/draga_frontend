import React, { useEffect, useState } from 'react';
import { useLoginMutation } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/userSlice';
import { parseJwt } from '../../utils/token';
import { Button, Form, Input } from 'antd';

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    setErrMsg('');
  }, [username, password]);

  const handleSubmit = async (values) => {
    try {
      const user = await login(values).unwrap();
      const accessToken = user.access;
      const refreshToken = user.refresh;
      const payloadData = parseJwt(accessToken);
      const currentUser = payloadData?.user_id;
      const firstName = payloadData?.first_name;

      dispatch(
        setUser({
          accessToken: accessToken,
          refreshToken: refreshToken,
          isAuth: true,
          firstName: firstName,
          currentUser: currentUser,
        })
      );

      navigate('/');
    } catch (error) {
      setErrMsg('Login failed');
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center flex-column vh-100">
      <p className={errMsg ? 'text-danger' : 'offscreen'} aria-live="assertive">
        {errMsg}
      </p>
      <Form
        onFinish={handleSubmit}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
      >
        <Form.Item
          label="username"
          id="username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input onChange={(e) => setUsername(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password onChange={(e) => setPassword(e.target.value)} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Вход
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
