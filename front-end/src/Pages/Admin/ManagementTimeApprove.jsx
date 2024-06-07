import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/SidebarAdmin';
import './ManagementPeriod.scss';
import DataTableTimeApprove from '../../components/dataTable/DataTableTimeApprove';
import DataTableTimeApproveKL from '../../components/dataTable/DataTableTimeApproveKL';

function ManagementTimeApprove() {
    useEffect(() => {
        document.title = "Quản lý duyệt đề tài";
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
                                <h5>Quản lý duyệt đề tài</h5>
                            </div>
                            <div className='menuMana'>
                                <button
                                    className={activeTab === 'student' ? 'active' : ''}
                                    onClick={() => handleTabClick('student')}
                                >
                                    Tiểu luận chuyên ngành
                                </button>
                                <button
                                    className={activeTab === 'lecturer' ? 'active' : ''}
                                    onClick={() => handleTabClick('lecturer')}
                                >
                                    Khóa luận tốt nghiệp
                                </button>
                            </div>
                        </div>
                        <div className='homeMana'>
                            {activeTab === 'student' && <DataTableTimeApprove />}
                            {activeTab === 'lecturer' && <DataTableTimeApproveKL/>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagementTimeApprove