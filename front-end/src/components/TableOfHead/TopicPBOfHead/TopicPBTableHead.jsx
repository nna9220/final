import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import axiosInstance from '../../../API/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './topicPb.scss'

function TopicPBTableHead() {
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
        axiosInstance.get('/head/counterArgumentSubject', {
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
                axiosInstance.get(`/head/counterArgumentSubject/detail/${id}`, {
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
                                <th scope='col'>Đánh giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topics.map((item, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{item.subjectName}</td>
                                    <td>{item.instructorId.person.firstName + ' ' + item.instructorId.person.lastName}</td>
                                    <td>{item.student1}</td>
                                    <td>{item.student2}</td>
                                    <td>{item.student3}</td>
                                    <td>{item.requirement}</td>
                                    <td>
                                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { detailTopic(item.subjectId); setSubjectIdForAccept(item.subjectId) }} disabled={item.active != 6}>
                                            <CreditScoreOutlinedIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))}
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
                            <h5>Thông tin đề tài</h5>
                            <div>
                                <p>1. Tên đề tài: {detail.subject?.subjectName}</p>
                                <p>2. Chuyên ngành: {detail.subject?.major}</p>
                                <p>3. Loại đề tài: {detail.subject?.typeSubject?.typeName}</p>
                                <p>4. Giảng viên hướng dẫn: {detail.subject?.instructorId?.person?.firstName + ' ' + detail.subject?.instructorId?.person?.lastName}</p>
                                <p>5. Giảng viên phản biện: {detail.subject?.thesisAdvisorId?.person?.firstName + ' ' + detail.subject?.thesisAdvisorId?.person?.lastName}</p>
                                <p>6. Nhóm sinh viên thực hiện: </p>
                                <p>Sinh viên 1: {detail.subject?.student1}</p>
                                <p>Sinh viên 2: {detail.subject?.student2}</p>
                                <p>Sinh viên 3: {detail.subject?.student3}</p>
                            </div>
                            <hr />
                            <h5>File báo cáo</h5>
                            <div>
                                <p>Báo cáo 50% :
                                    <span className="file-name">
                                        {detail.subject?.fiftyPercent?.name}
                                    </span>
                                    <a href={detail.subject?.fiftyPercent?.url} className="file-link">
                                        {detail.subject?.fiftyPercent?.url}
                                    </a>
                                </p>
                                <p>Báo cáo 100% :
                                    <span className="file-name">
                                        {detail.subject?.oneHundredPercent?.name}
                                    </span>
                                    <a href={detail.subject?.oneHundredPercent?.url} className="file-link">
                                        {detail.subject?.oneHundredPercent?.url}
                                    </a>
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleAccept}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default TopicPBTableHead