import React from 'react';
import { Layout, Menu } from 'antd';
import { NavLink, Outlet } from 'react-router-dom';
import {
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import config from '../config';
import { useAuth } from '../hook/use-auth';
const { Header } = Layout;

const AppHeader = () => {
  const apiAdmin = config.API_ADMIN;
  const { isAuth, firstName } = useAuth();
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
      label: <NavLink to="login">Вход</NavLink>,
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
      label: (
        <div className="current-user text-decoration-none">{firstName}</div>
      ),
      style: { marginLeft: 'auto' },
    });
  }

  return (
    <>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          selectable={false}
          style={{ marginRight: 15 }}
          items={menuItems}
        />
      </Header>
      <Outlet />
    </>
  );
};

export default AppHeader;
