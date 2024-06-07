import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/SidebarAdmin'
import Datatable from '../../components/dataTable/Datatable'
import './ManagementStudent.scss'
import { Kanban } from '@syncfusion/ej2-react-kanban'
import { useEffect } from 'react'

function ManagementStudent() {
  useEffect(() => {
    document.title = "Quản lý sinh viên";
  }, []);
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