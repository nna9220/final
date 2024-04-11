import React, { useState, useEffect } from 'react';
import './navbar.scss';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import axios from 'axios';

function Navbar() {
    const handleLogout = () => {
        axios.post('http://localhost:5000/logout', null, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
            .then(response => {
                // Xóa token từ Local Storage sau khi đăng xuất thành công
                localStorage.removeItem('accessToken');
                // Chuyển hướng đến trang chủ hoặc thực hiện bất kỳ hành động nào khác sau khi đăng xuất thành công
                window.location.href = '/';
            })
            .catch(error => {
                console.error('Error occurred while logging out:', error);
                // Xử lý lỗi đăng xuất nếu cần thiết
            });
    };

    return (
        <div className='navbarRe'>
            <div className='wrapper'>
                <div className='items'>
                    <div className='item'>
                        <DarkModeOutlinedIcon className='icon' />
                    </div>

                    <button class="btn position-relative item">
                        <NotificationsNoneOutlinedIcon className='icon-noti' />
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            9+
                            <span class="visually-hidden">unread messages</span>
                        </span>
                    </button>
                    <div class="dropdown-center">
                        <a href="#" class="p-3 link-dark dropdown-toggle" id="dropdownUser3" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="\assets\user.jpg" alt="mdo" width="24" height="24" class="rounded-circle" />
                        </a>
                        <ul class="dropdown-menu dropdown-menu-lg-end">
                            <li><a class="dropdown-items" href="#">Dự án mới...</a></li>
                            <li><a class="dropdown-items" href="#">Cài đặt hệ thống</a></li>
                            <li><hr class="dropdown-divider" /></li>
                            <li><a class="dropdown-items" onClick={handleLogout} >Đăng xuất</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
