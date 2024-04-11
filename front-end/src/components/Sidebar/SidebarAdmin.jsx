import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import './SidebarAdmin.scss'
import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { getAdminUser } from '../../actions/Admin/ActionOf Admin';
import { data } from 'jquery';
import axios from 'axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';


function SidebarAdmin() {
  const [isSidebarToggled, setSidebarToggled] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState(false);
  const [admin, setAdmin] = useState({});

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
        axiosInstance.get('/admin/home', {
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        })
        .then(response => {
          // Xử lý response từ backend (nếu cần)
          setAdmin(response.data);
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
              <span className="user-name"><strong>{admin.firstName + ' '+admin.lastName}</strong></span>
              <span className="user-role">Administrator</span>
              <span className="user-status"><i className="fa fa-circle"></i> <span>Online</span></span>
            </div>
          </div>

          <div className="sidebar-menu">
            <ul>
              <li className="header-menu"><span>Trang chủ</span></li>
              <li><NavLink to="/homeAdmin" onClick={() => handleMenuItemClick('trangCuaBan')} activeClassName={selectedMenuItem === 'trangCuaBan' ? 'active' : ''}><i className="fa fa-home"></i><span>Trang của bạn</span></NavLink></li>
              <li className={selectedMenuItem === 'thongTinCaNhan' ? 'active' : ''}><Link to="/profileAdmin" onClick={() => handleMenuItemClick('thongTinCaNhan')}><i className="fa fa-user"></i><span>Thông tin cá nhân</span></Link></li>
              <li className={selectedMenuItem === 'quanLySV' ? 'active' : ''}><Link to="/managermentStudent" href="#" onClick={() => handleMenuItemClick('quanLySV')}><i className="fa fa-book"></i><span>Quản lý sinh viên</span></Link></li>
              <li className={selectedMenuItem === 'quanLyGV' ? 'active' : ''}><Link to='/managermentLec' onClick={() => handleMenuItemClick('quanLyGV')}><i className="fa fa-address-book-o"></i><span>Quản lý giảng viên</span></Link></li>
              <li className={selectedMenuItem === 'quanlytopic' ? 'active' : ''}><Link to='/managermentTopics' onClick={() => handleMenuItemClick('quanlytopic')}><i className="fa fa-address-card"></i><span>Quản lý đề tài</span></Link></li>
              <li className={selectedMenuItem === 'quanlyloaidetai' ? 'active' : ''}><Link to='/managermentType' onClick={() => handleMenuItemClick('quanlyloaidetai')}><i className="fa fa-list-alt"></i><span>Quản lý loại đề tài</span></Link></li>
              <li className={selectedMenuItem === 'quanlydetai' ? 'active' : ''}><Link to='/managermentPeriod' onClick={() => handleMenuItemClick('quanlydetai')}><i className="fa fa-folder"></i><span>Quản lý đợt đăng ký đề tài</span></Link></li>
              <li className={selectedMenuItem === 'quanlynienkhoa' ? 'active' : ''}><Link to='/managermentYears' onClick={() => handleMenuItemClick('quanlynienkhoa')}><i className="fa fa-list-alt"></i><span>Quản lý niên khóa-lớp học</span></Link></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default SidebarAdmin

