import React from 'react';
import './navbar.scss';
import { SiGravatar } from "react-icons/si";
import axiosInstance from '../../API/axios';

function Navbar() {
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
    <div>
      <div className='navbarRe'>
        <div className='wrapper'>
          <div className='items'>
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
