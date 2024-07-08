import React, { useState, useEffect } from 'react';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import './SidebarStudent.scss';
import { useNavigate } from 'react-router-dom';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import SourceOutlinedIcon from '@mui/icons-material/SourceOutlined';
import { FcReading } from "react-icons/fc";

function SidebarStudent({unreadCount}) {
  const [student, setStudent] = useState({});
  const [expand, setExpand] = useState(true);
  const [isAvatarVisible, setIsAvatarVisible] = useState(false);
  const navigate = useNavigate();

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
              <FcReading size={50} />
              <div className="user-info">
                <span className="user-name"><strong>{student.firstName + ' ' + student.lastName}</strong></span>
                <span className="user-role">Sinh viên</span>
                <span className="user-role">{student.personId}</span>
              </div>
            </div>
          )}
          <hr style={{ color: '#fff' }}></hr>
          <ul className="sidebar-nav">
            <li className="sidebar-item">
              <a href="/homeStudent" className="sidebar-link">
                <i className="lni lni-user">
                  <HomeOutlinedIcon />
                </i>
                <span>Trang chủ</span>
                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-50 badge rounded-pill bg-danger">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
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
              <a href="#" className="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse" data-bs-target="#auth"
                aria-expanded="false" aria-controls="auth">
                <i className="lni lni-protection"><SourceOutlinedIcon /></i>
                <span>Quản lý đề tài</span>
              </a>
              <ul id="auth" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                <li className="sidebar-item">
                  <a style={{ marginLeft: '10px' }} href="/managermentTopicStudent" className="sidebar-link">Tiểu luận chuyên ngành</a>
                </li>
                <li className="sidebar-item">
                  <a style={{ marginLeft: '10px' }} href="/managermentTopicGraduationStudent" className="sidebar-link">Khóa luận tốt nghiệp</a>
                </li>
              </ul>
            </li>
          </ul>
        </aside>
      </div>
    </>
  );
}

export default SidebarStudent;
