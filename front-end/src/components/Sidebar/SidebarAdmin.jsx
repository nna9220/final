import React, { useState, useEffect } from 'react';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import RecentActorsOutlinedIcon from '@mui/icons-material/RecentActorsOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
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
              <FcPortraitMode size={70}/>
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
              <a href="/managermentYears" className="sidebar-link">
                <i className="lni lni-cog"><ViewListOutlinedIcon /></i>
                <span>Quản lý niên khóa</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="/managermentGuest" className="sidebar-link">
                <i className="lni lni-cog"><ViewListOutlinedIcon /></i>
                <span>Quản lý khách</span>
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </>
  )
};

export default SidebarAdmin;
