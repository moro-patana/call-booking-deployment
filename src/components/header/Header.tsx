import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import styles from './Header.module.css';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Container, MenuItem, Link, Box, Toolbar, IconButton, Typography, Menu } from '@mui/material'
import onjaLogo from '../../icons/onja-logo.svg';
import { useAppDispatch } from '../../redux/hooks';
import { setCurrentUser } from '../../redux/reducers/usersSlice';

const {
  headerBar,
  container,
  title,
  wrapper,
  desktopContainer,
  mobileContainer,
  menuAppBar,
  menuItem
} = styles;

const basePath = '/';

const menu = [
  { name: 'Login', url: 'login' },
  { name: 'Logout', url: 'logout' }
];

const Header = () => {
  const menuRef = useRef(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [cookies] = useCookies();
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!currentUser?.login) navigate('/login');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, navigate]);

  useEffect(() => {
    if(cookies?.currentUser?.login) {
      const { login } = cookies?.currentUser;
      dispatch(setCurrentUser({ isLogin: true, login }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppBar className={headerBar}>
      <Container className={container}>
        <Toolbar disableGutters>
          <Typography variant="h1" noWrap component="a" href={basePath} className={title}>
            <img src={onjaLogo} alt="logo" />
            <span>Booking Calendar</span>
          </Typography>

          <Box className={`${wrapper} ${desktopContainer}`}>
            {menu.map((item) => (
              <MenuItem key={item.name} className={menuItem}>
                <Link href={`${basePath}${item.url}`}>{item.name}</Link>
              </MenuItem>
            ))}
          </Box>

          <Box className={`${wrapper} ${mobileContainer}`}>
            <IconButton
              ref={menuRef}
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => setOpenMenu(true)}>
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              className={menuAppBar}
              anchorEl={menuRef.current}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              open={openMenu}
              onClose={() => setOpenMenu(false)}>
              {menu.map((item) => (
                <MenuItem onClick={() => setOpenMenu(false)} key={item.name} className={menuItem}>
                  <Link href={`${basePath}${item.url}`}>{item.name}</Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;