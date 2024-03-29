import React, { useState, useEffect } from 'react';
import './RegisTopicTable.scss';
import axios from 'axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';

function RegisTopicTable() {
    const [topics, setTopics] = useState([]);
    const [topicsRegistered, setTopicsRegistered] = useState([]);
    const [registeredSuccess, setRegisteredSuccess] = useState(false); // Thêm biến trạng thái

    useEffect(() => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        console.log("Token: " + userToken);
        if (userToken) {
            const tokenSt = sessionStorage.getItem(userToken);
            if (!tokenSt) {
                axios.get('http://localhost:5000/api/student/subject', {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                    },
                })
                    .then(response => {
                        console.log("DatalistSubject: ", response.data);
                        const result = response.data;
                        if (result.subjectList) {
                            setTopics(result.subjectList);
                        } else if (result.subject) {
                            setTopicsRegistered([result.subject]);
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        }
    }, []);

    const dangKyDeTai = (subjectId) => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        if (userToken) {
            axios.post(`http://localhost:5000/api/student/subject/registerTopic/${subjectId}`, null, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            })
                .then(response => {
                    if (response.status === 200) {
                        setRegisteredSuccess(true);
                        alert("Đăng ký thành công!");
                    } else {
                        alert("Đăng ký thất bại! Vui lòng thử lại sau.");
                    }
                })
                .catch(error => {
                    console.error("Đăng ký thất bại", error);
                    alert("Đăng ký thất bại! Vui lòng thử lại sau nhe.");
                });
        }
    };

    return (
        <div className='home-table'>
            {topics.length > 0 ? (
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Tên đề tài</th>
                            <th scope="col">Giảng viên hướng dẫn</th>
                            <th scope="col">Đăng ký</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topics.map((topic, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{topic.subjectName}</td>
                                <td>{topic.instructorId.person.firstName + ' ' + topic.instructorId.person.lastName}</td>
                                <td>
                                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                        <EditCalendarOutlinedIcon />
                                    </button>

                                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h1 class="modal-title fs-5" id="exampleModalLabel">Thông báo xác nhận</h1>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body">
                                                    Bạn chắc chắc muốn đăng ký đề tài {topic.subjectName} không?
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button type="button" data-bs-dismiss="modal" class="btn btn-success" onClick={() => dangKyDeTai(topic.subjectId)}>Xác nhận</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : topicsRegistered.length > 0 ? (
                topicsRegistered.map((topic, index) => (
                    <div key={index}>
                        <div class="alert alert-success" role="alert">
                            BẠN ĐÃ ĐĂNG KÝ ĐỀ TÀI THÀNH CÔNG!!!
                        </div>
                        <div>
                            <h4>THÔNG TIN ĐỀ TÀI BẠN ĐÃ ĐĂNG KÝ</h4>
                            <p>Tên đề tài: {topic.subjectName}</p>
                            <p>Loại đề tài: {topic.instructorId.person.firstName + ' ' + topic.instructorId.person.lastName}</p>
                            <p>Yêu cầu: {topic.requirement}</p>
                            <p>Giảng viên hướng dẫn: {topic.instructorId.person.firstName + ' ' + topic.instructorId.person.lastName}</p>
                            <p>Giảng viên phản biện: {topic.thesisAdvisorId.person.firstName + ' ' + topic.thesisAdvisorId.person.lastName}</p>
                            <p>Nhóm sinh viên thực hiện</p>
                            <p>Sinh viên 1: {topic.student1}</p>
                            <p>Sinh viên 2:  {topic.student2}</p>
                            <p>Đăng ký ngày: {topic.year}</p>
                        </div>
                    </div>
                ))
            ) : (
                <div>
                    <h4 style={{ color: 'red' }}>CHƯA ĐẾN THỜI GIAN ĐĂNG KÝ ĐỀ TÀI!!!</h4>
                </div>
            )}
        </div>
    );
}

export default RegisTopicTable;
