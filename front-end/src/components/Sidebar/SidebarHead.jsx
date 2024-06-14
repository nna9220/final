import React, { useState, useEffect } from 'react';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import RecentActorsOutlinedIcon from '@mui/icons-material/RecentActorsOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import HowToVoteOutlinedIcon from '@mui/icons-material/HowToVoteOutlined';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import './SidebarHead.scss'
import { useNavigate } from 'react-router-dom';
import { FcReadingEbook } from "react-icons/fc";

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
                            <FcReadingEbook size={50} />
                            <div className="user-info">
                                <span className="user-name"><strong>{head.firstName + ' ' + head.lastName}</strong></span>
                                <span className="user-role">Trưởng bộ môn</span>
                                <span className="user-role">{head.major}</span>
                            </div>
                        </div>
                    )}
                    <hr style={{ color: '#fff' }}></hr>
                    <ul className="sidebar-nav">
                        <li className="sidebar-item">
                            <a href="/homeHead" className="sidebar-link">
                                <i className="lni lni-user"><HomeOutlinedIcon /></i>
                                <span>Trang chủ</span>
                            </a>
                        </li>
                        <li className="sidebar-item">
                            <a href="/profileHead" className="sidebar-link">
                                <i className="lni lni-agenda"><PersonOutlinedIcon /></i>
                                <span>Trang cá nhân</span>
                            </a>
                        </li>
                        <li className="sidebar-item">
                            <a href="/registerHead" className="sidebar-link">
                                <i className="lni lni-popup"><RecentActorsOutlinedIcon /></i>
                                <span>Đăng ký đề tài</span>
                            </a>
                        </li>
                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse" data-bs-target="#auth"
                                aria-expanded="false" aria-controls="auth">
                                <i className="lni lni-protection"><FactCheckOutlinedIcon /></i>
                                <span>Quản lý quá trình</span>
                            </a>
                            <ul id="auth" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                                <li className="sidebar-item">
                                    <a style={{ marginLeft: '10px' }} href="/managermentHead/approve" className="sidebar-link">Duyệt đề tài</a>
                                </li>
                                <li className="sidebar-item">
                                    <a style={{ marginLeft: '10px' }} href="/managermentHead/approvebefore" className="sidebar-link">Duyệt đề tài trước phản biện</a>
                                </li>
                                <li className="sidebar-item">
                                    <a style={{ marginLeft: '10px' }} href="/managementHead/assign" className="sidebar-link">Phân giảng viên phản biện</a>
                                </li>
                                <li className="sidebar-item">
                                    <a style={{ marginLeft: '10px' }} href="/managementHead/criteria" className="sidebar-link">Tiêu chí phản biện</a>
                                </li>
                                <li className="sidebar-item">
                                    <a style={{ marginLeft: '10px' }} href="/defensepanel" className="sidebar-link">Lập hội đồng</a>
                                </li>
                            </ul>
                        </li>
                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse" data-bs-target="#auth2"
                                aria-expanded="false" aria-controls="auth">
                                <i className="lni lni-protection"><FactCheckOutlinedIcon /></i>
                                <span>Quản lý đề tài</span>
                            </a>
                            <ul id="auth2" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                                <li className="sidebar-item">
                                    <a style={{ marginLeft: '10px' }} href="/managementHead/topics" className="sidebar-link">Đề tài của tôi</a>
                                </li>
                                <li className="sidebar-item">
                                    <a style={{ marginLeft: '10px' }} href="/managermentHead/TopicsPB" className="sidebar-link">Đề tài phản biện</a>
                                </li>
                                <li className="sidebar-item">
                                    <a style={{ marginLeft: '10px' }} href="/managermentHead/thesisEvaluation" className="sidebar-link">Hội đồng báo cáo</a>
                                </li>
                                <li className="sidebar-item">
                                    <a style={{ marginLeft: '10px' }} href="/managermentHead/completedTopic" className="sidebar-link">Đề tài đã thực hiện</a>
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
