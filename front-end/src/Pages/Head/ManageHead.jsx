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
          // Gửi token đến backend để kiểm tra quyền truy cập
          const response = await axiosInstance.post('/admin/check-authorization/head', { token: userToken });
          if (response.data.authorized) {
            // Nếu có quyền truy cập, setAuthorized(true)
            setAuthorized(true);
          } else {
            // Nếu không có quyền truy cập, setAuthorized(false) và chuyển hướng đến trang không được ủy quyền
            setAuthorized(false);
          }
        } catch (error) {
          console.error("Error checking authorization:", error);
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
