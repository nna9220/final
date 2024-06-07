import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/SidebarAdmin';
import Context from '../../components/Context/Context';
import './HomeAdmin.scss';
import Chatbot from '../../components/ChatBot/Chatbot';
import axiosInstance from '../../API/axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { useNavigate } from 'react-router-dom'; // Import useNavigate từ React Router

function HomeAdmin() {
    const [isSidebarClosed, setSidebarClosed] = useState(false);
    const userToken = getTokenFromUrlAndSaveToStorage();

    const navigate = useNavigate(); // Sử dụng hook useNavigate
    useEffect(() => {
        document.title = "Trang chủ Admin";
        axiosInstance.post("/admin/check-authorization/", null, {
            headers: {
                Authorization: "Bearer " + userToken // Thay yourAuthToken bằng token của người dùng
            }
        })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            if (error.response && error.response.status === 401) {
                // Nếu trả về mã lỗi 401 (Unauthorized), chuyển hướng về trang chủ
                navigate('/'); // Chuyển hướng về trang chủ (hoặc URL khác nếu muốn)
            } else {
                console.error("Unexpected error:", error.message);
            }
        });
    }, [navigate]);

    return (
        <div className="HomeAdmin">
            <Sidebar />
            <div className='homeContainer'>
                <Navbar />
                <hr />
                <div className='widgets'>
                    <div className='headMana-class'>
                        <div className='titleMana-class'>
                            <h5>Trang chủ</h5>
                        </div>
                    </div>
                    <div className='homeMana-class'>
                        <Context />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeAdmin;
