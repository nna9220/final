import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/SidebarAdmin';
import './ManagermentPeroid.scss';
import DataTablePeroid from '../../components/dataTable/DataTablePeroid';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import { Navigate } from 'react-router-dom';
import DataTablePeroidGraduation from '../../components/dataTable/DataTablePeroidGraduation';

function ManagermentPeroidGraduation() {
    useEffect(() => {
        document.title = "Quản lý đợt đăng ký đề tài";
    }, []);

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
                    if (response.data === "Authorized") {
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
                setAuthorized(false);
            }
        };

        checkAuthorization();
    }, []);

    if (!authorized) {
        return <Navigate to="/" />;
    }

    return (
        <div style={{ 
            backgroundImage: `url(${process.env.PUBLIC_URL}/assets/bg-admin.png)`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            backgroundRepeat: 'no-repeat', 
            minHeight: '100vh' 
        }} className='manaStudentOfAdmin'>
            <Sidebar style={{backgroundColor: 'white'}}/>
            <div className="homeContainer">
                <Navbar />
                <hr />
                <div className="widgets">
                    <div className='headMana-class'>
                        <div className='titleMana-class'>
                            <h5>Quản lý đợt đăng ký - khóa luận tốt nghiệp</h5>
                        </div>
                        <div style={{marginTop:'20px',marginRight:'20px',marginBottom:'20px', backgroundColor:'white', width:'100%', height:'125vh', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'}}>
                            <DataTablePeroidGraduation/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagermentPeroidGraduation;
