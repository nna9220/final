import { Home } from '@mui/icons-material'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './Team.scss'
import axiosInstance from "../API/axios";



function Team() {
    const [user, setUser] = useState([]);
    const [selectedMajor, setSelectedMajor] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        document.title = "Danh sách giảng viên";
        axiosInstance.get("/api/team")
            .then(response => {
                console.log("API response:", response.data);
                setUser(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const handleMajorChange = (event) => {
        setSelectedMajor(event.target.value);
    };

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredUsers = user.filter(a => {
        const isMajorMatch = selectedMajor === "all" || a.major === selectedMajor;
        const isNameMatch = a.person.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.person.lastName.toLowerCase().includes(searchTerm.toLowerCase());
        return isMajorMatch && isNameMatch;
    });

    return (
        <div className="hero">
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
                        <li className="breadcrumb-item" aria-current="page">Danh sách giảng viên</li>
                    </ol>
                </nav>
            </div>
            <div className='list'>
                <div className='listHome'>
                    <div className='listHomeLec'>
                        <div className='search'>
                            <div className='filter'>
                                <h6>NGÀNH</h6>
                                <select className='selectDr form-control' value={selectedMajor} onChange={handleMajorChange}>
                                    <option className='option' value="all">Tất cả</option>
                                    <option className='option' value="CongNghePhanMem">Công nghệ phần mềm</option>
                                    <option className='option' value="AnToanThongTin">An toàn thông tin</option>
                                    <option className='option' value="HeThongThongTin">Hệ thống thông tin</option>
                                    <option className='option' value="KyThuatDuLieu">Kỹ thuật dữ liệu</option>
                                    <option className='option' value="CLC">Chất lượng cao</option>
                                </select>
                            </div>
                            <div className='formSearch'>
                                <h6>HỌ VÀ TÊN</h6>
                                <input type="text" className='form-control' value={searchTerm} onChange={handleSearchTermChange} />
                            </div>
                        </div>
                        <div className='cardContainer'>
                            {filteredUsers.map(a => (
                                <Link key={a.person.personId} className='cardItem' to={`/info-teacher/${a.person.personId}`}>
                                    <img className='avatar' src='/assets/avatar.png' alt="avatar" />
                                    <p className='name'>{a.person.firstName + ' ' + a.person.lastName}</p>
                                    <p className='major'>{a.major}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Team
