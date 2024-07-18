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
    const [suggestion, setSuggestion] = useState(null);

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

    const handleChangeSuggestion = (event) => {
        const { name, value } = event.target;
        setDetail(prevDetail => ({
            ...prevDetail,
            subject: {
                ...prevDetail.subject,
                [name]: value.split(',') // Chia chuỗi thành mảng nếu cần
            }
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
        axiosInstance.get(`/lecturer/council/graduation/detailCouncil/${subjectIdDetail}`, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            }
        })
            .then(response => {

                console.log("Chi tiết:", response.data);
                setDetail(response.data.body);
                setCriterias(response.data.body.criterias);
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
                editSuggestions: Array.isArray(detail.subject.editSuggestions) ? detail.subject.editSuggestions.join(',') : detail.subject.editSuggestions,
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
            toast.success("Đánh giá đề tài thành công!")
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
            <ToastContainer />
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
                                            setSubjectIdDetail(item.subjectId);
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
                                    <h5 style={{ color: '#4477CE' }}>Tiêu chí đánh giá</h5>
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
                                    <div class="mb-3">
                                        <label for="editSuggestions" class="form-label">Gợi ý chỉnh sửa</label>
                                        <textarea
                                            id="editSuggestions"
                                            name="editSuggestions"
                                            value={detail.subject.editSuggestions.join(',')} // Hiển thị như chuỗi
                                            onChange={handleChangeSuggestion}
                                            className="form-control"
                                            rows="3"
                                        />
                                    </div>
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