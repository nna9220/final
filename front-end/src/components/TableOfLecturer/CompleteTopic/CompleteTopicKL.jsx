import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import axiosInstance from '../../../API/axios';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import { DataGrid } from '@mui/x-data-grid';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import './CompleteTopic.scss';

function CompleteTopicKL() {
    const [topics, setTopics] = useState([]);
    const userToken = getTokenFromUrlAndSaveToStorage();
    const [detail, setDetail] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [activeTab, setActiveTab] = useState('detail');
    const [reviewInstruction, setReviewInstruction] = useState(null);
    const [reviewThesis, setReviewThesis] = useState(null)
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        if (userToken) {
            listTopic();
        }
    }, [userToken]);

    const listTopic = () => {
        axiosInstance.get('/lecturer/manageTutorial/graduation/subjects/successful', {
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

    const handleDetail = (id) => {
        axiosInstance.get(`/lecturer/manageTutorial/graduation/subjects/successful/detail/${id}`, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log("Detail", response.data);
                setDetail(response.data.body);
                setReviewInstruction(response.data.body.reviewInstructor);
                setReviewThesis(response.data.body.reviewThesis);
                setShowDetail(true);
            })
            .catch(error => {
                console.error("Lỗi khi lấy thông tin chi tiết:", error);
            });
    };

    const handleBackToList = () => {
        setShowDetail(false);
        setDetail(null);
    };

    const formatStudentData = () => {
        const students = [];
        if (detail?.student1) {
            students.push({
                studentId: detail.student1.person.personId,
                fullName: `${detail.student1.person.firstName} ${detail.student1.person.lastName}`,
                className: detail.student1.studentClass ? detail.student1.studentClass.classname : 'Chưa có',
                score: detail.scoreStudent1
            });
        }
        if (detail?.student2) {
            students.push({
                studentId: detail.student2.person.personId,
                fullName: `${detail.student2.person.firstName} ${detail.student2.person.lastName}`,
                className: detail.student2.studentClass ? detail.student2.studentClass.classname : 'Chưa có',
                score: detail.scoreStudent2
            });
        }
        if (detail?.student3) {
            students.push({
                studentId: detail.student2.person.personId,
                fullName: `${detail.student2.person.firstName} ${detail.student2.person.lastName}`,
                className: detail.student2.studentClass ? detail.student2.studentClass.classname : 'Chưa có',
                score: detail.scoreStudent2
            });
        }
        return students;
    };

    const columns = [
        { field: 'stt', headerName: 'STT', flex: 0.5 },
        { field: 'subjectName', headerName: 'Tên đề tài', flex: 2 },
        { field: 'instructor', headerName: 'GVHD', flex: 1.5 },
        { field: 'thesisAdvisor', headerName: 'GVPB', flex: 1.5 },
        { field: 'requirement', headerName: 'Yêu cầu', flex: 2 },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            renderCell: (params) => (
                <div>
                    <button className="btnView" onClick={() => handleDetail(params.row.subjectId)}>
                        <NoteAltOutlinedIcon />
                    </button>
                </div>
            )
        },
    ];

    return (
        <div>
            {showDetail && detail ? (
                <>
                    <Breadcrumbs aria-label="breadcrumb" className='breadcrumbList'>
                        <Link to="#" onClick={handleBackToList} className='backList'>Danh sách đề tài</Link>
                        <Typography color="textPrimary">{detail?.subject?.subjectName}</Typography>
                    </Breadcrumbs>

                    <ul className="nav-menu">
                        <li className="nav-itemm">
                            <a
                                className={`nav ${activeTab === 'detail' ? 'active' : ''}`}
                                href="#"
                                onClick={() => handleTabClick('detail')}
                            >
                                Chi tiết đề tài
                            </a>
                        </li>
                        <li className="nav-itemm">
                            <a
                                className={`nav ${activeTab === 'instructor' ? 'active' : ''}`}
                                href="#"
                                onClick={() => handleTabClick('instructor')}
                            >
                                Nhận xét của GVHD
                            </a>
                        </li>
                        <li className="nav-itemm">
                            <a
                                className={`nav ${activeTab === 'thesisadvsor' ? 'active' : ''}`}
                                href="#"
                                onClick={() => handleTabClick('thesisadvsor')}
                            >
                                Nhận xét của GVPB
                            </a>
                        </li>
                    </ul>

                    <div className="tab-content mt-3">
                        {activeTab === 'detail' && (
                            <div className="tab-pane fade show active">
                                <div className="detail-content">
                                    <h4 style={{ color: '#1872ae', fontWeight: 'bold', textAlign: 'center' }}>CHI TIẾT ĐỀ TÀI</h4>
                                    <div className="detail-item">
                                        <strong>1. Tên đề tài</strong>
                                        <span>{detail?.subject?.subjectName}</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>2. Loại đề tài</strong>
                                        <span>{detail?.subject?.typeSubject?.typeName}</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>3. Giảng viên hướng dẫn</strong>
                                        <span>
                                            {detail?.subject?.instructorId?.person ?
                                                `${detail.subject.instructorId.person.firstName} ${detail.subject.instructorId.person.lastName}` :
                                                'Chưa có'}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>4. Giảng viên phản biện</strong>
                                        <span>
                                            {detail?.subject?.thesisAdvisorId?.person ?
                                                `${detail.subject.thesisAdvisorId.person.firstName} ${detail.subject.thesisAdvisorId.person.lastName}` :
                                                'Chưa có'}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>5. Yêu cầu</strong>
                                        <span>{detail?.subject?.requirement}</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>6. Báo cáo</strong>
                                        <a href={detail?.subject?.oneHundredPercent?.url} target="_blank" rel="noopener noreferrer" download className="content-link">
                                            {detail?.subject?.oneHundredPercent?.name}
                                        </a>
                                    </div>
                                    <div className="detail-table">
                                        <strong>7. Kết quả thực hiện</strong>
                                        <table className="result-table">
                                            <thead>
                                                <tr>
                                                    <th>MSSV</th>
                                                    <th>Họ và Tên</th>
                                                    <th>Lớp</th>
                                                    <th>Điểm</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formatStudentData().map((student, index) => (
                                                    <tr key={index}>
                                                        <td>{student.studentId}</td>
                                                        <td>{student.fullName}</td>
                                                        <td>{student.className}</td>
                                                        <td>{student.score.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'instructor' && (
                            <div className="tab-pane fade show active">
                                <div className="detail-content">
                                    <h4 style={{ color: '#1872ae', fontWeight: 'bold', textAlign: 'center' }}>NHẬN XÉT CỦA GVHD</h4>
                                    <div className="detail-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <strong>1.	Về nội dung đề tài & khối lượng thực hiện</strong>
                                        <span>{reviewInstruction.reviewContent}</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>2. Ưu điểm</strong>
                                        <span>{reviewInstruction.reviewAdvantage}</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>3. Khuyết điểm</strong>
                                        <span>{reviewInstruction.reviewWeakness}</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>4. Đánh giá loại</strong>
                                        <span>{reviewInstruction.classification}</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>5. Điểm</strong>
                                        <span>{reviewInstruction.score}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'thesisadvsor' && (
                            <div className="tab-pane fade show active">
                                <div className="tab-pane fade show active">
                                    <div className="detail-content">
                                        <h4 style={{ color: '#1872ae', fontWeight: 'bold', textAlign: 'center' }}>NHẬN XÉT CỦA GVPB</h4>
                                        <div className="detail-item">
                                            <strong>1.	Về nội dung đề tài & khối lượng thực hiện</strong>
                                            <span>{reviewThesis.reviewContent}</span>
                                        </div>
                                        <div className="detail-item">
                                            <strong>2. Ưu điểm</strong>
                                            <span>{reviewThesis.reviewAdvantage}</span>
                                        </div>
                                        <div className="detail-item">
                                            <strong>3. Khuyết điểm</strong>
                                            <span>{reviewThesis.reviewWeakness}</span>
                                        </div>
                                        <div className="detail-item">
                                            <strong>4. Đánh giá loại</strong>
                                            <span>{reviewThesis.classification}</span>
                                        </div>
                                        <div className="detail-item">
                                            <strong>5. Điểm</strong>
                                            <span>{reviewThesis.score}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </>
            ) : (
                <>
                    <DataGrid
                        rows={topics.map((topic, index) => (
                            {
                                id: topic.subjectId,
                                stt: index + 1,
                                subjectId: topic.subjectId,
                                subjectName: topic.subjectName,
                                instructor: topic.instructorId?.person?.firstName + ' ' + topic.instructorId?.person?.lastName,
                                thesisAdvisor: topic.thesisAdvisorId?.person?.firstName + ' ' + topic.thesisAdvisorId?.person?.lastName,
                                requirement: topic.requirement
                            }
                        ))}
                        columns={columns}
                        pageSize={5}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        pageSizeOptions={[10, 25, 50]}
                        getRowId={(row) => row.id}
                    />
                </>
            )}
        </div>
    );
}

export default CompleteTopicKL;