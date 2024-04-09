import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/SidebarAdmin'
import './ManagementLec.scss'
import DatatableLec from '../../components/dataTable/DatatableLec'

function ManagementLec() {
    return (
        <div>
            <div className='manaStudentOfAdmin'>
                <Sidebar />
                <div className="homeContainer">
                    <Navbar />
                    <hr />
                    <div className="widgets">
                        <div className='titleMana'>
                            <h3>Quản lý giảng viên</h3>
                        </div>
                        <div className='homeMana'>
                            <DatatableLec />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagementLec