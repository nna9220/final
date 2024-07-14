import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import axiosInstance from '../../../API/axios';
import './topicPb.scss'
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

function TopicKLPBTableHead() {
    const [topics, setTopics] = useState([]);
    const [detail, setDetail] = useState('');
    const [scores, setScores] = useState({});
    const [criterias, setCriterias] = useState([]);
    const userToken = getTokenFromUrlAndSaveToStorage();
    const [subjectIdForAccept, setSubjectIdForAccept] = useState(null);

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = () => {
        axiosInstance.get('/head/graduation/manager/counterArgumentSubject', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                setTopics(response.data.listSubject);
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
                axiosInstance.get(`/head/graduation/manager/counterArgumentSubject/detail/${id}`, {
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

    const handleAccept = () => {
        console.log(subjectIdForAccept);
        if (subjectIdForAccept) {
            axiosInstance.post(`/head/manageCritical/accept-subject-to-council/${subjectIdForAccept}`, {}, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                }
            })
                .then(response => {
                    console.log('Đề tài đã được duyệt qua hội đồng', response.data);
                    toast.success("Đề tài đã được duyệt qua hội đồng!")
                    fetchTopics();
                })
                .catch(error => {
                    console.error('Lỗi duyệt đề tài qua hội đồng:', error);
                    toast.error("Lỗi duyệt đề tài qua hội đồng")
                });
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
                                <th scope="col">Đánh giá</th>
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
                                                onClick={() => { detailTopic(item.subjectId); setSubjectIdForAccept(item.subjectId) }}
                                                disabled={item.active !== 7}>
                                                <CreditScoreOutlinedIcon />
                                            </button>
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
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Chi tiết đề tài</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <h5 className="mb-4" style={{color:'#4477CE'}}>Thông tin đề tài</h5>
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
                                        <td>{detail.subject?.instructorId?.person?.firstName + ' ' + detail.subject?.instructorId?.person?.lastName}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Giảng viên phản biện:</th>
                                        <td>{detail.subject?.thesisAdvisorId?.person?.firstName + ' ' + detail.subject?.thesisAdvisorId?.person?.lastName}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Nhóm sinh viên thực hiện:</th>
                                        <td>
                                            <div>Sinh viên 1: {detail.subject?.student1}</div>
                                            <div>Sinh viên 2: {detail.subject?.student2}</div>
                                            <div>Sinh viên 3: {detail.subject?.student3}</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <hr className="my-4" />
                            <h5 className="mb-4"  style={{color:'#4477CE'}}>File báo cáo</h5>
                            <table className="table table-bordered">
                                <tbody>
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
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Đóng
                            </button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleAccept}>
                                Xác nhận qua hội đòng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopicKLPBTableHead;
