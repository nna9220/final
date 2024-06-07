import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/SidebarAdmin';
import './ManagementPeriod.scss';
import DataTableTimeApprove from '../../components/dataTable/DataTableTimeApprove';
import DataTableTimeApproveKL from '../../components/dataTable/DataTableTimeApproveKL';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import { Navigate } from 'react-router-dom';

function ManagementTimeApprove() {
    useEffect(() => {
        document.title = "Quản lý duyệt đề tài";
    }, []);
    const [activeTab, setActiveTab] = useState('student');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const [authorized, setAuthorized] = useState(true);

    useEffect(() => {
        const checkAuthorization = async () => {
            const userToken = getTokenFromUrlAndSaveToStorage(); // Lấy token từ URL hoặc từ bất kỳ nguồn nào khác
            if (userToken) {
                try {
                    const response = await axiosInstance.post('/check-authorization/admin', null, {
                        headers: {
                            'Authorization': `Bearer ${userToken}`,
                        },
                    });
                    console.log("Nhận : ", response.data);
                    if (response.data == "Authorized") {
                        setAuthorized(true);
                    } else {
                        setAuthorized(false);
                    }
                } catch (error) {
                    if (error.response) {
                        console.error("Response error:", error.response.data);
                        console.error("Response status:", error.response.status);
                        console.error("Response headers:", error.response.headers);
                        setAuthorized(false);
                    } else if (error.request) {
                        console.error("Request error:", error.request);
                        setAuthorized(false);
                    } else {
                        console.error("Axios error:", error.message);
                        setAuthorized(false);
                    }
                }
            } else {
                // Nếu không có token, setAuthorized(false) và chuyển hướng đến trang không được ủy quyền
                setAuthorized(false);
            }
        };

        checkAuthorization();
    }, []);

    if (!authorized) {
        return <Navigate to="/" />;
    }
    return (
        <div>
            <div className='manaStudentOfAdmin'>
                <Sidebar />
                <div className="homeContainer">
                    <Navbar />
                    <hr />
                    <div className="widgets">
                        <div className='headMana-class'>
                            <div className='titleMana-class'>
                                <h5>Quản lý duyệt đề tài</h5>
                            </div>
                            <div className='menuMana'>
                                <button
                                    className={activeTab === 'student' ? 'active' : ''}
                                    onClick={() => handleTabClick('student')}
                                >
                                    Tiểu luận chuyên ngành
                                </button>
                                <button
                                    className={activeTab === 'lecturer' ? 'active' : ''}
                                    onClick={() => handleTabClick('lecturer')}
                                >
                                    Khóa luận tốt nghiệp
                                </button>
                            </div>
                        </div>
                        <div className='homeMana'>
                            {activeTab === 'student' && <DataTableTimeApprove />}
                            {activeTab === 'lecturer' && <DataTableTimeApproveKL />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagementTimeApprove