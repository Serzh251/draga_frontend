import React, { useState } from 'react';
import { Layout, Menu, Modal } from 'antd';
import { NavLink, Outlet } from 'react-router-dom';
import { HomeOutlined, LoginOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuth } from '../hook/use-auth';
import configApi from '../api/config-api';
import Login from './auth/login';

const { Header } = Layout;

const AppHeader = () => {
  const apiAdmin = configApi.API_ADMIN;
  const { isAuth, firstName } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const menuItems = [
    {
      key: '1',
      icon: <HomeOutlined />,
      label: <NavLink to="/">Home</NavLink>,
    },
  ];

  if (!isAuth) {
    menuItems.push({
      key: '2',
      icon: <LoginOutlined />,
      label: (
        <span onClick={showModal} style={{ cursor: 'pointer' }}>
          Вход
        </span>
      ),
    });
  } else {
    menuItems.push({
      key: '3',
      icon: <LogoutOutlined />,
      label: <NavLink to="logout">Выход</NavLink>,
    });
    menuItems.push({
      key: '4',
      icon: <SettingOutlined />,
      label: (
        <a href={apiAdmin} rel="noopener noreferrer">
          Админ панель
        </a>
      ),
    });
    menuItems.push({
      key: '5',
      label: <div className="current-user text-decoration-none">{firstName}</div>,
      style: { marginLeft: 'auto' },
    });
  }

  return (
    <>
      <Header>
        <Menu theme="dark" mode="horizontal" selectable={false} style={{ marginRight: 15 }} items={menuItems} />
      </Header>
      <Modal title="Вход" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <Login onLoginSuccess={handleOk} />
      </Modal>
      <Outlet />
    </>
  );
};

export default AppHeader;
