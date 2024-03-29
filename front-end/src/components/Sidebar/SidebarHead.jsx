import React from 'react'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import './SidebarStudent.scss'
import { Link } from 'react-router-dom';
import { useState, useEffect} from 'react';
import axios from 'axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';


function SidebarHead() {
    const [isSidebarToggled, setSidebarToggled] = useState(true);
    const [selectedMenuItem, setSelectedMenuItem] = useState(false);
    const [head, setHead] = useState({});

    const handleSidebarToggle = () => {
        setSidebarToggled(!isSidebarToggled);
    };

    const handleMenuItemClick = (menuItem) => {
        setSelectedMenuItem(menuItem);
    };

    useEffect(() => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        if (userToken) {
          // Lấy token từ storage
          const tokenSt = sessionStorage.getItem(userToken);
    
          if (!tokenSt) {
            axios.get('http://localhost:5000/api/head/home', {
              headers: {
                'Authorization': `Bearer ${userToken}`,
              },
            })
            .then(response => {
              // Xử lý response từ backend (nếu cần)
              console.log("DataHead: ", response);
              setHead(response.data);
            })
            .catch(error => {
              console.error(error);
            });
          }
        }
      }, []);
    
    return (
        <div className={`page-wrapper chiller-theme ${isSidebarToggled ? 'toggled' : ''}`}>
            <a id="show-sidebar" className="btn btn-sm btn-dark" href="#" onClick={handleSidebarToggle}>
                <i><MenuOutlinedIcon /></i>
            </a>

            <nav id="sidebar" className="sidebar-wrapper">
                <div className="sidebar-content">
                    <div className="sidebar-brand">
                        <a style={{ fontSize: '12px' }} href="#">KHOA CÔNG NGHỆ THÔNG TIN</a>
                        <div id="close-sidebar" onClick={handleSidebarToggle}>
                            <i><CloseRoundedIcon /></i>
                        </div>
                    </div>

                    <div className="sidebar-header">
                        <div className="user-pic" style={{ color: '#fff' }}>
                            <i className="fa fa-user-circle fa-4x" aria-hidden="true"></i>
                        </div>
                        <div className="user-info">
                            <span className="user-name"> <strong>{head.firstName + ' '+head.lastName}</strong></span>
                            <span className="user-role">Trưởng bộ môn</span>
                        </div>
                    </div>

                    <div className="sidebar-menu">
                        <ul>
                            <li className="header-menu"><span>Trang chủ</span></li>
                            <li className={selectedMenuItem === 'trangCuaBan' ? 'active' : ''}><Link to="/homeHead" onClick={() => handleMenuItemClick('trangCuaBan')}><i className="fa fa-home"></i><span>Trang của bạn</span></Link></li>
                            <li className={selectedMenuItem === 'thongTinCaNhan' ? 'active' : ''}><Link to="/profileHead" onClick={() => handleMenuItemClick('thongTinCaNhan')}><i className="fa fa-user"></i><span>Thông tin cá nhân</span></Link></li>
                            <li className={selectedMenuItem === 'dangkiDeTai' ? 'active' : ''}><Link to="/registerHead" onClick={() => handleMenuItemClick('dangkiDeTai')}><i className="fa fa-book"></i><span>Đăng ký đề tài</span></Link></li>
                            <li className={selectedMenuItem === 'quanlydetai' ? 'active' : ''}><Link to="/managermentHead" onClick={() => handleMenuItemClick('quanlydetai')}><i className="fa fa-folder"></i><span>Quản lý đề tài</span></Link></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default SidebarHead