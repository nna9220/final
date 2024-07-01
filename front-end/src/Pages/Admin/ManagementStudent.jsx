import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/SidebarAdmin'
import Datatable from '../../components/dataTable/Datatable'
import './ManagementStudent.scss'
import { Kanban } from '@syncfusion/ej2-react-kanban'
import { useEffect, useState } from 'react'
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import { Navigate } from 'react-router-dom';

function ManagementStudent() {
  useEffect(() => {
    document.title = "Quản lý sinh viên";
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
    <div style={{
      backgroundImage: `url(${process.env.PUBLIC_URL}/assets/bg-admin.png)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh'
    }} className='manaStudentOfAdmin'>
      <Sidebar style={{ backgroundColor: 'white' }} />
      <div className="homeContainer">
        <Navbar />
        <hr />
        <div className="widgets">
          <div className='headMana-class'>
            <div className='titleMana-class'>
              <h5>QUẢN LÝ SINH VIÊN</h5>
            </div>
            <div style={{
              marginTop: '20px',
              marginRight: '20px',
              marginBottom: '20px',
              backgroundColor: 'white',
              width: '100%',
              height: '100%',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              <div style={{ flex: 1, overflow: 'auto' }}>
                <Datatable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagementStudent