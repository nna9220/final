import React from 'react'
import KanbanBoard from '../../components/Kanban/Board'
import SidebarStudent from '../../components/Sidebar/SidebarStudent'
import Navbar from '../../components/Navbar/Navbar'
import Context from '../../components/Context/Context'

function ManagementTopic() {
  return (
    <div className='HomeStudent'>
        <SidebarStudent/>
        <div className='context'>
          <Navbar/>
          <hr/>
          <div className='widgets'>
            <div className='header-notification'>
              <h4 className='title'>QUẢN LÝ ĐỀ TÀI</h4>
            </div>
                <KanbanBoard/>
            </div>
        </div>
    </div>
  )
}

export default ManagementTopic