import './SidebarAdmin.scss'
import React from 'react';
import { Navigation } from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import RecentActorsOutlinedIcon from '@mui/icons-material/RecentActorsOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import './SidebarAdmin.scss'

function SidebarAdmin() {
  const [isSidebarToggled, setSidebarToggled] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState(false);
  const [admin, setAdmin] = useState({});
  const history = useNavigate();
  const location = useLocation();
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
            console.log(response.data);
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  }, []);

  return (
    <div className='sidebar-head'>
      <div className="sidebar-header">
        <a className='title-sidebar'>KHOA CÔNG NGHỆ THÔNG TIN</a>
      </div>
      <hr></hr>
      <div className="sidebar-header">
        <div className="user-pic" style={{ color: '#fff' }}>
          <i className="fa fa-user-circle fa-4x" aria-hidden="true"></i>
        </div>
        <div className="user-info">
          <span className="user-name"><strong>{admin.firstName + ' ' + admin.lastName}</strong></span>
          <span className="user-role">Administrator</span>
        </div>
      </div>
      <hr></hr>
      <Navigation
        activeItemId={location.pathname}
        onSelect={({ itemId }) => {
          history(itemId);
        }}
        items={[
          {
            title: 'Trang chủ',
            itemId: '/homeAdmin',
            elemBefore: () => <HomeOutlinedIcon />,
          },
          {
            title: 'Trang cá nhân',
            itemId: '/profileAdmin',
            elemBefore: () => <PersonOutlinedIcon />,
          },
          {
            title: 'Quản lý sinh viên',
            itemId: '/managermentStudent',
            elemBefore: () => <RecentActorsOutlinedIcon />,
          },
          {
            title: 'Quản lý giảng viên',
            itemId: '/managermentLec',
            elemBefore: () => <FactCheckOutlinedIcon />,
          },
          {
            title: 'Quản lý đợt đăng ký',
            itemId: '/managermentPeriod',
            elemBefore: () => <AppRegistrationOutlinedIcon/>,
          },
          {
            title: 'Quản lý đề tài',
            itemId: '/managermentTopics',
            elemBefore: () => <BallotOutlinedIcon />,
          },
          {
            title: 'Quản lý loại đề tài',
            itemId: '/managermentType',
            elemBefore: () => <ListAltOutlinedIcon />,
          },
          {
            title: 'Quản lý niên khóa',
            itemId: '/managermentYears',
            elemBefore: () => <ViewListOutlinedIcon />,
          },
        ]}
      />
    </div>
  );
}

export default SidebarAdmin

