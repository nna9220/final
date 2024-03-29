import React, { useState, useEffect } from 'react';
import './navbar.scss';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <div className='navbar'>
            <div className='wrapper'>
                <form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                    <button class="btn btn-outline-success" type="submit"><SearchOutlinedIcon/></button>
                </form>
                <div className='items'>
                    <div className='item'>
                        <DarkModeOutlinedIcon className='icon' />
                    </div>

                    <div className='item'>
                        <NotificationsNoneOutlinedIcon className='icon' />
                        <div className="counter">1</div>
                    </div>

                    <div class="dropdown-center">
                        <a href="#" class="p-3 link-dark dropdown-toggle" id="dropdownUser3" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="\assets\user.jpg" alt="mdo" width="24" height="24" class="rounded-circle" />
                        </a>
                        <ul class="dropdown-menu dropdown-menu-lg-end">
                            <li><a class="dropdown-items" href="#">Dự án mới...</a></li>
                            <li><a class="dropdown-items" href="#">Cài đặt</a></li>
                            <li><hr class="dropdown-divider" /></li>
                            <li><a class="dropdown-items" href="#">Đăng xuất</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
