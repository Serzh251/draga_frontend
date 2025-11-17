import React, { useState, useEffect } from 'react';
import { Layout, Menu, Modal, Space, Button } from 'antd';
import { NavLink, Outlet } from 'react-router-dom';
import { HomeOutlined, LoginOutlined, LogoutOutlined, SettingOutlined, MenuOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import Login from './auth/login';
import Logout from './auth/logout';
import configApi from '../api/config-api';
import NotificationBell from '@/components/Notifications';
import { useSelector } from 'react-redux';

const { Header: AntHeader } = Layout;

const AppHeader = () => {
  const apiAdmin = configApi.API_ADMIN;
  const { isAuth, isAdmin, firstName } = useAuth();
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const isMobile = useSelector((state) => state.ui.isMobile);
  const [menuCollapsed, setMenuCollapsed] = useState(true);

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

  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  return (
    <>
      <AntHeader
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px',
        }}
      >
        {/* Кнопка меню для мобильных */}
        {isMobile && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={toggleMenu}
            style={{ color: '#fff', fontSize: '18px', flex: '0 0 auto' }}
          />
        )}

        {/* Основное меню для десктопа */}
        {!isMobile && (
          <div style={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'center' }}>
            <Menu
              theme="dark"
              mode="horizontal"
              selectable={false}
              items={menuItems}
              overflowedIndicator={null}
              style={{
                lineHeight: '64px',
                minWidth: 'fit-content',
                flex: 1,
                maxWidth: 'calc(100% - 200px)',
              }}
            />
          </div>
        )}

        <Space style={{ flex: '0 0 auto' }}>
          {isAuth && firstName && <span style={{ color: '#fff', marginRight: 16 }}>{firstName}</span>}
          <NotificationBell />
        </Space>
      </AntHeader>

      {/* Модальное окно для мобильного меню */}
      {isMobile && (
        <Modal
          open={!menuCollapsed}
          onCancel={toggleMenu}
          footer={null}
          closable={false}
          maskClosable={true}
          width={256}
          styles={{ body: { padding: 0 } }}
        >
          <Menu
            theme="dark"
            mode="inline"
            selectable={false}
            items={menuItems}
            onClick={toggleMenu} // Закрывает меню при клике на элемент
            style={{ borderRight: 0 }}
          />
        </Modal>
      )}

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
