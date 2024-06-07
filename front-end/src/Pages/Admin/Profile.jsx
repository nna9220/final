import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/SidebarAdmin'
import './profile.scss'
import EditProfile from '../../components/Profile/ProfileAd/EditProfile'
import { useEffect, useState} from 'react'
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import { Navigate} from 'react-router-dom';
function Profile() {
    useEffect(() => {
        document.title = "Trang cá nhân";
    }, []);
    const [authorized, setAuthorized] = useState(true);

    useEffect(() => {
        const checkAuthorization = async () => {
            const userToken = getTokenFromUrlAndSaveToStorage(); // Lấy token từ URL hoặc từ bất kỳ nguồn nào khác
            if (userToken) {
                try {
                    const response = await axiosInstance.post('/check-authorization/admin',null, {
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
        <div className='ProfileAdmin'>
            <Sidebar />
            <div className="context">
                <Navbar />
                <hr />
                <div className='headMana-class'>
                    <div className='titleMana-class'>
                        <h5>Trang cá nhân</h5>
                    </div>
                </div>
                <div className='homeMana-class'>
                    <EditProfile />
                </div>
            </div>
        </div>
    )
}

export default Profile