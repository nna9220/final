import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/SidebarAdmin'
import './ManagementLec.scss'
import DatatableLec from '../../components/dataTable/DatatableLec'
import { useEffect } from 'react'
function ManagementLec() {
    useEffect(() => {
        document.title = "Quản lý giảng viên";
    }, []);
    return (
        <div>
            <div className='manaStudentOfAdmin'>
                <Sidebar />
                <div className="homeContainer">
                    <Navbar />
                    <hr />
                    <div className="widgets">
                        <div className='headMana'>
                            < div className='titleMana' >
                                <h3>Quản lý giảng viên</h3>
                            </div >
                            <div className='homeMana'>
                                <DatatableLec />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagementLec