import React, { useState, useEffect, useContext } from 'react';
import SidebarHead from '../../components/Sidebar/SidebarHead';
import Navbar from '../../components/Navbar/Navbar';
import './MannageHead.scss';
import TableApprove from '../../components/TableOfHead/ApproveTable/TableApprove';
import TableApproveKL from '../../components/TableOfHead/ApproveTable/TableApproveKL';
import { Navigate } from 'react-router-dom';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';

function MannageHead() {
  useEffect(() => {
    document.title = "Duyệt đề tài";
  }, []);
  const [authorized, setAuthorized] = useState(true);
  const [selectedTitle, setSelectedTitle] = useState("Tiểu luận chuyên ngành");
  const [unreadCount, setUnreadCount] = useState(0);

  const userToken = getTokenFromUrlAndSaveToStorage();
  const handleDropdownChange = (e) => {
    setSelectedTitle(e.target.value);
  };

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

  if (!authorized) {
    return <Navigate to="/" />;
  }


  return (
    <div className='homeManagement'>
      <SidebarHead unreadCount={unreadCount} />
      <div className='managementContext'>
        <Navbar  />
        <hr />
        <div className='context-menu'>
          <div className='contaxt-title'>
            <div className='title-head'>
              <h5>QUẢN LÝ ĐỀ TÀI</h5>
            </div>
          </div>
          <div className='context-nd'>
            <div className='card-nd'>
              <div className="dropdown">
                <div className="dropdown-title">Duyệt đề tài</div>
                <div className="dropdown-content">
                  <a href="#" onClick={() => handleDropdownClick('Duyệt đề tài', 'Tiểu luận chuyên ngành', <TableApprove />)}>Tiểu luận chuyên ngành</a>
                  <a href="#" onClick={() => handleDropdownClick('Duyệt đề tài', 'Khóa luận tốt nghiệp', <TableApproveKL />)}>Khóa luận tốt nghiệp</a>
                </div>
              </div>
            </div>
          </div>
          <div className='context-nd' style={{ marginTop: '30px' }}>
            <div className="form-title">
              <span>{selectedTitle.title1}</span>
              <hr className="line" />
            </div>
            <div className='card-nd' style={{ display: 'block' }}>
              <div className='title-nd'>{selectedTitle.title2}</div>
              <div className='table-items'>
                {selectedTitle.table}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MannageHead;
