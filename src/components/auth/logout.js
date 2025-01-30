import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Form} from "antd";
import {removeUser} from "../../store/slices/userSlice";
import Cookies from "universal-cookie";
import {useDispatch} from "react-redux";


const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = () => {
    dispatch(removeUser());
    const cookie = new Cookies();
    cookie.remove("refresh");
    localStorage.setItem('token', ``);
    navigate("/");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <Form
        name="basic"
        labelCol={{span: 8}}
        wrapperCol={{span: 16}}
        style={{maxWidth: 600}}
        initialValues={{remember: true}}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item wrapperCol={{offset: 8, span: 16}}>
          <Button type="primary" htmlType="submit">
            Log out
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Logout