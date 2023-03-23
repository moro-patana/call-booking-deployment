import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import {
  AppBar, Container, Box, Toolbar, IconButton,
  Typography, Menu, Avatar, MenuItem, Tooltip
} from '@mui/material';

import { HOME, LOGOUT } from '../../constants/path';

import onjaLogo from '../../icons/onja-logo.svg';
import { setCurrentUser } from '../../redux/reducers/usersSlice';
import { useAppDispatch } from '../../redux/hooks';

import styles from './Header.module.css';

const basePath = HOME;

const menu = [
  { name: 'Login', url: 'login' },
  { name: 'Logout', url: 'logout' }
];

const { headerBar, container, title, avatar, avatarBatton } = styles;

const Header = () => {
  const dispatch = useAppDispatch();
  const [cookies, addCookie, removeCookie] = useCookies(['currentUser', 'isLoggedOut']);
  const { currentUser } = cookies;
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const changePath = (path: string) => {
    navigate(`${basePath}${path}`)
    if (path === 'logout') logOut();
    setAnchorElUser(null);
  };

  const logOut = async () => {
    if (cookies?.currentUser?.login) {
      removeCookie('currentUser', { path: HOME });
      addCookie('isLoggedOut', true, { path: HOME });
      navigate(LOGOUT);

    }else navigate(LOGOUT);

  };

  useEffect(() => {
    if (cookies?.currentUser?.login) {
      const { login } = cookies?.currentUser;
      dispatch(setCurrentUser({ isLogin: true, login }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderAvatarMenu = (className: string) => {
    return (
      <Box className={className}>
        <Tooltip arrow title="Open menu">
          <IconButton onClick={(event) => setAnchorElUser(event.currentTarget)} className={avatarBatton}>
            <Avatar alt={currentUser?.login?.username} src={currentUser?.login?.picture ? currentUser.login.picture : ''} />
          </IconButton>
        </Tooltip>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{ vertical: 38, horizontal: 'center' }}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={Boolean(anchorElUser)}
          onClose={() => setAnchorElUser(null)}
        >
          {menu.map((menuItem) => (
            <MenuItem key={menuItem.name} onClick={() => changePath(menuItem.url)}>
              <Typography textAlign="center">{menuItem.name}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  };

  return (
    <AppBar className={headerBar}>
      <Container className={container}>
        <Toolbar disableGutters>
          <MenuItem onClick={() => navigate(basePath)} className={title}>
            <img src={onjaLogo} alt="logo" />
            <span>Booking Calendar</span>
          </MenuItem>
          {renderAvatarMenu(avatar)}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
