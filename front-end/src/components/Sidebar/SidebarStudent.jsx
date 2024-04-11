import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import './SidebarStudent.scss';
import axios from 'axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';

function SidebarStudent() {
  const [selectedMenuItem, setSelectedMenuItem] = useState(false);
  const [student, setStudent] = useState({});

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };


  useEffect(() => {
    const userToken = getTokenFromUrlAndSaveToStorage();
    if (userToken) {
      // Lấy token từ storage
      const tokenSt = sessionStorage.getItem(userToken);

      if (!tokenSt) {
        axios.get('/api/student/home', {
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        })
          .then(response => {
            // Xử lý response từ backend (nếu cần)
            setStudent(response.data);
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  }, []);
  
  return (
    <div className='page-wrapper chiller-theme toggled'>
      <a id="show-sidebar" className="btn btn-sm btn-dark" href="#">
        <i><MenuOutlinedIcon /></i>
      </a>

      <nav id="sidebar" className="sidebar-wrapper">
        <div className="sidebar-content">
          <div className="sidebar-brand">
            <a style={{ fontSize: '12px' }} href="#">KHOA CÔNG NGHỆ THÔNG TIN</a>
          </div>

          <div className="sidebar-header">
            <div className="user-pic" style={{ color: '#fff' }}>
              <i className="fa fa-user-circle fa-3x" aria-hidden="true"></i>
            </div>
            <div className="user-info">
              <span className="user-name"> <strong>{student.firstName + ' '+ student.lastName}</strong></span>
              <span className="user-role">Sinh viên</span>
            </div>
          </div>

          <div className="sidebar-menu">
            <ul>
              <li className="header-menu"><span>Trang chủ</span></li>
              <li className={selectedMenuItem === 'trangCuaBan' ? 'active' : ''}>
                <Link to="/homeStudent" onClick={() => handleMenuItemClick('trangCuaBan')}>
                  <i className="fa fa-home"></i><span>Trang của bạn</span>
                </Link>
              </li>
              <li className={selectedMenuItem === 'thongTinCaNhan' ? 'active' : ''}>
                <Link to="/profileStudent" onClick={() => handleMenuItemClick('thongTinCaNhan')}>
                  <i className="fa fa-user"></i><span>Thông tin cá nhân</span>
                </Link>
              </li>
              <li className={selectedMenuItem === 'dangkiDeTai' ? 'active' : ''}>
                <Link to="/RegisTopicStudent" onClick={() => handleMenuItemClick('dangkiDeTai')}>
                  <i className="fa fa-book"></i><span>Đăng ký đề tài</span>
                </Link>
              </li>
              <li className={selectedMenuItem === 'quanlydetai' ? 'active' : ''}>
                <Link to="/managermentTopicStudent" onClick={() => handleMenuItemClick('quanlydetai')}>
                  <i className="fa fa-folder"></i><span>Quản lý đề tài</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default SidebarStudent;
