import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/SidebarAdmin'
import './ManagementLec.scss'
import { useEffect } from 'react'
import DataGuest from '../../components/dataTable/DataGuest'

function ManagementGuest() {
    useEffect(() => {
        document.title = "Quản lý khách";
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
                                <h3>Quản lý khách</h3>
                            </div >
                            <div className='homeMana'>
                                <DataGuest />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagementGuest