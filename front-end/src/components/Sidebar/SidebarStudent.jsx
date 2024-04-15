import React, { useState, useEffect } from 'react';
import { Navigation } from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import './SidebarStudent.scss';

function SidebarStudent() {
  const [student, setStudent] = useState({});
  const history = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userToken = getTokenFromUrlAndSaveToStorage();
    if (userToken) {
      const tokenSt = sessionStorage.getItem(userToken);
      if (!tokenSt) {
        axiosInstance
          .get('/student/home', {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((response) => {
            setStudent(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }, []);

  return (
    <div className="sidebar-head">
      <div className="sidebar-header">
        <h7 className='title-sidebar'>KHOA CÔNG NGHỆ THÔNG TIN</h7>
      </div>
      
      <hr></hr>
      <div className="sidebar-header">
        <div className="user-pic" style={{ color: '#fff' }}>
          <i className="fa fa-user-circle fa-4x" aria-hidden="true"></i>
        </div>
        <div className="user-info">
          <span className="user-name"><strong>{student.firstName + ' ' + student.lastName}</strong></span>
          <span className="user-role">Sinh viên</span>
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
            itemId: '/homeStudent',
            elemBefore: () => <HomeOutlinedIcon />,
          },
          {
            title: 'Trang cá nhân',
            itemId: '/profileStudent',
            elemBefore: () => <PersonOutlinedIcon />,
          },
          {
            title: 'Đăng kí đề tài',
            itemId: '/RegisTopicStudent',
            elemBefore: () => <AppRegistrationOutlinedIcon />,
          },
          {
            title: 'Quản lý đề tài',
            itemId: '/managermentTopicStudent',
            elemBefore: () => <FolderOutlinedIcon />,
          },
        ]}
      />
    </div>
  );
}

export default SidebarStudent;
