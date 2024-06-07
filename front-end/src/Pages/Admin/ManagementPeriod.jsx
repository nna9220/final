import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/SidebarAdmin';
import './ManagementPeriod.scss';
import DataTableRegistrationPeroidLec from '../../components/dataTable/DataTableRegistrationPeroidLec';
import DataTableRegistrationPeroidSt from '../../components/dataTable/DataTableRegistrationPeroidSt';

function ManagementPeriod() {
    useEffect(() => {
        document.title = "Quản lý đợt đăng ký đề tài";
    }, []);

    const [activeTab, setActiveTab] = useState('student');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div>
            <div className='manaStudentOfAdmin'>
                <Sidebar />
                <div className="homeContainer">
                    <Navbar />
                    <hr />
                    <div className="widgets">
                        <div className='headMana-class'>
                            <div className='titleMana-class'>
                                <h5>Quản lý đợt đăng ký đề tài</h5>
                            </div>
                            <div className='menuMana'>
                                <button
                                    className={activeTab === 'student' ? 'active' : ''}
                                    onClick={() => handleTabClick('student')}
                                >
                                    Đợt đăng ký đề tài cho Sinh Viên
                                </button>
                                <button
                                    className={activeTab === 'lecturer' ? 'active' : ''}
                                    onClick={() => handleTabClick('lecturer')}
                                >
                                    Đợt đăng ký đề tài cho Giảng Viên
                                </button>
                            </div>
                        </div>
                        <div className='homeMana'>
                            {activeTab === 'student' && <DataTableRegistrationPeroidSt />}
                            {activeTab === 'lecturer' && <DataTableRegistrationPeroidLec />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagementPeriod;
