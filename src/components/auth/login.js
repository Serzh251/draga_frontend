import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import axios from '../../api/axois';
import {Button, Form, Input} from "antd";
import Cookies from "universal-cookie";
import {setUser} from "../../store/slices/userSlice";
import {useDispatch} from "react-redux";

const LOGIN_URL = '/api/token/';

const Login = () => {
  const navigate = useNavigate();
  const cookie = new Cookies();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    setErrMsg('');
  }, [username, password])

  const handleSubmit = async (e) => {
    try {
      const response = await axios.post(LOGIN_URL,
        JSON.stringify({username, password}),
        {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true
        }
      );
      const access = response?.data?.access;
      const refresh = response?.data?.refresh;
      const tokenParts = access.split('.');
      const payloadBase64 = tokenParts[1];
      const payloadJSON = atob(payloadBase64);
      const payloadData = JSON.parse(payloadJSON);
      const currentUser = payloadData?.user_id;
      const firstName = payloadData?.first_name;
      localStorage.setItem('token', `${access}`);
      localStorage.setItem('currentUser', currentUser);
      localStorage.setItem('firstName', firstName);
      localStorage.setItem('isAuth', 'true');
      cookie.set("refresh", refresh,);
      dispatch(
        setUser({
          firstName: firstName,
          currentUser: currentUser,
          token: access,
          isAuth: true
        })
      );
      setUsername('');
      setPassword('');
      navigate("/");
      setErrMsg('');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
    }
  }

  return (

    <div className="container d-flex justify-content-center align-items-center flex-column vh-100">
      <p className={errMsg ? "text-danger" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <Form onFinish={handleSubmit}
            name="basic"
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}
            style={{maxWidth: 600}}
            initialValues={{remember: true}}>
        <Form.Item
          label="username"
          id="username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input onChange={(e) => setUsername(e.target.value)}/>
        </Form.Item>
        <Form.Item
          label="password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password onChange={(e) => setPassword(e.target.value)}/>
        </Form.Item>
        <Form.Item wrapperCol={{offset: 8, span: 16}}>
          <Button type="primary" htmlType="submit">
            Вход
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login