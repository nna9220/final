import React, { useState, useEffect } from 'react';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import RecentActorsOutlinedIcon from '@mui/icons-material/RecentActorsOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import { FcPortraitMode } from "react-icons/fc";
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import './SidebarAdmin.scss'

const SidebarAdmin = () => {
  const [expand, setExpand] = useState(true);
  const [isAvatarVisible, setIsAvatarVisible] = useState(false);

  const toggleSidebar = () => {
    setExpand(!expand);
    setIsAvatarVisible(!isAvatarVisible);
  };

  const [admin, setAdmin] = useState({});

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
              <FcPortraitMode size={50} />
              <div className="user-info">
                <span className="user-name"><strong>{admin.firstName + ' ' + admin.lastName}</strong></span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
          )}
          <hr style={{ color: '#fff' }}></hr>
          <ul className="sidebar-nav">
            <li className="sidebar-item">
              <a href="/homeAdmin" className="sidebar-link">
                <i className="lni lni-user"><HomeOutlinedIcon /></i>
                <span>Trang chủ</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="/profileAdmin" className="sidebar-link">
                <i className="lni lni-agenda"><PersonOutlinedIcon /></i>
                <span>Trang cá nhân</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="/managermentStudent" className="sidebar-link">
                <i className="lni lni-popup"><RecentActorsOutlinedIcon /></i>
                <span>Quản lý sinh viên</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="/managermentLec" className="sidebar-link">
                <i className="lni lni-cog"><FactCheckOutlinedIcon /></i>
                <span>Quản lý giảng viên</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="/managermentTopics" className="sidebar-link">
                <i className="lni lni-cog"><BallotOutlinedIcon /></i>
                <span>Quản lý đề tài</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="/managermentType" className="sidebar-link">
                <i className="lni lni-cog"><ListAltOutlinedIcon /></i>
                <span>Quản lý loại đề tài</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="/managermentPeriod" className="sidebar-link">
                <i className="lni lni-cog"><AppRegistrationOutlinedIcon /></i>
                <span>Quản lý đợt đăng ký</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="/managermentApproveTime" className="sidebar-link">
                <i className="lni lni-cog"><AppRegistrationOutlinedIcon /></i>
                <span>Quản lý duyệt đề tài</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="/managermentRegisterTime" className="sidebar-link">
                <i className="lni lni-cog"><AppRegistrationOutlinedIcon /></i>
                <span>Quản lý thời gian đăng kí</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="#" className="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse" data-bs-target="#auth"
                aria-expanded="false" aria-controls="auth">
                <i className="lni lni-protection"><FactCheckOutlinedIcon /></i>
                <span>Quản lý niên khóa - lớp</span>
              </a>
              <ul id="auth" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                <li className="sidebar-item">
                  <a style={{ marginLeft: '10px' }} href="/managermentYears" className="sidebar-link">Quản lý niên khóa</a>
                </li>
                <li className="sidebar-item">
                  <a style={{ marginLeft: '10px' }} href="/managermentClass" className="sidebar-link">Quản lý lớp</a>
                </li>
              </ul>
            </li>
            <li className="sidebar-item">
              <a href="/managermentGuest" className="sidebar-link">
                <i className="lni lni-cog"><DvrOutlinedIcon /></i>
                <span>Quản lý khách</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="/managermentContact" className="sidebar-link">
                <i className="lni lni-cog"><ContactSupportOutlinedIcon /></i>
                <span>Giải đáp - Liên hệ</span>
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </>
  )
};

export default SidebarAdmin;
