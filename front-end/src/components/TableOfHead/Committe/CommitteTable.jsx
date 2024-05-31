import React from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import axiosInstance from '../../../API/axios';
import { useState, useEffect } from 'react';

function CommitteTable() {
    const userToken = getTokenFromUrlAndSaveToStorage();
    const [committe, setCommitte] = useState([]);
    const [criterias, setCriterias] = useState([]);
    const [detail, setDetail] = useState(null);
    const [scores, setScores] = useState({});
    const [reviews, setReviews] = useState({});
    const [subjectIdDetail, setSubjectIdDetail] = useState(null);
    const [subjectId, setSubjectId] = useState(null);
    const [id, setId] = useState(null);
    const [evaluation, setEvaluation] = useState({
        studentId1: '',
        studentId2: '',
        studentId3: '',
        score1Student: '',
        score2Student: '',
        score3Student: '',
        reviewStudent1: '',
        reviewStudent2: '',
        reviewStudent3: '',
    })
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


    const handleScoreChange = (studentId, criteriaKey, value) => {
        setScores(prevScores => ({
            ...prevScores,
            [`${studentId}_${criteriaKey}`]: parseFloat(value)
        }));
    };


    const handleReviewChange = (studentId, value) => {
        setReviews(prevReviews => ({
            ...prevReviews,
            [studentId]: value
        }));
    };

    const listTopic = () => {
        axiosInstance.get('/head/council/listSubject', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            }
        })
            .then(response => {
                console.log("Danh sách đề tài: ", response.data);
                setCommitte(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const detailTopic = () => {
        console.log("ID: ", subjectIdDetail);
        axiosInstance.get(`/head/council/detail/${subjectIdDetail}`, {
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
        axiosInstance.get('/head/council/listCriteria', {
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

    const calculateTotalScore = (studentId) => {
        let totalScore = 0;
        criterias.forEach(criteria => {
            const score = parseFloat(scores[`${studentId}_${criteria.criteriaName}`]) || 0;
            totalScore += score;
        });
        return totalScore.toFixed(2); // Làm tròn tổng điểm đến 2 chữ số thập phân
    };

    const submitEvaluation = async () => {
        try {
            const evaluationData = {
                studentId1: detail.subject.student1,
                studentId2: detail.subject.student2,
                studentId3: detail.subject.student3,
                score1Student: detail.subject.student1 ? parseFloat(calculateTotalScore(detail.subject.student1)) : null,
                score2Student: detail.subject.student2 ? parseFloat(calculateTotalScore(detail.subject.student2)) : null,
                score3Student: detail.subject.student3 ? parseFloat(calculateTotalScore(detail.subject.student3)) : null,
                reviewStudent1: detail.subject.student1 ? (reviews[detail.subject.student1] || null) : null,
                reviewStudent2: detail.subject.student2 ? (reviews[detail.subject.student2] || null) : null,
                reviewStudent3: detail.subject.student3 ? (reviews[detail.subject.student3] || null) : null,
            };

            console.log("Data to Submit: ", subjectId);
            const response = await axiosInstance.post(`/head/council/evaluation-scoring/${subjectId}`, evaluationData, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('userToken')}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log("Đánh giá và tính điểm thành công: ", response.data);
            // Có thể thêm các xử lý sau khi gửi đánh giá và tính điểm thành công
        } catch (error) {
            console.error("Lỗi khi đánh giá và tính điểm: ", error);
            // Có thể thêm các xử lý khi có lỗi xảy ra
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
                            <th scope='col'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {committe.map((item, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.subject?.subjectName}</td>
                                <td>{item.subject?.instructorId?.person?.firstName + ' ' + item.subject?.instructorId?.person?.lastName}</td>
                                <td>{item.subject?.thesisAdvisorId?.person?.firstName + ' ' + item.subject?.thesisAdvisorId?.person?.lastName}</td>
                                <td>{item.subject?.student1}</td>
                                <td>{item.subject?.student2}</td>
                                <td>{item.subject?.student3}</td>
                                <td>
                                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"
                                        onClick={() => {
                                            setDetail(item.subject.subjectId);
                                            setSubjectIdDetail(item.councilId);
                                            setSubjectId(item.subject.subjectId)
                                        }}>
                                        Đánh giá
                                    </button>
                                </td>
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
                            {detail && detail.subject ? (
                                <>
                                    <h5>Thông tin đề tài</h5>
                                    <div>
                                        <p>1. Tên đề tài: {detail.subject.subjectName}</p>
                                        <p>2. Loại đề tài: {detail.subject.typeSubject?.typeName}</p>
                                        <p>3. Chuyên ngành: {detail.subject.major}</p>
                                        <p>4. Giảng viên hướng dẫn: {detail.subject.instructorId?.person?.firstName} {detail.subject.instructorId?.person?.lastName}</p>
                                        <p>5. Giảng viên phản biện: {detail.subject.thesisAdvisorId?.person?.firstName} {detail.subject.thesisAdvisorId?.person?.lastName}</p>
                                        <p>6. Yêu cầu: {detail.subject.requirement}</p>
                                        <p>7. Danh sách thành viên</p>
                                        <p> - Sinh viên 1: {detail.subject.student1}</p>
                                        <p> - Sinh viên 2: {detail.subject.student2}</p>
                                        <p> - Sinh viên 3: {detail.subject.student3}</p>
                                    </div>
                                    <hr />
                                    <h5>Tiêu chí đánh giá</h5>
                                    <table className='table-bordered table'>
                                        <thead>
                                            <tr>
                                                <th>Tiêu chí đánh giá</th>
                                                {['student1', 'student2', 'student3'].map((student, index) => (
                                                    <th key={index}>Sinh viên {index + 1}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {criterias.map((criteria, criteriaIndex) => (
                                                <tr key={criteriaIndex}>
                                                    <td className='criteria'>{criteria.criteriaName}</td>
                                                    {['student1', 'student2', 'student3'].map((student, studentIndex) => (
                                                        <td key={studentIndex}>
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
                                            ))}
                                            <tr>
                                                <td className='criteria-sum'>Tổng</td>
                                                {['student1', 'student2', 'student3'].map((student, studentIndex) => (
                                                    <td key={studentIndex}>
                                                        <input
                                                            type='number'
                                                            step='0.25'
                                                            className='score'
                                                            readOnly
                                                            value={(parseFloat(scores[detail.subject[student]]) || 0).toFixed(2)}
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className='criteria-sum' id="review">Đánh giá</td>
                                                {['student1', 'student2', 'student3'].map((student, studentIndex) => (
                                                    <td key={studentIndex}>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={reviews[detail.subject[student]] || ''}
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
                                onClick={submitEvaluation}
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

export default CommitteTable;
