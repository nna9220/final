import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import axiosInstance from '../../API/axios';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined';
import './TopicPBTable.scss'

function TopicPBTable() {
    const [topics, setTopics] = useState([]);
    const [activeTLChuyenNganh, setActiveTLChuyenNganh] = useState(false);
    const [activeKhoaLuan, setActiveKhoaLuan] = useState(false);
    const [detail, setDetail] = useState('');
    const [scores, setScores] = useState({});
    const [criterias, setCriterias] = useState([]);
    const userToken = getTokenFromUrlAndSaveToStorage();

    useEffect(() => {
        fetchTopics();
        handleListCriteria();
    }, []);

    const fetchTopics = () => {
        axiosInstance.get('/lecturer/counterArgumentSubject', {
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

    const handleScoreChange = (criteria, value) => {
        setScores(prevScores => ({
            ...prevScores,
            [criteria]: parseFloat(value) || 0
        }));
    };

    const totalScore = Object.values(scores).reduce((total, score) => total + score, 0);

    const handleListCriteria = () => {
        axiosInstance.get('/lecturer/manageTutorial/listCriteria', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log(response.data.body);
                setCriterias(response.data.body);
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
                axiosInstance.get(`/lecturer/counterArgumentSubject/detail/${id}`, {
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

    const addScore = (id) => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        console.log("Token: " + userToken);
        if (userToken) {
            const tokenSt = sessionStorage.getItem(userToken);
            if (!tokenSt) {
                axiosInstance.post(`/lecturer/addScore/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                    },
                })
                    .then(response => {
                        console.log("DetailTopic: ", response.data);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        }
    }

    return (
        <div style={{ display: 'grid' }}>
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
                                <th scope='col'>Chấm điểm</th>
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
                                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => detailTopic(item.subjectId)}>
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
                            <h5>Tiêu chí đánh giá</h5>
                            <table className='table-bordered table'>
                                <thead>
                                    <tr>
                                        <th>Tiêu Chí Đánh Giá</th>
                                        {topics.map((_, index) => (
                                            <th key={index}>Sinh viên {index + 1}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {criterias.map((criteria, criteriaIndex) => (
                                        <tr key={criteriaIndex}>
                                            <td className='criteria'>{criteria.criteriaName}</td>
                                            {topics.map((_, topicIndex) => (
                                                <td key={topicIndex}>
                                                    <input
                                                        type='number'
                                                        step='0.25'
                                                        max={criteria.criteriaScore}
                                                        min={0}
                                                        value={scores[`${criteria.criteriaName}_${topicIndex}`] || 0}
                                                        onChange={(e) => handleScoreChange(`${criteria.criteriaName}_${topicIndex}`, e.target.value)}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    <tr>
                                        <td className='criteria-sum'>Tổng</td>
                                        {topics.map((_, index) => (
                                            <td key={index}>
                                                <input
                                                    type='number'
                                                    step='0.25'
                                                    max={1}
                                                    min={0}
                                                    className='score'
                                                    readOnly
                                                    value={Object.keys(criterias).reduce((sum, criteria) => {
                                                        return sum + parseFloat(scores[`${criteria}_${index}`] || 0);
                                                    }, 0).toFixed(2)}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                            <hr />
                            <h5>Nhận xét, đánh giá</h5>
                            <div className="form-floating">
                                <textarea
                                    className="form-control"
                                    id="comment"
                                    name="text"
                                    placeholder="Comment goes here"
                                ></textarea>
                                <label htmlFor="comment">Nhận xét</label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                                onClick={addScore}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default TopicPBTable