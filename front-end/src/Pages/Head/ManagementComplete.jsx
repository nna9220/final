import React from 'react'
import CompleteTopic from '../../components/TableOfHead/CompleteTopic/CompleteTopic';
import CompleteTopicKL from '../../components/TableOfHead/CompleteTopic/CompleteTopicKL';
import Navbar from '../../components/Navbar/Navbar'
import { useEffect, useState, useContext } from 'react'
import SidebarHead from '../../components/Sidebar/SidebarHead';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import { Navigate} from 'react-router-dom';

function ManagementComplete() {
    useEffect(() => {
        document.title = "Đề tài đã thực hiện";
    }, []);
    const [selectedTitle, setSelectedTitle] = useState("Tiểu luận chuyên ngành");
    const [unreadCount, setUnreadCount] = useState(0);

    const handleDropdownChange = (e) => {
        setSelectedTitle(e.target.value);
    };
    const userToken = getTokenFromUrlAndSaveToStorage();
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
    
    useEffect(() => {
        const fetchNotifications = async () => {
          if (userToken) {
            try {
              const response = await axiosInstance.get('/head/notification', {
                headers: {
                  'Authorization': `Bearer ${userToken}`,
                },
              });
              const notifications = response.data;
              const readNotifications = new Set(JSON.parse(localStorage.getItem('readNotifications')) || []);
              const unreadCount = notifications.filter(notification => !readNotifications.has(notification.notificationId)).length;
              setUnreadCount(unreadCount);
            } catch (error) {
              console.error(error);
            }
          }
        };
    
        fetchNotifications();
      }, [userToken]);

    if (!authorized) {
        return <Navigate to="/" />;
    }
    
    return (
        <div className='homeHead'>
      <SidebarHead unreadCount={unreadCount} />
            <div className='context'>
            <Navbar/>
                <hr></hr>
                <div className='context-menu'>
                <div className='home-head'>
                        <div className='title-head'>
                            <h5>ĐỀ TÀI ĐÃ THỰC HIỆN</h5>
                        </div>
                    </div>
                    <div className='context-nd'>
                        <div className='card-nd'>
                            <label htmlFor="selectTitle" style={{ marginTop: '5px', marginLeft: '30px' }}>Chọn loại đề tài</label>
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
                                {selectedTitle === "Tiểu luận chuyên ngành" ? <CompleteTopic /> : <CompleteTopicKL />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagementComplete