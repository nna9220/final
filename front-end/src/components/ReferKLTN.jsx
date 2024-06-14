import React, { useEffect, useState } from 'react'
import axiosInstance from '../API/axios';
import { Link } from 'react-router-dom';
import { Home } from '@mui/icons-material';

function ReferKLTN() {
    useEffect(() => {
        document.title = "Tham khảo khóa luận tốt nghiệp";
    }, []);
    const [informationTopics, setiInformationTopics] = useState([]);

    useEffect(() => {
        axiosInstance.get("/public/essay/kltn")
            .then(response => {
                console.log("API response:", response.data);
                setiInformationTopics(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <div>
            <hr />
            <div>
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
                                <Link style={{ textDecoration: 'none', color: 'black' }} to="/referTL">
                                    <span>Tham khảo khóa luận tốt nghiệp</span>
                                </Link>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div>
                <div class="row" style={{ margin: '40px', borderRadius: 'none' }}>
                    <div class="col-2">
                        <div class="list-group" id="list-tab" role="tablist">
                            <a class="list-group-item list-group-item-action active" id="list-home-list" data-bs-toggle="list" href="#list-home" role="tab" aria-controls="list-home">Tất cả</a>
                            <a class="list-group-item list-group-item-action" id="list-profile-list" data-bs-toggle="list" href="#list-profile" role="tab" aria-controls="list-profile">Công nghệ thông tin</a>
                            <a class="list-group-item list-group-item-action" id="list-messages-list" data-bs-toggle="list" href="#list-messages" role="tab" aria-controls="list-messages">Hệ thống thông tin</a>
                            <a class="list-group-item list-group-item-action" id="list-settings-list" data-bs-toggle="list" href="#list-settings" role="tab" aria-controls="list-settings">An toàn thông tin</a>
                            <a class="list-group-item list-group-item-action" id="list-clc-list" data-bs-toggle="list" href="#list-clc" role="tab" aria-controls="list-settings">Chất lượng cao</a>
                        </div>
                    </div>
                    <div class="col-8">
                        <div class="tab-content" id="nav-tabContent">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Tên đề tài</th>
                                        <th scope="col">GVHD</th>
                                        <th scope="col">Sinh viên 1</th>
                                        <th scope="col">Sinh viên 2</th>
                                        <th scope="col">Sinh viên 3</th>
                                        <th scope="col">Niên khóa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {informationTopics.map((item, index) => (
                                        <tr>
                                            <th scope="row">{index + 1}</th>
                                            <td>{item}</td>
                                            <td>Otto</td>
                                            <td>@mdo</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReferKLTN