import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'antd';
import { removeUser } from '../../store/slices/userSlice';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { removeMapData } from '../../store/slices/mapDataSlice';

const Logout = ({ onLogoutSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = () => {
    dispatch(removeUser());
    dispatch(removeMapData());
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    navigate('/');
    onLogoutSuccess(); // Закрыть модальное окно после успешного выхода
  };

  return (
    <div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Выйти
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Logout;
