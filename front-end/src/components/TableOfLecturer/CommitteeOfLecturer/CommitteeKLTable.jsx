import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import axiosInstance from '../../../API/axios';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { toast, ToastContainer } from 'react-toastify';

function CommitteeKLTable() {
    const [topics, setTopics] = useState([]);
    const [criterias, setCriterias] = useState([]);
    const [detail, setDetail] = useState(null);
    const [scores, setScores] = useState({});
    const [review, setReview] = useState({});
    const userToken = getTokenFromUrlAndSaveToStorage();
    const [subjectIdDetail, setSubjectIdDetail] = useState(null);
    const [subjectId, setSubjectId] = useState(null);

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
        setReview(prevReviews => ({
            ...prevReviews,
            [studentId]: value
        }));
    };

    const listTopic = () => {
        axiosInstance.get('/lecturer/council/graduation/listSubject', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            }
        })
            .then(response => {
                console.log("Danh sách đề tài - KL: ", response.data.body.subjects);
                setTopics(response.data.body.subjects);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const detailTopic = () => {
        console.log("ID: ", subjectIdDetail);
        axiosInstance.get(`/lecturer/council/graduation/detail/${subjectIdDetail}`, {
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
        axiosInstance.get('/lecturer/council/graduation/listCriteria', {
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
            console.log("student1: " + detail.subject.student1);
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

            console.log("Data to Submit: ", evaluationData);
            const response = await axiosInstance.post(`/lecturer/council/graduation/review-score/${subjectId}`, evaluationData, {
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

    const handleExport = async () => {
        try {
            const response = await axiosInstance.get('/graduation/export/criteria', {
                responseType: 'blob', // Đảm bảo rằng phản hồi được nhận dưới dạng blob
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                }
            });

            // Tạo URL cho tệp tải xuống
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Đặt tên tệp mặc định
            link.setAttribute('download', 'exported-file.docx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success('Xuất file thành công!');
        } catch (error) {
            toast.error('Lỗi xuất file !');
        }
    };

    return (
        <div style={{ margin: '20px' }}>
            <ToastContainer/>
            <div className='body-table-committe'>
                <button onClick={handleExport} style={{ backgroundColor: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bolder', color: '#00337C' }}>
                    <DownloadOutlinedIcon /> Xuất file tiêu chí đánh giá
                </button>
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
                                <td>{item.subjectName}</td>
                                <td>{item.instructorId?.person?.firstName + ' ' + item.instructorId?.person?.lastName}</td>
                                <td>{item.thesisAdvisorId?.person?.firstName + ' ' + item.thesisAdvisorId?.person?.lastName}</td>
                                <td>{item.student1}</td>
                                <td>{item.student2}</td>
                                <td>{item.student3}</td>
                                <td>
                                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"
                                        onClick={() => {
                                            setDetail(item.subjectId);
                                            setSubjectIdDetail(item.council.councilId);
                                            setSubjectId(item.subjectId);
                                        }}>
                                        Đánh giá
                                    </button>
                                </td>
                                <td style={{ display: 'none' }}>{item.subjectId}</td>
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
                                        <p>1. Tên đề tài: {detail?.subject?.subjectName}</p>
                                        <p>2. Loại đề tài: {detail?.subject?.typeSubject?.typeName}</p>
                                        <p>3. Chuyên ngành: {detail?.subject?.major}</p>
                                        <p>4. Giảng viên hướng dẫn: {detail?.subject?.instructorId?.person?.firstName + ' ' + detail.subject?.instructorId?.person?.lastName}</p>
                                        <p>5. Giảng viên phản biện: {detail?.subject?.thesisAdvisorId?.person?.firstName + ' ' + detail.subject?.thesisAdvisorId?.person?.lastName}</p>
                                        <p>6. Yêu cầu: {detail?.subject?.requirement}</p>
                                        <p>7. Danh sách thành viên</p>
                                        <p> - Sinh viên 1: {detail?.subject?.student1}</p>
                                        <p> - Sinh viên 2: {detail?.subject?.student2}</p>
                                        <p> - Sinh viên 3: {detail?.subject?.student3}</p>
                                    </div>
                                    <hr />
                                    <h5>Tiêu chí đánh giá</h5>
                                    <tbody>
                                        {criterias.length > 0 ? (
                                            criterias.map((criteria, criteriaIndex) => (
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
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4}>Chưa có tiêu chí đánh giá</td>
                                            </tr>
                                        )}
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
                                                        value={review[detail.subject[student]] || ''}
                                                        onChange={(e) => handleReviewChange(detail.subject[student], e.target.value)}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
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
                                data-bs-dismiss="modal" onClick={submitEvaluation}
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

export default CommitteeKLTable