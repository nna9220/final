import React from 'react'
import SidebarHead from '../../components/Sidebar/SidebarHead'
import Navbar from '../../components/Navbar/Navbar'
import './HomeHead.scss'
import { useEffect, useContext, useState} from 'react'
import DataTableTopicSuccess from '../../components/TableOfHead/DefensePanel/DataTableTopicSuccess'
import { NotificationContext } from './NotificationContext';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import { Navigate} from 'react-router-dom';
import DataTableTopicSuccessKL from '../../components/TableOfHead/DefensePanel/DataTableTopicSuccessKL'

function DefensePanel() {
    useEffect(() => {
        document.title = "Lập hội đồng";
    }, []);
    const { notifications, unreadCount } = useContext(NotificationContext);
    const [selectedTitle, setSelectedTitle] = useState("Tiểu luận chuyên ngành");
    const handleDropdownChange = (e) => {
        setSelectedTitle(e.target.value);
    };
    <Navbar unreadCount={unreadCount} />
    const [authorized, setAuthorized] = useState(true);

    useEffect(() => {
        const checkAuthorization = async () => {
            const userToken = getTokenFromUrlAndSaveToStorage(); // Lấy token từ URL hoặc từ bất kỳ nguồn nào khác
            if (userToken) {
                try {
                    const response = await axiosInstance.post('/check-authorization/head',null, {
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
        <div className='homeHead'>
            <SidebarHead />
            <div className='context'>
                <Navbar></Navbar>
                <hr></hr>
                <div className='context-menu'>
                <div className='home-head'>
                        <div className='title-head'>
                            <h5>LẬP HỘI ĐỒNG</h5>
                        </div>
                    </div>
                    <div className='context-nd'>
                        <div className='card-nd'>
                            <label htmlFor="selectTitle" style={{ marginTop: '20px', marginLeft: '30px' }}>Chọn loại đề tài</label>
                            <div className="dropdown">
                                <select id="selectTitle" className="form-se" aria-label="Default select example" onChange={handleDropdownChange}>
                                    <option className='optionSe' value="Tiểu luận chuyên ngành">Tiểu luận chuyên ngành</option>
                                    <option className='optionSe' value="Khóa luận tốt nghiệp">Khóa luận tốt nghiệp</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className='context-nd' style={{ marginTop: '30px' }}>
                        <div className="form-title">
                            <span>{selectedTitle}</span>
                            <hr className="line" />
                        </div>
                        <div className='card-nd-topicPB' style={{ display: 'block' }}>
                            <div className='table-items-topicPB'>
                                {selectedTitle === "Tiểu luận chuyên ngành" ? <DataTableTopicSuccess /> : <DataTableTopicSuccessKL />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DefensePanel