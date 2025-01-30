import {NavLink, Outlet} from "react-router-dom";
import React from "react";
import {useAuth} from "../hook/use-auth";
import {Layout, Menu} from 'antd'
import {HomeOutlined, LoginOutlined, LogoutOutlined,} from '@ant-design/icons';
import config from "../config";


const RouteLayout = (props) => {
  const {currentUser} = useAuth();
  const {Header} = Layout;
  const apiAdmin = config.API_ADMIN;

  return (
    <>
      <Header>
        <Menu theme="dark" mode="horizontal" selectable={false} style={{marginRight: 15}}>
          <Menu.Item key="1" icon={<HomeOutlined/>}>
            <NavLink className="" to="/">
              Home
            </NavLink>
          </Menu.Item>
          {!props.isAuth ? (
            <Menu.Item key="2" icon={<LoginOutlined/>} title={"Login"}>
              <NavLink to="login">
                Вход
              </NavLink>
            </Menu.Item>
          ) : (
            <>
              <Menu.Item key="3" icon={<LogoutOutlined/>} title={"Logout"}>
                <NavLink to="logout">
                  Выход
                </NavLink>
              </Menu.Item>
            </>)}
          <a href={apiAdmin} className="current-user text-decoration-none">{currentUser}</a>
        </Menu>
      </Header>
      <Outlet/>
    </>
  );
};

export default RouteLayout;