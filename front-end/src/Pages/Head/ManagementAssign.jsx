import React, { useState, useEffect, useContext } from 'react';
import SidebarHead from '../../components/Sidebar/SidebarHead';
import Navbar from '../../components/Navbar/Navbar';
import './MannageHead.scss';
import TableAssign from '../../components/TableOfHead/AssignTable/TableAssign';
import TableAssignKL from '../../components/TableOfHead/AssignTable/TableAssignKL';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import { Navigate } from 'react-router-dom';

function ManagementAssign() {
  useEffect(() => {
    document.title = "Phân giảng viên phản biện";
  }, []);

  const [authorized, setAuthorized] = useState(true);
  const userToken = getTokenFromUrlAndSaveToStorage();
  const [selectedTitle, setSelectedTitle] = useState("Tiểu luận chuyên ngành");
  const [unreadCount, setUnreadCount] = useState(0);
  const handleDropdownChange = (e) => {
    setSelectedTitle(e.target.value);
  };
  useEffect(() => {
    const checkAuthorization = async () => {
      if (userToken) {
        try {
          const response = await axiosInstance.post('/check-authorization/head', null, {
            headers: {
              'Authorization': `Bearer ${userToken}`,
            },
          });
          if (response.data === "Authorized") {
            setAuthorized(true);
          } else {
            setAuthorized(false);
          }
        } catch (error) {
          setAuthorized(false);
        }
      } else {
        setAuthorized(false);
      }
    };

    checkAuthorization();
  }, [userToken]);

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
        <Navbar unreadCount={unreadCount} />
        <hr></hr>
        <div className='context-menu'>
          <div className='home-head'>
            <div className='title-head'>
              <h5>PHÂN GIẢNG VIÊN PHẢN BIỆN</h5>
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
            <div className='card-nd-assign'>
              <div className='table-items'>
                {selectedTitle === "Tiểu luận chuyên ngành" ? <TableAssign /> : <TableAssignKL />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagementAssign