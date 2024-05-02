import React, { useState, useEffect } from 'react';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import './SidebarStudent.scss';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import SourceOutlinedIcon from '@mui/icons-material/SourceOutlined';

function SidebarStudent() {
  const [student, setStudent] = useState({});
  const [expand, setExpand] = useState(true);
  const [isAvatarVisible, setIsAvatarVisible] = useState(false);

  const toggleSidebar = () => {
    setExpand(!expand);
    setIsAvatarVisible(!isAvatarVisible);
  };

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
    <>
      <div className={`wrapper ${expand ? 'expand' : ''}`}>
        <aside id="sidebar" className={expand ? 'expand' : ''}>
          <div className="d-flex">
            <button className="toggle-btn" type="button" onClick={toggleSidebar}>
              <i className="lni lni-grid-alt"> <DashboardOutlinedIcon /></i>
            </button>
            <div className="sidebar-logo">
              <a href="#">KHOA CÔNG NGHỆ THÔNG TIN</a>
            </div>
          </div>
          <hr style={{ color: '#fff' }}></hr>
          {!isAvatarVisible && (
            <div className="sidebar-header">
              <div className="user-pic" style={{ color: '#fff' }}>
                <i className="fa fa-user-circle fa-4x" aria-hidden="true"></i>
              </div>
              <div className="user-info">
                <span className="user-name"><strong>{student.firstName + ' ' + student.lastName}</strong></span>
                <span className="user-role">Sinh viên</span>
              </div>
            </div>
          )}
          <hr style={{ color: '#fff' }}></hr>
          <ul className="sidebar-nav">
            <li className="sidebar-item">
              <a href="/homeStudent" className="sidebar-link">
                <i className="lni lni-user"><HomeOutlinedIcon /></i>
                <span>Trang chủ</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="/profileStudent" className="sidebar-link">
                <i className="lni lni-agenda"><PersonOutlinedIcon /></i>
                <span>Trang cá nhân</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="/RegisTopicStudent" className="sidebar-link">
                <i className="lni lni-popup"><PostAddOutlinedIcon /></i>
                <span>Đăng ký đề tài</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="/managermentTopicStudent" className="sidebar-link">
                <i className="lni lni-cog"><SourceOutlinedIcon /></i>
                <span>Quản lý đề tài</span>
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </>
  );
}

export default SidebarStudent;
