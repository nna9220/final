import React, { useEffect } from 'react';
import SidebarStudent from '../../components/Sidebar/SidebarStudent';
import Navbar from '../../components/Navbar/Navbar';
import './ManagementTopic.scss';
import KanbanBoardKL from '../../components/Kanban/Graduation/KanbanBoardKL';

function ManagementTopicGraduation() {
    useEffect(() => {
        document.title = "Quản lý đề tài - Khóa luận tốt nghiệp";
      }, []);
    
      return (
        <div className='HomeStudent'>
          <SidebarStudent />
          <div className='context'>
            <Navbar />
            <hr />
            <div className='widgets'>
              <div className='header-notification'>
                <h4 className='title'>QUẢN LÝ ĐỀ TÀI - KHÓA LUẬN TỐT NGHIỆP</h4>
              </div>
              <KanbanBoardKL />
            </div>
          </div>
        </div>
      );
}

export default ManagementTopicGraduation