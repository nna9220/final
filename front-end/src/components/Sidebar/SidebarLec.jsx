import React from 'react';
import { Navigation } from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import RuleFolderOutlinedIcon from '@mui/icons-material/RuleFolderOutlined';
import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined';
import SnippetFolderOutlinedIcon from '@mui/icons-material/SnippetFolderOutlined';
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined';
import { BorderBottom, BorderRight } from '@mui/icons-material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import './SidebarLec.scss'

function SidebarLec() {
    const [isSidebarToggled, setSidebarToggled] = useState(true);
    const [selectedMenuItem, setSelectedMenuItem] = useState(false);
    const [lec, setLec] = useState({});
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
            axiosInstance.get('/lecturer/home', {
              headers: {
                'Authorization': `Bearer ${userToken}`,
              },
            })
            .then(response => {
              // Xử lý response từ backend (nếu cần)
              console.log("DataHead: ", response);
              setLec(response.data);
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
                    <span className="user-name"><strong>{lec.firstName + ' ' + lec.lastName}</strong></span>
                    <span className="user-role">Giảng viên</span>
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
                        itemId: '/homeLecturer',
                        elemBefore: () => <HomeOutlinedIcon />,
                    },
                    {
                        title: 'Trang cá nhân',
                        itemId: '/profleLecturer',
                        elemBefore: () => <PersonOutlinedIcon />,
                    },
                    {
                        title: 'Đăng kí đề tài',
                        itemId: '/registerTopicofLec',
                        elemBefore: () => <AppRegistrationOutlinedIcon />,
                    },
                    {
                        title: 'Quản lý đề tài',
                        itemId: '/managermentTopicLec',
                        elemBefore: () => <FolderOutlinedIcon />,
                        subNav: [
                            {
                                title: 'Đề tài của tôi',
                                itemId: '/managermentTopicLec',
                                elemBefore: () => <TopicOutlinedIcon />,
                            },
                            {
                                title: 'Đề tài phản biện',
                                itemId: '/managermentTopicPBLec',
                                elemBefore: () => <SnippetFolderOutlinedIcon />,
                            },
                        ],
                    },
                ]}
            />
        </div>
    );
}

export default SidebarLec