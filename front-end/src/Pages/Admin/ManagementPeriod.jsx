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
    const [regis, setRegis] = useState('student');
    const [selectedTitle, setSelectedTitle] = useState({
        title1: 'Đợt đăng ký đề tài cho sinh viên',
        title2: 'Đợt đăng ký đề tài cho giảng viên',
    });

    const handleClickStudentPeroidClick = () => {
        setRegis('student');
        setSelectedTitle({
            ...selectedTitle,
            title1: 'Đợt đăng ký đề tài cho sinh viên',
        });
    };

    const handleClickLecPeroidClick = () => {
        setRegis('lecturer');
        setSelectedTitle({
            ...selectedTitle,
            title2: 'Đợt đăng ký đề tài cho giảng viên',
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
                                <button onClick={handleClickStudentPeroidClick} className='btnMana'>Đợt đăng ký đề tài cho sinh viên</button>
                                <button onClick={handleClickLecPeroidClick} className='btnMana'>Đợt đăng ký đề tài cho giảng viên</button>
                            </div>
                        </div>
                        <div className="form-title">
                            <span>{regis === 'student' ? selectedTitle.title1 : selectedTitle.title2}</span>
                            <hr className="line" />
                        </div>
                        <div className='homeMana'>
                            {regis === 'student' && <DataTableRegistrationPeroidSt />}
                            {regis === 'lecturer' && <DataTableRegistrationPeroidLec />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagementPeriod;
