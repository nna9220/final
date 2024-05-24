import React, { useEffect } from 'react';
import KanbanBoard from '../../components/Kanban/Board';
import SidebarStudent from '../../components/Sidebar/SidebarStudent';
import Navbar from '../../components/Navbar/Navbar';
import './ManagementTopic.scss';

function ManagementTopic() {
  useEffect(() => {
    document.title = "Quản lý đề tài - Tiểu luận tiêu ngành";
  }, []);

  return (
    <div className='HomeStudent'>
      <SidebarStudent />
      <div className='context'>
        <Navbar />
        <hr />
        <div className='widgets'>
          <div className='header-notification'>
            <h4 className='title'>QUẢN LÝ ĐỀ TÀI - TIỂU LUẬN CHUYÊN NGÀNH</h4>
          </div>
          <KanbanBoard />
        </div>
      </div>
    </div>
  );
}

export default ManagementTopic;
