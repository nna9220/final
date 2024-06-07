import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/SidebarAdmin';
import Context from '../../components/Context/Context';
import './HomeAdmin.scss';
import Chatbot from '../../components/ChatBot/Chatbot';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { Navigate} from 'react-router-dom';
import axiosInstance from '../../API/axios';
function HomeAdmin() {
    const [isSidebarClosed, setSidebarClosed] = useState(false);
    useEffect(() => {
        document.title = "Trang chủ Admin";
    }, []);

    const [authorized, setAuthorized] = useState(true);

    // Kiểm tra quyền truy cập
    useEffect(() => {
        const checkAuthorization = async () => {
            const userToken = getTokenFromUrlAndSaveToStorage(); // Lấy token từ URL hoặc từ bất kỳ nguồn nào khác
            if (userToken) {
                try {
                    // Gửi token đến backend để kiểm tra quyền truy cập
                    const response = await axiosInstance.post('/admin/check-authorization/admin',null, {
                        headers: {
                            'Authorization': `Bearer ${userToken}`,
                        },
                });
                    console.log("trước if : ", response.data);
                    if (response.data == "Authorized") {
                        // Nếu có quyền truy cập, setAuthorized(true)
                        setAuthorized(true);
                    } else {
                        // Nếu không có quyền truy cập, setAuthorized(false) và chuyển hướng đến trang không được ủy quyền
                        setAuthorized(false);
                    }
                } catch (error) {
                    if (error.response) {
                        // Request made and server responded
                        console.error("Response error:", error.response.data);
                        console.error("Response status:", error.response.status);
                        console.error("Response headers:", error.response.headers);
                        setAuthorized(false);
                    } else if (error.request) {
                        // Request made but no response received
                        console.error("Request error:", error.request);
                    } else {
                        // Something else happened while setting up the request
                        console.error("Axios error:", error.message);
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
