import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/SidebarAdmin';
import './ManagementYears.scss';
import DataYears from '../../components/dataTable/DataYears';
import DataClass from '../../components/dataTable/DataClass';
import { useEffect } from 'react';

function ManagementYears() {
    useEffect(() => {
        document.title = "Quản lý niên khóa";
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
                                <h5>Quản lý Niên khóa</h5>
                            </div>
                        </div>
                        <div className='homeMana-class'>
                            <DataYears />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagementYears;
