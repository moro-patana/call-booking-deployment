import React, { FC, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import iconMenu from "./icons/menu-icon.png"
import upMenu from "./icons/up.svg"
import downMenu from "./icons/down.svg"
import logout from "./icons/logout.svg"
import { eachDayOfInterval } from "date-fns";
import { covertTONormalDate } from '../../utils/dateUtils';
import { useCookies } from 'react-cookie';

const iconStyle = { padding: 0, height: "24px" }

interface MenuType {
  currentDay: Date
  endingDay: Date
  setCurrentDay: (value: Date) => void 
  setEndingDay: (value: Date) => void
  setWeek: (value: Date[]) => void
  setIsLoggedIn: (value: boolean) => void
}

const ExpendableMenu: FC<MenuType> = ({
  currentDay,
  endingDay,
  setCurrentDay,
  setEndingDay,
  setWeek,
  setIsLoggedIn
}) => {
  const [ cookies, setCookies, removeCookie ] = useCookies(["auth-token"])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpArrow = () => {
    const startDay = new Date(currentDay.setDate(currentDay.getDate() - 7))
    const endDay = new Date(endingDay.setDate(endingDay.getDate() - 7))
    setCurrentDay(startDay)
    setEndingDay(endDay)
  }
  
  const handleDownArrow = () => {
    const startDay = new Date(currentDay.setDate(currentDay.getDate() + 7))
    const endDay = new Date(endingDay.setDate(endingDay.getDate() + 7))
    setCurrentDay(startDay)
    setEndingDay(endDay)
  }
  
  const handleSelectWeek = () => {
    const days = eachDayOfInterval({ start: currentDay, end: endingDay })
    setWeek(days);
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    removeCookie("auth-token")
  };

  return (
    <div style={{
        textAlign: "end",
        position: "absolute",
        right: "9px",
        bottom: "7px",
        zIndex: 999,
        background: "#fff",
      }}
    >
      <Button
        variant="outlined"
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ borderColor: "#9d9898", padding: "0px" }}
      >
        <img src={iconMenu} alt="Menu" />
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          margin: "5px",
          top: "-8px",
          left: "3px"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "320px",
            gap:"14px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Button sx={iconStyle} onClick={handleUpArrow}><img src={upMenu} alt="Up" /></Button>
              <Button sx={iconStyle} onClick={handleDownArrow}><img src={downMenu} alt="Down" /></Button>
            </div>
            <Button
              style={{ fontSize: "20px", color: "#000" }}
              onClick={handleSelectWeek}
            >
              {covertTONormalDate(currentDay)} - {covertTONormalDate(endingDay)}
            </Button>
          </div>
          <MenuItem
            onClick={handleLogout}
            sx={{ alignSelf: "end" }}
          >
            <img src={logout} alt="Log out" />
          </MenuItem>
        </div>
      </Menu>
    </div>
  );
}

export default ExpendableMenu