import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/SidebarAdmin';
import './ManagementClass.scss';
import DataClass from '../../components/dataTable/DataClass';
import { useEffect } from 'react';

function ManagementClass() {
  useEffect(() => {
    document.title = "Quản lý Lớp";
}, []);

return (
    <div>
        <div className='manaStudentOfAdmin'>
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <hr />
                <div className="widgets-class">
                    <div className='headMana-class'>
                        <div className='titleMana-class'>
                            <h5>Quản lý lớp</h5>
                        </div>
                    </div>
                    <div className='homeMana-class'>
                        <DataClass />
                    </div>
                </div>
            </div>
        </div>
    </div>
);
}

export default ManagementClass