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
    const [regis, setRegis] = useState('student');
    const [selectedTitle, setSelectedTitle] = useState({
        title1: 'Duyệt đề tài cho tiểu luận chuyên ngành',
        title2: 'Duyệt đề tài cho khóa luận tốt nghiệp',
    });

    const handleClickStudentPeroidClick = () => {
        setRegis('student');
        setSelectedTitle({
            ...selectedTitle,
            title1: 'Duyệt đề tài cho tiểu luận chuyên ngành',
        });
    };

    const handleClickLecPeroidClick = () => {
        setRegis('lecturer');
        setSelectedTitle({
            ...selectedTitle,
            title2: 'Duyệt đề tài cho khóa luận tốt nghiệp',
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
                                <h3>Quản lý duyệt đề tài</h3>
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
                            {regis === 'student' && <DataTableTimeApprove />}
                            {regis === 'lecturer' && <DataTableTimeApproveKL />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagementTimeApprove