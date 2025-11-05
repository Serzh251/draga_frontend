import React, { useState } from 'react';
import { Layout, Menu, Modal, Space } from 'antd';
import { NavLink, Outlet } from 'react-router-dom';
import { HomeOutlined, LoginOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import Login from './auth/login';
import Logout from './auth/logout';
import configApi from '../api/config-api';
import NotificationBell from '@/components/Notifications';

const { Header: AntHeader } = Layout;

const AppHeader = () => {
  const apiAdmin = configApi.API_ADMIN;
  const { isAuth, isAdmin, firstName } = useAuth();
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const showLoginModal = () => setIsLoginModalVisible(true);
  const handleLoginCancel = () => setIsLoginModalVisible(false);
  const showLogoutModal = () => setIsLogoutModalVisible(true);
  const handleLogoutCancel = () => setIsLogoutModalVisible(false);

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <NavLink to="/">Главная</NavLink>,
    },
  ];

  if (!isAuth) {
    menuItems.push({
      key: 'login',
      icon: <LoginOutlined />,
      label: <span onClick={showLoginModal}>Вход</span>,
    });
  } else {
    menuItems.push({
      key: 'logout',
      icon: <LogoutOutlined />,
      label: <span onClick={showLogoutModal}>Выход</span>,
    });

    if (isAdmin) {
      menuItems.push({
        key: 'admin',
        icon: <SettingOutlined />,
        label: (
          <a href={apiAdmin} rel="noopener noreferrer">
            Админ панель
          </a>
        ),
      });
    }
  }

  return (
    <>
      <AntHeader
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px', // опционально: добавьте отступы
        }}
      >
        {/* Контейнер меню растягивается на всё доступное пространство */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Menu
            theme="dark"
            mode="horizontal"
            selectable={false}
            items={menuItems}
            overflowedIndicator={null} // ← отключаем "три точки"
            style={{
              lineHeight: '64px',
              minWidth: 'fit-content', // ← гарантирует, что меню не сжимается
            }}
          />
        </div>

        <Space>
          {isAuth && firstName && <span style={{ color: '#fff', marginRight: 16 }}>{firstName}</span>}
          <NotificationBell />
        </Space>
      </AntHeader>

      <Modal open={isLoginModalVisible} onCancel={handleLoginCancel} footer={null} title="Вход">
        <Login onLoginSuccess={handleLoginCancel} />
      </Modal>
      <Modal open={isLogoutModalVisible} onCancel={handleLogoutCancel} footer={null} title="Выход">
        <Logout onLogoutSuccess={handleLogoutCancel} />
      </Modal>

      <Outlet />
    </>
  );
};

export default AppHeader;
