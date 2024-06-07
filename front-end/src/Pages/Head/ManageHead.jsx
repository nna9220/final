import React, { useState, useEffect, useContext } from 'react';
import SidebarHead from '../../components/Sidebar/SidebarHead';
import Navbar from '../../components/Navbar/Navbar';
import './MannageHead.scss';
import TableApprove from '../../components/TableOfHead/ApproveTable/TableApprove';
import TableApproveKL from '../../components/TableOfHead/ApproveTable/TableApproveKL';
import { NotificationContext } from './NotificationContext';
import { Navigate } from 'react-router-dom';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';

function MannageHead() {
  useEffect(() => {
    document.title = "Quản lý đề tài";
  }, []);

  // Sử dụng useContext để lấy giá trị từ context
  const { notifications, unreadCount } = useContext(NotificationContext);

  const [selectedTitle, setSelectedTitle] = useState({ title1: 'Duyệt đề tài', title2: '', table: null });

  const handleDropdownClick = (title1, title2, table) => {
    setSelectedTitle({ title1, title2, table });
  };

  const [authorized, setAuthorized] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      const userToken = getTokenFromUrlAndSaveToStorage(); // Lấy token từ URL hoặc từ bất kỳ nguồn nào khác
      if (userToken) {
        try {
          const response = await axiosInstance.post('/check-authorization/head', null, {
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
    <div className='homeManagement'>
      <SidebarHead />
      <div className='managementContext'>
        {/* Truyền unreadCount cho Navbar */}
        <Navbar unreadCount={unreadCount} />
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
