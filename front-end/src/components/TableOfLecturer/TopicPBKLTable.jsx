import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import axiosInstance from '../../API/axios';
import './TopicPBTable.scss';
import { Link } from 'react-router-dom';

function TopicPBKLTable() {
    const [topics, setTopics] = useState([]);
    const [detail, setDetail] = useState('');
    const [scores, setScores] = useState({});
    const [criterias, setCriterias] = useState([]);
    const userToken = getTokenFromUrlAndSaveToStorage();
    const [subjectIdForAccept, setSubjectIdForAccept] = useState(null);
    const [subjectIdForApproval, setSubjectIdForApproval] = useState(null);
    const [formDataAprrove, setFormDataApprove] = useState({
        reviewContent: '',
        reviewAdvantage: '',
        reviewWeakness: '',
        status: '',
        classification: '',
        score: ''
    })

    const [activeTab, setActiveTab] = useState('info');

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };
    const handleChangeApprove = (e) => {
        const { name, value } = e.target;
        setFormDataApprove((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = () => {
        axiosInstance.get('/lecturer/manageCritical/graduation/listSubject', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log("Data: ", response.data)
                setTopics(response.data.body);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const detailTopic = (id) => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        console.log("Token: " + userToken);
        if (userToken) {
            const tokenSt = sessionStorage.getItem(userToken);
            if (!tokenSt) {
                axiosInstance.get(`/lecturer/manageCritical/graduation/counterArgumentSubject/detail/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                    },
                })
                    .then(response => {
                        console.log("DetailTopic: ", response.data);
                        setDetail(response.data);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        }
    }

    const handleSubmitReviewThesis = () => {
        console.log(subjectIdForApproval);

        if (subjectIdForApproval) {
            const formDataToSend = {
                ...formDataAprrove,
                score: parseFloat(formDataAprrove.score),
                status: formDataAprrove.status === 'true' // Convert string to boolean
            };

            console.log("Data send: ", formDataToSend);
            axiosInstance.post(`/lecturer/manageCritical/graduation/accept-subject-to-council/${subjectIdForApproval}`, null, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
                params: formDataToSend
            })
                .then(response => {
                    // Handle success
                    console.log('Success:', response);
                    toast.success("Xác nhận đề tài thành công!")
                })
                .catch(error => {
                    // Handle error
                    console.error('Error:', error);
                    if(error.code === "ERR_BAD_REQUEST" && error.response.status === 400) {
                        toast.warning("Chưa phân giảng viên phản biện!");
                    }else{
                        toast.error("Lỗi !!!")
                    }
                });
        }
    };

    const handleScoreInput = (e) => {
        const value = parseFloat(e.target.value);
        if (value > 10) {
            e.target.value = 10;
        } else if (value < 0) {
            e.target.value = 0;
        }
        handleChangeApprove(e);
    };

    const exportFile = (subjectId) => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        console.log("Token: " + userToken);
        if (userToken) {
            const tokenSt = sessionStorage.getItem(userToken);
            if (!tokenSt) {
                axiosInstance.get(`/graduation/export/reviewThesis/${subjectId}`, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                    },
                })
                    .then(response => {
                        console.log("export file success");
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        }
    }

    return (
        <div style={{ display: 'grid' }}>
            <ToastContainer />
            <div>
                <div className='home-table-topicPB'>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Tên đề tài</th>
                                <th scope="col">Giảng viên hướng dẫn</th>
                                <th scope="col">Sinh viên 1</th>
                                <th scope="col">Sinh viên 2</th>
                                <th scope="col">Sinh viên 3</th>
                                <th scope="col">Yêu cầu</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topics.length > 0 ? (
                                topics.filter((item) => item.active != 9).map((item, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{item.subjectName}</td>
                                        <td>{item.instructorId.person.firstName + ' ' + item.instructorId.person.lastName}</td>
                                        <td>{item.student1}</td>
                                        <td>{item.student2}</td>
                                        <td>{item.student3}</td>
                                        <td>{item.requirement}</td>
                                        <td>
                                            <p className={item.active === 8 ? "status-approved" : "status-not-approved"}>
                                                {item.active === 8 ? "Đã duyệt" : "Chưa duyệt"}
                                            </p>
                                        </td>
                                        <td>
                                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"
                                                onClick={() => { detailTopic(item.subjectId); setSubjectIdForApproval(item.subjectId) }}
                                                disabled={item.active !== 7}>
                                                <CreditScoreOutlinedIcon />
                                            </button>
                                            {/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#export"
                                                onClick={() => exportFile(item.subjectId)}>Xuât file nhận xét</button> */}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center">Không có dữ liệu</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Đánh giá</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <ul className="nav nav-tabs">
                                <li className="nav-item">
                                    <a
                                        className={`nav ${activeTab === 'info' ? 'active' : ''}`}
                                        onClick={() => handleTabClick('info')}
                                        href="#"
                                    >
                                        Thông tin đề tài
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className={`nav ${activeTab === 'review' ? 'active' : ''}`}
                                        onClick={() => handleTabClick('review')}
                                        href="#"
                                    >
                                        Đánh giá, nhận xét
                                    </a>
                                </li>
                            </ul>

                            {activeTab === 'info' && (
                                <div className="tab-content">
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <th scope="row" style={{ width: '30%' }}>Tên đề tài:</th>
                                                <td>{detail.subject?.subjectName}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Chuyên ngành:</th>
                                                <td>{detail.subject?.major}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Loại đề tài:</th>
                                                <td>{detail.subject?.typeSubject?.typeName}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Giảng viên hướng dẫn:</th>
                                                <td>{detail.subject?.instructorId?.person?.firstName} {detail.subject?.instructorId?.person?.lastName}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Giảng viên phản biện:</th>
                                                <td>{detail.subject?.thesisAdvisorId?.person?.firstName} {detail.subject?.thesisAdvisorId?.person?.lastName}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Nhóm sinh viên thực hiện:</th>
                                                <td>
                                                    <div>Sinh viên 1: {detail.subject?.student1}</div>
                                                    <div>Sinh viên 2: {detail.subject?.student2}</div>
                                                    <div>Sinh viên 3: {detail.subject?.student3}</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row" style={{ width: '30%' }}>Báo cáo 50%:</th>
                                                <td>
                                                    {detail.subject?.fiftyPercent?.url ? (
                                                        <a href={detail.subject?.fiftyPercent?.url} target="_blank" rel="noopener noreferrer" download className="content-name">
                                                            {detail.subject?.fiftyPercent?.name}
                                                        </a>
                                                    ) : (
                                                        <span>Chưa có</span>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Báo cáo 100%:</th>
                                                <td>
                                                    {detail.subject?.oneHundredPercent?.url ? (
                                                        <a href={detail.subject?.oneHundredPercent?.url} target="_blank" rel="noopener noreferrer" download className="content-name">
                                                            {detail.subject?.oneHundredPercent?.name}
                                                        </a>
                                                    ) : (
                                                        <span>Chưa có</span>
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === 'review' && (
                                <div className="tab-content">
                                    <div className="mb-3">
                                        <label htmlFor="reviewContent" className="form-label">1. Về nội dung đề tài & khối lượng thực hiện:</label>
                                        <textarea
                                            id="reviewContent"
                                            className="form-control"
                                            name="reviewContent"
                                            value={formDataAprrove.reviewContent}
                                            onChange={handleChangeApprove}
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="reviewAdvantage" className="form-label">2. Ưu điểm:</label>
                                        <textarea
                                            className="form-control"
                                            id="reviewAdvantage"
                                            name="reviewAdvantage"
                                            value={formDataAprrove.reviewAdvantage}
                                            onChange={handleChangeApprove}
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="reviewWeakness" className="form-label">3. Nhược điểm:</label>
                                        <textarea
                                            className="form-control"
                                            id="reviewWeakness"
                                            name="reviewWeakness"
                                            value={formDataAprrove.reviewWeakness}
                                            onChange={handleChangeApprove}
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="status" className="form-label">4. Đề nghị cho bảo vệ hay không?</label>
                                        <div id="status" style={{ display: 'flex' }}>
                                            <div className="form-check" style={{ marginRight: '30px' }}>
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="defenseYes"
                                                    name="status"
                                                    value="true"
                                                    checked={formDataAprrove.status === 'true'}
                                                    onChange={handleChangeApprove}
                                                />
                                                <label className="form-check-label" htmlFor="defenseYes">
                                                    Có
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="defenseNo"
                                                    name="status"
                                                    value="false"
                                                    checked={formDataAprrove.status === 'false'}
                                                    onChange={handleChangeApprove}
                                                />
                                                <label className="form-check-label" htmlFor="defenseNo">
                                                    Không
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="classification" className="form-label">5. Đánh giá loại:</label>
                                        <div id="classification" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="excellent"
                                                    name="classification"
                                                    value="Xuất sắc"
                                                    checked={formDataAprrove.classification === 'Xuất sắc'}
                                                    onChange={handleChangeApprove}
                                                />
                                                <label className="form-check-label" htmlFor="excellent">
                                                    Xuất sắc
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="good"
                                                    name="classification"
                                                    value="Giỏi"
                                                    checked={formDataAprrove.classification === 'Giỏi'}
                                                    onChange={handleChangeApprove}
                                                />
                                                <label className="form-check-label" htmlFor="good">
                                                    Giỏi
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="fair"
                                                    name="classification"
                                                    value="Khá"
                                                    checked={formDataAprrove.classification === 'Khá'}
                                                    onChange={handleChangeApprove}
                                                />
                                                <label className="form-check-label" htmlFor="fair">
                                                    Khá
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="average"
                                                    name="classification"
                                                    value="Trung bình"
                                                    checked={formDataAprrove.classification === 'Trung bình'}
                                                    onChange={handleChangeApprove}
                                                />
                                                <label className="form-check-label" htmlFor="average">
                                                    Trung bình
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="weak"
                                                    name="classification"
                                                    value="Yếu"
                                                    checked={formDataAprrove.classification === 'Yếu'}
                                                    onChange={handleChangeApprove}
                                                />
                                                <label className="form-check-label" htmlFor="weak">
                                                    Yếu
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="score" className="form-label">6. Điểm:</label>
                                        <input
                                            type="number"
                                            id="score"
                                            max={10}
                                            min={0}
                                            step={0.25}
                                            name="score"
                                            value={formDataAprrove.score}
                                            onInput={handleScoreInput}
                                            onChange={handleChangeApprove}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Đóng
                            </button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmitReviewThesis}>
                                Xác nhận qua hội đồng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopicPBKLTable;
