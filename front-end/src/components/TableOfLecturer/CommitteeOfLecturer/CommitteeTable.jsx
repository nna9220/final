import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import axiosInstance from '../../../API/axios';

function CommitteeTable() {
    const [topics, setTopics] = useState([]);
    const [criterias, setCriterias] = useState([]);
    const [detail, setDetail] = useState(null);
    const [scores, setScores] = useState({});
    const userToken = getTokenFromUrlAndSaveToStorage();
    const [subjectIdDetail, setSubjectIdDetail] = useState(null);

    useEffect(() => {
        if (userToken) {
            listTopic();
            listCriteria();
        }
    }, [userToken]);

    useEffect(() => {
        if (subjectIdDetail) {
            detailTopic();
        }
    }, [subjectIdDetail]);

    const handleScoreChange = (criteriaKey, value) => {
        setScores(prevScores => ({
            ...prevScores,
            [criteriaKey]: value
        }));
    };

    //Đây phải là danh sách council, bên be t đặt tên nhầm

    const listTopic = () => {
        axiosInstance.get('/lecturer/council/listCouncil', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            }
        })
            .then(response => {
                console.log("Danh sách đề tài: ", response.data);
                setTopics(response.data.body);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const detailTopic = () => {
        console.log("ID: ", subjectIdDetail);
        axiosInstance.get(`/lecturer/council/detail/${subjectIdDetail}`, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            }
        })
            .then(response => {
                console.log("Chi tiết:", response.data);
                setDetail(response.data.body);
                setCriterias(response.data.body.subject.criteria);
            })
            .catch(error => {
                console.error('Lỗi lấy chi tiết:', error);
            });
    };

    const listCriteria = () => {
        axiosInstance.get('/lecturer/council/listCriteria', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            }
        })
            .then(response => {
                console.log("Tiêu chí: ", response.data);
                setCriterias(response.data.body);
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <div style={{ margin: '20px' }}>
            <div className='body-table-committe'>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Tên đề tài</th>
                            <th scope='col'>GVHD</th>
                            <th scope='col'>GVPB</th>
                            <th scope='col'>SV 1</th>
                            <th scope='col'>SV 2</th>
                            <th scope='col'>SV 3</th>
                            <th scope='col'>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topics.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.subject?.subjectName}</td>
                                <td>{item.subject?.instructorId?.person?.firstName + ' ' + item.subject?.instructorId?.person?.lastName}</td>
                                <td>{item.subject?.thesisAdvisorId?.person?.firstName + ' ' + item.subject?.thesisAdvisorId?.person?.lastName}</td>
                                <td>{item.subject?.student1}</td>
                                <td>{item.subject?.student2}</td>
                                <td>{item.subject?.student3}</td>
                                <td>
                                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"
                                        onClick={() => {
                                            setDetail(item.subject);
                                            setSubjectIdDetail(item.councilId);
                                        }}>
                                        Đánh giá
                                    </button>
                                </td>
                                <td style={{ display: 'none' }}>{item.subject?.subjectId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                                <p>1. Tên đề tài: {detail?.subject?.subjectName}</p>
                            </div>
                            <hr />
                            <h5>Tiêu chí đánh giá</h5>
                            <table className='table-bordered table'>
                                <thead>
                                    <tr>
                                        <th>Tiêu chí đánh giá</th>
                                        {topics.map((_, index) => (
                                            <th key={index}>Sinh viên {index + 1}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {criterias.map((criteria, criteriaIndex) => (
                                        <tr key={criteriaIndex}>
                                            <td className='criteria'>{criteria.criteriaName}</td>
                                            {topics.map((topic, topicIndex) => (
                                                <td key={topicIndex}>
                                                    <input
                                                        type='number'
                                                        step='0.25'
                                                        max={criteria.criteriaScore}
                                                        min={0}
                                                        value={scores[`${criteria.criteriaName}_${topic.subjectId}`] || 0}
                                                        onChange={(e) => handleScoreChange(`${criteria.criteriaName}_${topic.subjectId}`, e.target.value)}
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
                                                    value={criterias.reduce((sum, criteria) => {
                                                        return sum + parseFloat(scores[`${criteria.criteriaName}_${index}`] || 0);
                                                    }, 0).toFixed(2)}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className='criteria-sum' id="review">Đánh giá</td>
                                        <input></input>
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
                                Đóng
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommitteeTable;
