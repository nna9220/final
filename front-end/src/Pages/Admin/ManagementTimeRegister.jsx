import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/SidebarAdmin';
import DataTableTimeRegister from '../../components/dataTable/DataTableTimeRegister';
import DataTableTimeRegisterKL from '../../components/dataTable/DataTableTimeRegisterKL';
import './ManagementTimeRegister.scss'

function ManagementTimeRegister() {
    useEffect(() => {
        document.title = "Quản lý thời gian đăng ký đề tài";
      }, []);
    const [regis, setRegis] = useState('student');
    const [selectedTitle, setSelectedTitle] = useState({
        title1: 'Tiểu luận chuyên ngành',
        title2: 'Khóa luận tốt nghiệp',
    });

    const handleClickStudentPeroidClick = () => {
        setRegis('student');
        setSelectedTitle({
            ...selectedTitle,
            title1: 'Tiểu luận chuyên ngành',
        });
    };

    const handleClickLecPeroidClick = () => {
        setRegis('lecturer');
        setSelectedTitle({
            ...selectedTitle,
            title2: 'Khóa luận tốt nghiệp',
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
                                <h3>Quản lý thời gian đăng ký đề tài</h3>
                            </div>
                            <div className='menuMana'>
                                <button onClick={handleClickStudentPeroidClick} className='btnMana'>Tiểu luận chuyên ngành</button>
                                <button onClick={handleClickLecPeroidClick} className='btnMana'>Khóa luận tốt nghiệp</button>
                            </div>
                        </div>
                        <div className="form-title">
                            <span>{regis === 'student' ? selectedTitle.title1 : selectedTitle.title2}</span>
                            <hr className="line" />
                        </div>
                        <div className='homeMana'>
                            {regis === 'student' && <DataTableTimeRegister />}
                            {regis === 'lecturer' && <DataTableTimeRegisterKL />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagementTimeRegister