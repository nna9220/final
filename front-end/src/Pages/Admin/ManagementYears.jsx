import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/SidebarAdmin'
import './ManagementYears.scss'
import DatatableLec from '../../components/dataTable/DatatableLec'
import DataYears from '../../components/dataTable/DataYears'
import DataClass from '../../components/dataTable/DataClass'
import { useEffect } from 'react'
function ManagementYears() {
    useEffect(() => {
        document.title = "Quản lý niên khóa";
      }, []);
    const [yearClass, setYearClass] = useState('years');
    const [selectedTitle, setSelectedTitle] = useState({
        title1: 'Quản lý niên khóa',
        title2: 'Quản lý lớp học',
    });

    const handleClickYears = () => {
        setYearClass('years');
        setSelectedTitle({
            ...selectedTitle,
            title1: 'Quản lý niên khóa',
        });
    };

    const handleClickClass = () => {
        setYearClass('class');
        setSelectedTitle({
            ...selectedTitle,
            title2: 'Quản lý lớp học',
        });
    };

    return (
        <div>
            <div className='manaStudentOfAdmin'>
                <Sidebar />
                <div className="homeContainer">
                    <Navbar />
                    <hr />
                    <div className="widgets">
                        <div className='headMana'>
                            <div className='titleMana'>
                                <h3>Quản lý đợt đăng ký đề tài</h3>
                            </div>
                            <div className='menuMana'>
                                <button onClick={handleClickYears} className='btnMana'>Quản lý niên khóa</button>
                                <button onClick={handleClickClass} className='btnMana'>Quản lý lớp học</button>
                            </div>
                        </div>
                        <div className="form-title">
                            <span>{yearClass === 'years' ? selectedTitle.title1 : selectedTitle.title2}</span>
                            <hr className="line" />
                        </div>
                        <div className='homeMana'>
                            {yearClass === 'years' && <DataYears />}
                            {yearClass === 'class' && <DataClass />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagementYears