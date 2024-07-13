import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/SidebarAdmin'
import './ManagementTopics.scss'
import DataTableTopics from '../../components/dataTable/DataTableTopics'
import { useEffect, useState } from 'react'
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import { Navigate } from 'react-router-dom';
import DataTableTopicsKL from '../../components/dataTable/DataTableTopicsKL'
function ManagementTopics() {
  useEffect(() => {
    document.title = "Quản lý đề tài";
  }, []);

  const [activeTab, setActiveTab] = useState('student');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

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
    <div className='manaStudentOfAdmin'>
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <hr />
        <div className="widgets">
          <div className='headMana-class'>
            <div className='titleMana-class'>
              <h5>Quản lý đề tài</h5>
            </div>
            <div className='menuMana'>
              <button
                className={activeTab === 'student' ? 'active' : ''}
                onClick={() => handleTabClick('student')}
              >
                Tiểu luận chuyên ngành
              </button>
              <button
                className={activeTab === 'lecturer' ? 'active' : ''}
                onClick={() => handleTabClick('lecturer')}
              >
                Khóa luận tốt nghiệp
              </button>
            </div>
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
              {activeTab === 'student' && <DataTableTopics />}
              {activeTab === 'lecturer' && <DataTableTopicsKL />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagementTopics