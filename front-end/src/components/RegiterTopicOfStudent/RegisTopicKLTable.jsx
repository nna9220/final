import React, { useState, useEffect } from 'react';
import './RegisTopicTable.scss';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import { NavLink } from 'react-router-dom';
import axiosInstance from '../../API/axios';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisTopicKLTable() {
    const [topics, setTopics] = useState([]);
    const [topicsRegistered, setTopicsRegistered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null);
    const [currentTopic, setCurrentTopic] = useState(null);

    useEffect(() => {
        const fetchTopics = async () => {
            const userToken = getTokenFromUrlAndSaveToStorage();
            if (userToken) {
                const tokenSt = sessionStorage.getItem('userToken');
                if (!tokenSt) {
                    sessionStorage.setItem('userToken', userToken);
                }
    
                try {
                    const response = await axiosInstance.get('/student/subjectGraduation', {
                        headers: {
                            'Authorization': `Bearer ${userToken}`,
                        },
                    });
    
                    const result = response.data;
                    if (result.person) {
                        if (result.subjectList) {
                            setTopics(result.subjectList);
                        } else if (result.subject) {
                            setTopicsRegistered([result.subject]);
                        } else {
                            setErrors("Chưa đến thời gian đăng ký đề tài !!!");
                        }
                    }
                } catch (error) {
                    if (error.response) {
                        if (error.response.status === 404) {
                            setErrors("Không tìm thấy sinh viên.");
                        } else if (error.response.status === 403) {
                            setErrors("Bạn không có quyền truy cập.");
                        } else if (error.response.status === 406) {
                            setErrors("Bạn chưa đủ điều kiện đăng ký đề tài.");
                        } else {
                            setErrors("Đã xảy ra lỗi khi lấy dữ liệu từ máy chủ.");
                        }
                    } else {
                        setErrors("Đã xảy ra lỗi không xác định.");
                    }
                } finally {
                    setLoading(false);
                }
            }
        };
    
        fetchTopics();
    }, []);
    

    const registerTopic = async (subjectId) => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        if (userToken) {
            try {
                const response = await axiosInstance.post(`/student/subjectGraduation/registerTopic/${subjectId}`, null, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                    },
                });

                if (response.status === 200) {
                    toast.success("Đăng ký đề tài thành công!");
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                } else {
                    toast.error("Đăng ký đề tài thất bại! Vui lòng thử lại.");
                }
            } catch (error) {
                toast.error("Đăng ký đề tài thất bại!");
            }
        }
    };

    if (loading) {
        return <div>
            <button class="btn btn-primary" type="button" disabled>
                <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <span role="status">Loading...</span>
            </button>
        </div>;
    }

    return (
        <div className='home-table'>
            <ToastContainer />
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
                                <td>{`${topic.instructorId.person.firstName} ${topic.instructorId.person.lastName}`}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"
                                        onClick={() => setCurrentTopic(topic)}
                                    >
                                        <EditCalendarOutlinedIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : topicsRegistered.length === 0 ? (
                <div>
                    <h4 style={{ padding: '20px', color: 'red' }}>{errors ? errors : "Hiện tại chưa có đề tài !!!"}</h4>
                </div>
            ) : null}

            {topicsRegistered.length > 0 && topicsRegistered.map((topic, index) => (
                <div key={index}>
                    <div style={{ margin: '16px' }} className={`alert ${topic.active !== 0 ? 'alert-success' : 'alert-warning'}`} role="alert">
                        {topic.active !== 0 ? (
                            <>
                                <CheckCircleOutlineOutlinedIcon /> BẠN ĐÃ ĐĂNG KÝ ĐỀ TÀI THÀNH CÔNG!!!
                            </>
                        ) : (
                            <h5>Đề tài đang chờ duyệt !!!</h5>
                        )}
                    </div>
                    <div className="container-fluid mx-auto">
                        <div className="row">
                            <div className="mb-3">
                                <div className="card">
                                    <form className="form-card">
                                        <h5 className="text-center mb-4 tille-name-topic">THÔNG TIN ĐỀ TÀI</h5>
                                        <div className='items-content-topic'>
                                            <label>Tên đề tài: <span className='content-name'>{topic.subjectName}</span></label><br />
                                            <label>Loại đề tài: <span className='content-name'>{topic.typeSubject?.typeName}</span></label><br />
                                            <label>Giảng viên hướng dẫn: <span className='content-name'>{`${topic.instructorId?.person?.firstName} ${topic.instructorId?.person?.lastName}`}</span></label><br />
                                            <label>
                                                Giảng viên phản biện:
                                                <span className='content-name'>
                                                    {topic.thesisAdvisorId?.person
                                                        ? `${topic.thesisAdvisorId.person.firstName} ${topic.thesisAdvisorId.person.lastName}`
                                                        : 'Chưa có'}
                                                </span>
                                            </label><br />
                                            <span>Nhóm sinh viên thực hiện</span><br />
                                            <label>Sinh viên 1: <span className='content-name'>{topic.student1}</span></label><br />
                                            <label>Sinh viên 2: <span className='content-name'>{topic.student2}</span></label><br />
                                            <label>Sinh viên 3: <span className='content-name'>{topic.student3}</span></label><br />
                                            <label>Yêu cầu: <span className='content-name'>{topic.requirement}</span></label>
                                        </div>
                                        {topic.active !== 0 && (
                                            <div style={{ float: 'right' }}>
                                                <NavLink to="/managermentTopicGraduationStudent">
                                                    <button type="button" className="btn btn-mana btn-success" style={{ backgroundColor: '#4eb09b', fontSize: 'medium', border: 'none' }}>Quản lý đề tài</button>
                                                </NavLink>
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Thông báo xác nhận</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Bạn chắc chắn muốn đăng ký đề tài {currentTopic?.subjectName} không?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => registerTopic(currentTopic?.subjectId)}>Xác nhận</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisTopicKLTable;
