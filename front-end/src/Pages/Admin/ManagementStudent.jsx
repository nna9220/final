import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/SidebarAdmin'
import Datatable from '../../components/dataTable/Datatable'
import './ManagementStudent.scss'
import { Kanban } from '@syncfusion/ej2-react-kanban'
import { useEffect, useState } from 'react'
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import { Navigate} from 'react-router-dom';

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
    <div className='manaStudentOfAdmin'>
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <hr />
        <div className='widgets'>
          <div className='headMana-class'>
            <div className='titleMana-class'>
              <h5>quản lý sinh viên</h5>
            </div>
          </div>
          <div className='homeMana-class'>
            <Datatable />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagementStudent