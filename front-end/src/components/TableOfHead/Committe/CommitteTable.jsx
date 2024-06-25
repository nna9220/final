import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import axiosInstance from '../../../API/axios';
import './committe.scss';

function CommitteTable() {
    const [topics, setTopics] = useState([]);
    const [criterias, setCriterias] = useState([]);
    const [detail, setDetail] = useState(null);
    const [scores, setScores] = useState({});
    const [review, setReview] = useState({});
    const [subjectIdDetail, setSubjectIdDetail] = useState(null);
    const [subjectId, setSubjectId] = useState(null);
    const userToken = getTokenFromUrlAndSaveToStorage();

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

    const listTopic = () => {
        axiosInstance.get('/head/council/listSubject', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            }
        })
        .then(response => {
            setTopics(response.data || []);
            console.log("Topic:", response.data)
        })
        .catch(error => {
            console.error(error);
        });
    };

    const detailTopic = () => {
        axiosInstance.get(`/head/council/detail/${subjectIdDetail}`, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            }
        })
        .then(response => {
            setDetail(response.data.body || null);
            console.log("Detail: ", response.data);
        })
        .catch(error => {
            console.error('Lỗi lấy chi tiết:', error);
        });
    };

    const listCriteria = () => {
        axiosInstance.get('/head/council/listCriteria', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            }
        })
        .then(response => {
            setCriterias(response.data.body || []);
        })
        .catch(error => {
            console.error(error);
        });
    };

    const handleScoreChange = (studentId, criteriaKey, value) => {
        setScores(prevScores => ({
            ...prevScores,
            [`${studentId}_${criteriaKey}`]: parseFloat(value)
        }));
    };

    const handleReviewChange = (studentId, value) => {
        setReview(prevReviews => ({
            ...prevReviews,
            [studentId]: value
        }));
    };

    const calculateTotalScore = (studentId) => {
        let totalScore = 0;
        criterias.forEach(criteria => {
            const score = parseFloat(scores[`${studentId}_${criteria.criteriaName}`]) || 0;
            totalScore += score;
        });
        return totalScore.toFixed(2);
    };

    const submitEvaluation = async () => {
        try {
            const evaluationData = {
                studentId1: detail.subject.student1,
                studentId2: detail.subject.student2,
                studentId3: detail.subject.student3,
                scoreStudent1: parseFloat(calculateTotalScore(detail.subject.student1)),
                scoreStudent2: detail.subject.student2 ? parseFloat(calculateTotalScore(detail.subject.student2)) : null,
                scoreStudent3: detail.subject.student3 ? parseFloat(calculateTotalScore(detail.subject.student3)) : null,
                reviewStudent1: review[detail.subject.student1] || null,
                reviewStudent2: detail.subject.student2 ? (review[detail.subject.student2] || null) : null,
                reviewStudent3: detail.subject.student3 ? (review[detail.subject.student3] || null) : null,
            };

            const response = await axiosInstance.post(`/head/council/evaluation-scoring/${subjectId}`, evaluationData, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('userToken')}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log("Đánh giá và tính điểm thành công: ", response.data);
        } catch (error) {
            console.error("Lỗi khi đánh giá và tính điểm: ", error);
        }
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
                        {topics.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center">Không có dữ liệu</td>
                            </tr>
                        ) : (
                            topics.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.subject.subjectName}</td>
                                    <td>{item.subject?.instructorId?.person?.firstName} {item.subject?.instructorId?.person?.lastName}</td>
                                    <td>{item.subject?.thesisAdvisorId?.person?.firstName} {item.subject?.thesisAdvisorId?.person?.lastName}</td>
                                    <td>{item.subject?.student1}</td>
                                    <td>{item.subject?.student2}</td>
                                    <td>{item.subject?.student3}</td>
                                    <td>
                                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"
                                            onClick={() => {
                                                setDetail(item.subject);
                                                setSubjectIdDetail(item.councilId);
                                                setSubjectId(item.subject.subjectId);
                                            }}>
                                            Đánh giá
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
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
                            {detail && detail.subject ? (
                                <>
                                    <h5 style={{color:'#4477CE'}}>Thông tin đề tài</h5>
                                    <div>
                                        <table className="table table-bordered">
                                            <tbody>
                                                <tr>
                                                    <td className="table-key">1. Tên đề tài:</td>
                                                    <td className="table-value">{detail.subject.subjectName}</td>
                                                </tr>
                                                <tr>
                                                    <td className="table-key">2. Loại đề tài:</td>
                                                    <td className="table-value">{detail.subject.typeSubject.typeName}</td>
                                                </tr>
                                                <tr>
                                                    <td className="table-key">3. Chuyên ngành:</td>
                                                    <td className="table-value">{detail.subject.major}</td>
                                                </tr>
                                                <tr>
                                                    <td className="table-key">4. Giảng viên hướng dẫn:</td>
                                                    <td className="table-value">{detail.subject.instructorId.person.firstName} {detail.subject.instructorId.person.lastName}</td>
                                                </tr>
                                                <tr>
                                                    <td className="table-key">5. Giảng viên phản biện:</td>
                                                    <td className="table-value">{detail.subject.thesisAdvisorId.person.firstName} {detail.subject.thesisAdvisorId.person.lastName}</td>
                                                </tr>
                                                <tr>
                                                    <td className="table-key">6. Yêu cầu:</td>
                                                    <td className="table-value">{detail.subject.requirement}</td>
                                                </tr>
                                                <tr>
                                                    <td className="table-key">7. Danh sách thành viên:</td>
                                                    <td className="table-value">
                                                        <ul>
                                                            <li>Sinh viên 1: {detail.subject.student1}</li>
                                                            <li>Sinh viên 2: {detail.subject.student2}</li>
                                                            <li>Sinh viên 3: {detail.subject.student3}</li>
                                                        </ul>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <hr />
                                    <h5 style={{color:'#4477CE'}}>Tiêu chí đánh giá</h5>
                                    <table className='table-bordered table criteria-table'>
                                        <thead>
                                            <tr>
                                                <th className="criteria-column">Tiêu chí đánh giá</th>
                                                {['student1', 'student2', 'student3'].map((student, index) => (
                                                    <th key={index} className="student-column">Sinh viên {index + 1}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {criterias && criterias.length > 0 ? (
                                                criterias.map((criteria, criteriaIndex) => (
                                                    <tr key={criteriaIndex}>
                                                        <td className='criteria criteria-column'>{criteria.criteriaName}</td>
                                                        {['student1', 'student2', 'student3'].map((student, studentIndex) => (
                                                            <td key={studentIndex} className="student-column">
                                                                <input
                                                                    type='number'
                                                                    step='0.25'
                                                                    max={criteria.criteriaScore}
                                                                    min={0}
                                                                    value={scores[`${detail.subject[student]}_${criteria.criteriaName}`] || 0}
                                                                    onChange={(e) => handleScoreChange(detail.subject[student], criteria.criteriaName, e.target.value)}
                                                                />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4}>Chưa có tiêu chí đánh giá</td>
                                                </tr>
                                            )}
                                            <tr>
                                                <td className='criteria-sum criteria-column'>Tổng</td>
                                                {['student1', 'student2', 'student3'].map((student, studentIndex) => (
                                                    <td key={studentIndex} className="student-column">
                                                        {detail.subject[student] ? calculateTotalScore(detail.subject[student]) : 'N/A'}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className='criteria-sum criteria-column' id="review">Đánh giá</td>
                                                {['student1', 'student2', 'student3'].map((student, studentIndex) => (
                                                    <td key={studentIndex} className="student-column">
                                                        <textarea
                                                            className="form-control"
                                                            value={review[detail.subject[student]] || ''}
                                                            onChange={(e) => handleReviewChange(detail.subject[student], e.target.value)}
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Đóng
                            </button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={submitEvaluation}>
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommitteTable;

