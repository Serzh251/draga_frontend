import React, { useState } from 'react';
import { Layout, Menu, Modal } from 'antd';
import { NavLink, Outlet } from 'react-router-dom';
import { HomeOutlined, LoginOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import config from '../config';
import { useAuth } from '../hook/use-auth';
import Login from './auth/login';
import Logout from './auth/logout';

const { Header } = Layout;

const AppHeader = () => {
  const apiAdmin = config.API_ADMIN;
  const { isAuth, firstName } = useAuth();
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const showLoginModal = () => {
    setIsLoginModalVisible(true);
  };

  const handleLoginOk = () => {
    setIsLoginModalVisible(false);
  };

  const handleLoginCancel = () => {
    setIsLoginModalVisible(false);
  };

  const showLogoutModal = () => {
    setIsLogoutModalVisible(true);
  };

  const handleLogoutOk = () => {
    setIsLogoutModalVisible(false);
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalVisible(false);
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
        <span onClick={showLoginModal} style={{ cursor: 'pointer' }}>
          Вход
        </span>
      ),
    });
  } else {
    menuItems.push({
      key: '3',
      icon: <LogoutOutlined />,
      label: (
        <span onClick={showLogoutModal} style={{ cursor: 'pointer' }}>
          Выход
        </span>
      ),
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
      <Modal title="Вход" open={isLoginModalVisible} onOk={handleLoginOk} onCancel={handleLoginCancel} footer={null}>
        <Login onLoginSuccess={handleLoginOk} />
      </Modal>
      <Modal
        title="Выход"
        open={isLogoutModalVisible}
        onOk={handleLogoutOk}
        onCancel={handleLogoutCancel}
        footer={null}
      >
        <Logout onLogoutSuccess={handleLogoutOk} />
      </Modal>
      <Outlet />
    </>
  );
};

export default AppHeader;
