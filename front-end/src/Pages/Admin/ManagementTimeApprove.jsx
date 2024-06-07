import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/SidebarAdmin';
import './ManagementPeriod.scss';
import DataTableTimeApprove from '../../components/dataTable/DataTableTimeApprove';
import DataTableTimeApproveKL from '../../components/dataTable/DataTableTimeApproveKL';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import { Navigate} from 'react-router-dom';

function ManagementTimeApprove() {
    useEffect(() => {
        document.title = "Quản lý duyệt đề tài";
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
                      // Gửi token đến backend để kiểm tra quyền truy cập
                      const response = await axiosInstance.post('/admin/check-authorization/adminn', { token: userToken });
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
        <div>
            <div className='manaStudentOfAdmin'>
                <Sidebar />
                <div className="homeContainer">
                    <Navbar />
                    <hr />
                    <div className="widgets">
                        <div className='headMana-class'>
                            <div className='titleMana-class'>
                                <h5>Quản lý duyệt đề tài</h5>
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
                        <div className='homeMana'>
                            {activeTab === 'student' && <DataTableTimeApprove />}
                            {activeTab === 'lecturer' && <DataTableTimeApproveKL/>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagementTimeApprove