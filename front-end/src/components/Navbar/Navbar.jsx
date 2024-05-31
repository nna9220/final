import React, { useState } from 'react';
import './navbar.scss';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import Brightness7OutlinedIcon from '@mui/icons-material/Brightness7Outlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { SiGravatar } from "react-icons/si";
import axiosInstance from '../../API/axios';
import { useNavigate } from 'react-router-dom';

function Navbar({ unreadCount }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleLogout = () => {
    const token = sessionStorage.getItem('userToken');
    axiosInstance.post('/logout', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      sessionStorage.removeItem('userToken');
      navigate('/');
    })
    .catch(error => {
      console.error('Logout error:', error);
    });
  };

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className='navbarRe'>
        <div className='wrapper'>
          <div className='items'>
            <div className='item' onClick={toggleDarkMode}>
              {isDarkMode ? <Brightness7OutlinedIcon className='icon' /> : <DarkModeOutlinedIcon className='icon' />}
            </div>
            <button className="btn position-relative item">
              <NotificationsNoneOutlinedIcon className='icon-noti' />
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unreadCount > 99 ? '99+' : unreadCount}
                  <span className="visually-hidden">unread messages</span>
                </span>
              )}
            </button>
            <div className="dropdown-center">
              <a href="#" className="p-3 link-dark dropdown-toggle" id="dropdownUser3" data-bs-toggle="dropdown" aria-expanded="false">
                <SiGravatar size={20} style={{color:'darkcyan'}}/>
              </a>
              <ul className="dropdown-menu dropdown-menu-lg-end">
                <li><a className="dropdown-items" onClick={handleLogout}>Đăng xuất</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
