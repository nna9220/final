import React, { useState, useEffect } from 'react';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import RecentActorsOutlinedIcon from '@mui/icons-material/RecentActorsOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import RuleFolderOutlinedIcon from '@mui/icons-material/RuleFolderOutlined';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import './SidebarHead.scss'
import { useNavigate } from 'react-router-dom'; 

function SidebarHead() {
    const [expand, setExpand] = useState(true);
    const [isAvatarVisible, setIsAvatarVisible] = useState(false);
    const [activeItem, setActiveItem] = useState('');
    const navigate = useNavigate(); 

    const toggleSidebar = () => {
        setExpand(!expand);
        setIsAvatarVisible(!isAvatarVisible);
    };

    const [head, setHead] = useState({});

    const handleItemClick = (item) => {
        setActiveItem(item);
        navigate(`/${item}`);
    };

    useEffect(() => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        if (userToken) {
            // Lấy token từ storage
            const tokenSt = sessionStorage.getItem(userToken);

            if (!tokenSt) {
                axiosInstance.get('/head/home', {
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
                                <span className="user-name"><strong>{head.firstName + ' ' + head.lastName}</strong></span>
                                <span className="user-role">Trưởng bộ môn</span>
                            </div>
                        </div>
                    )}
                    <hr style={{ color: '#fff' }}></hr>
                    <ul className="sidebar-nav">
                        <li className={`sidebar-item ${activeItem === 'homeHead' ? 'active' : ''}`}>
                            <a href="#" className="sidebar-link" onClick={() => handleItemClick('homeHead')}>
                                <i className="lni lni-user"><HomeOutlinedIcon /></i>
                                <span>Trang chủ</span>
                            </a>
                        </li>
                        <li className={`sidebar-item ${activeItem === 'profileHead' ? 'active' : ''}`}>
                            <a href="#" className="sidebar-link" onClick={() => handleItemClick('profileHead')}>
                                <i className="lni lni-agenda"><PersonOutlinedIcon /></i>
                                <span>Trang cá nhân</span>
                            </a>
                        </li>
                        <li className={`sidebar-item ${activeItem === 'registerHead' ? 'active' : ''}`}>
                            <a href="#" className="sidebar-link" onClick={() => handleItemClick('registerHead')}>
                                <i className="lni lni-popup"><RecentActorsOutlinedIcon /></i>
                                <span>Đăng ký đề tài</span>
                            </a>
                        </li>
                        <li className={`sidebar-item ${activeItem === 'management' ? 'active' : ''}`}>
                            <a href="#" className="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse" data-bs-target="#auth"
                                aria-expanded="false" aria-controls="auth">
                                <i className="lni lni-protection"><FactCheckOutlinedIcon/></i>
                                <span>Quản lý đề tài</span>
                            </a>
                            <ul id="auth" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                                <li className={`sidebar-item ${activeItem === 'managermentHead/approve' ? 'active' : ''}`}>
                                    <a  style={{marginLeft:'10px'}} href="#" className="sidebar-link" onClick={() => handleItemClick('managermentHead/approve')}>Duyệt đề tài</a>
                                </li>
                                <li className={`sidebar-item ${activeItem === 'managementHead/assign' ? 'active' : ''}`}>
                                    <a style={{marginLeft:'10px'}} href="#" className="sidebar-link" onClick={() => handleItemClick('managementHead/assign')}>Phân giảng viên phản biện</a>
                                </li>
                                <li className={`sidebar-item ${activeItem === 'managementHead/topics' ? 'active' : ''}`}>
                                    <a style={{marginLeft:'10px'}} href="#" className="sidebar-link" onClick={() => handleItemClick('managementHead/topics')}>Đề tài của tôi</a>
                                </li>
                                <li className={`sidebar-item ${activeItem === 'managermentHead/TopicsPB' ? 'active' : ''}`}>
                                    <a style={{marginLeft:'10px'}} href="#" className="sidebar-link" onClick={() => handleItemClick('managermentHead/TopicsPB')}>Đề tài phản biện</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </aside>
            </div>
        </>
    );
}

export default SidebarHead
