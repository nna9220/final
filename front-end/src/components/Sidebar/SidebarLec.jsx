import React from 'react';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import { useState, useEffect } from 'react';
import RecentActorsOutlinedIcon from '@mui/icons-material/RecentActorsOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import { useNavigate } from 'react-router-dom';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import './SidebarLec.scss'
import { FcReadingEbook } from "react-icons/fc";

function SidebarLec() {
    const [expand, setExpand] = useState(true);
    const [isAvatarVisible, setIsAvatarVisible] = useState(false);
    const [activeItem, setActiveItem] = useState('');
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setExpand(!expand);
        setIsAvatarVisible(!isAvatarVisible);
    };

    const [lec, setLec] = useState({});

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
                            <FcReadingEbook size={70} />

                            <div className="user-info">
                                <span className="user-name"><strong>{lec.firstName + ' ' + lec.lastName}</strong></span>
                                <span className="user-role">Giảng viên</span>
                            </div>
                        </div>
                    )}
                    <hr style={{ color: '#fff' }}></hr>
                    <ul className="sidebar-nav">
                        <li className="sidebar-item">
                            <a href="/homeLecturer" className="sidebar-link">
                                <i className="lni lni-user"><HomeOutlinedIcon /></i>
                                <span>Trang chủ</span>
                            </a>
                        </li>
                        <li className="sidebar-item">
                            <a href="/profleLecturer" className="sidebar-link">
                                <i className="lni lni-agenda"><PersonOutlinedIcon /></i>
                                <span>Trang cá nhân</span>
                            </a>
                        </li>
                        <li className="sidebar-item">
                            <a href="/registerTopicofLec" className="sidebar-link">
                                <i className="lni lni-popup"><RecentActorsOutlinedIcon /></i>
                                <span>Đăng ký đề tài</span>
                            </a>
                        </li>
                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse" data-bs-target="#auth"
                                aria-expanded="false" aria-controls="auth">
                                <i className="lni lni-protection"><FactCheckOutlinedIcon /></i>
                                <span>Quản lý đề tài</span>
                            </a>
                            <ul id="auth" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                                <li className="sidebar-item">
                                    <a style={{ marginLeft: '10px' }} href="/managermentTopicLec" className="sidebar-link">Đề tài của tôi</a>
                                </li>
                                <li className="sidebar-item">
                                    <a style={{ marginLeft: '10px' }} href="/managermentTopicPBLec" className="sidebar-link">Đề tài phản biện</a>
                                </li>
                                <li className="sidebar-item">
                                    <a style={{ marginLeft: '10px' }} href="/thesisCommittee" className="sidebar-link">Hội đồng báo cáo</a>
                                </li>
                                <li className="sidebar-item">
                                    <a style={{ marginLeft: '10px' }} href="/completedTopic" className="sidebar-link">Đề tài đã thực hiện</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </aside>
            </div>
        </>
    );
}

export default SidebarLec