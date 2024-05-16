import React, { useState, useEffect } from 'react';
import './RegisTopicTable.scss';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import { NavLink } from 'react-router-dom';
import axiosInstance from '../../API/axios';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

function RegisTopicTable() {
    const [topics, setTopics] = useState([]);
    const [topicsRegistered, setTopicsRegistered] = useState([]);
    const [registeredSuccess, setRegisteredSuccess] = useState(false); 
    const [errors, setErrors] =useState(null);
    
    useEffect(() => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        console.log("Token: " + userToken);
    
        if (userToken) {
            const tokenSt = sessionStorage.getItem('userToken');
            if (!tokenSt) {
                sessionStorage.setItem('userToken', userToken);
            }
    
            axiosInstance.get('/student/subject', {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            })
            .then(response => {
                console.log("DatalistSubject: ", response.data);
                const result = response.data;
                console.log("Data: ", response.data);
    
                // Log chi tiết các thuộc tính của result
                if (result.person) {
                    console.log("Person:", result.person);
    
                    if (result.subjectList) {
                        console.log("Subject List:", result.subjectList);
                        setTopics(result.subjectList);
                    } else if (result.subject) {
                        console.log("Registered Subject:", result.subject);
                        setTopicsRegistered([result.subject]);
                    } else {
                        console.log("No subjects available for registration.");
                        setErrors("Chưa đến thời gian đăng ký đề tài !!!");
                    }
                }
            })
            .catch(error => {
                console.error("Error fetching subjects:", error);
                if (error.response && error.response.status === 404) {
                    setErrors("Không tìm thấy sinh viên.");
                } else if (error.response && error.response.status === 403) {
                    setErrors("Bạn không có quyền truy cập.");
                } else {
                    setErrors("Có lỗi xảy ra khi lấy dữ liệu.");
                }
            });
        }
    }, []);
    
    const dangKyDeTai = (subjectId) => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        if (userToken) {
            axiosInstance.post(`/student/subject/registerTopic/${subjectId}`, null, {
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
                        <div style={{ margin: '16px' }} class="alert alert-success" role="alert">
                            <CheckCircleOutlineOutlinedIcon /> BẠN ĐÃ ĐĂNG KÝ ĐỀ TÀI THÀNH CÔNG!!!
                        </div>
                        <br />
                        <div class="container-fluid mx-auto">
                            <div class="row">
                                <div class="mb-3">
                                    <div class="card">
                                        <form class="form-card">
                                            <h5 class="text-center mb-4 tille-name-topic">THÔNG TIN ĐỀ TÀI</h5>
                                            <div className='items-content-topic'>
                                                <label>Tên đề tài: <label className='content-name'>{topic.subjectName}</label></label>
                                            </div>
                                            <div className='items-content-topic'>
                                                <label>Loại đề tài: <label className='content-name'>{topic.typeSubject.typeName}</label></label>
                                            </div>
                                            <div className='items-content-topic' >
                                                <label>Giảng viên hướng dẫn: <label className='content-name'>{topic.instructorId.person.firstName + ' ' + topic.instructorId.person.lastName}</label></label>
                                            </div>
                                            <div className='items-content-topic'>
                                                <label>Giảng viên phản biện: <label className='content-name'>{topic.thesisAdvisorId.person.firstName + ' ' + topic.thesisAdvisorId.person.lastName}</label></label>
                                            </div>
                                            <div className='items-content-topic'>
                                                <a>Nhóm sinh viên thực hiện</a><br />
                                                <label>Sinh viên 1: <label className='content-name'>{topic.student1}</label></label><br />
                                                <label>Sinh viên 2: <label className='content-name'>{topic.student2}</label></label><br />
                                                <label>Sinh viên 3: <label className='content-name'>{topic.student3}</label></label>
                                            </div>
                                            <div className='items-content-topic'>
                                                <label>Yêu cầu: <label className='content-name'>{topic.requirement}</label></label>
                                            </div>
                                            <div class="row justify-content-end">
                                                <div class="form-group col-sm-2"><NavLink to="/managermentTopicStudent"><button type="submit" class="btn-block btn-primary">Quản lý đề tài</button> </NavLink></div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                ))
            ) : (
                <div>
                    <h4 style={{ padding: '20px', color: 'red' }}>{errors}</h4>
                </div>
            )}
        </div>
    );
}

export default RegisTopicTable;
