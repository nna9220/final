import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './InforTeacher.scss';
import { Link } from 'react-router-dom';
import { Home } from '@mui/icons-material';

function InforTeacher() {
    const [teacher, setTeacher] = useState(null);
    const { lecturerId } = useParams();
    const [selectedTab, setSelectedTab] = useState('profile');

    useEffect(() => {
        const fetchTeacherInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/team/profile/${lecturerId}`);
                console.log("profile: ", response.data);
                setTeacher(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTeacherInfo();
    }, [lecturerId]);

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <div>
            <div>
                <div className="card text-bg-white">
                    <img src="/assets/Teacher.jpg" height='400px' className="card-img" alt="..." />
                </div>
                <div className='breadcrumb-menu'>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb" style={{ fontSize: '15px' }}>
                            <li className="breadcrumb-item" style={{ alignItems: 'center' }}>
                                <Link style={{ textDecoration: 'none', color: 'black' }} to="/">
                                    <Home />
                                    <span>Trang chủ</span>
                                </Link>
                            </li>
                            <li className="breadcrumb-item" style={{ alignItems: 'center' }}>
                                <Link style={{ textDecoration: 'none', color: 'black' }} to="/info-teacher">
                                    <span>Danh sách giảng viên</span>
                                </Link>
                            </li>
                            <li className="breadcrumb-item " aria-current="page">
                                {teacher ? `${teacher.person.firstName} ${teacher.person.lastName}` : ''}
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div className='boby-info'>
                <div className='info'>
                    <div className='avatar'>
                        <div>
                            <img src='/assets/team-1.jpg' alt="Teacher Avatar" />
                        </div>
                    </div>
                    <div className='content-info border-start'>
                        <div className='button-wrapper'>
                            <div className='navbar-info border-bottom'>
                                <button onClick={() => handleTabChange('profile')} className={selectedTab === 'profile' ? 'active' : 'profile'}>
                                    Lý lịch sơ lược
                                </button>
                                <button onClick={() => handleTabChange('contact')} className={selectedTab === 'contact' ? 'active' : 'contact'}>
                                    Thông tin liên hệ
                                </button>
                            </div>
                        </div>
                        <div className='info-teach'>
                            {selectedTab === 'profile' && teacher && (
                                <div>
                                    <p>Họ và tên: {teacher.person.firstName} {teacher.person.lastName}</p>
                                    <p>Giới tính: {teacher.person.gender ? 'Nữ' : 'Nam'}</p>
                                    <p>Ngày sinh: {teacher.person.birthDay}</p>
                                    <p>Chuyên ngành: {teacher.major} </p>
                                </div>
                            )}
                            {selectedTab === 'contact' && teacher &&
                                <div>
                                    <p>Email: {teacher.person.username}</p>
                                    <p>Số điện thoại: {teacher.person.phone}</p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InforTeacher;
