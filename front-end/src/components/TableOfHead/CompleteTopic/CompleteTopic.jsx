import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import axiosInstance from '../../../API/axios';
import { DataGrid } from '@mui/x-data-grid';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import Drawer from '@mui/material/Drawer';
import './CompleteTopic.scss';

function CompleteTopic() {
    const [topics, setTopics] = useState([]);
    const userToken = getTokenFromUrlAndSaveToStorage();
    const [detail, setDetail] = useState();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        if (userToken) {
            listTopic();
        }
    }, [userToken]);

    const listTopic = () => {
        axiosInstance.get('/head/manageTutorial/subjects/successful', {
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
        console.log("id student", id);
        axiosInstance.get(`/head/manageTutorial/subjects/successful/detail/${id}`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('userToken')}`,
            },
        })
            .then(response => {
                console.log("Detail", response.data);
                setDetail(response.data.body);
                setIsDrawerOpen(true);
            })
            .catch(error => {
                console.error("Lỗi khi lấy thông tin sinh viên:", error);
            });
    };

    const columns = [
        { field: 'subjectId', headerName: 'ID', width: 100 },
        { field: 'subjectName', headerName: 'Tên đề tài', width: 250 },
        { field: 'instructor', headerName: 'GVHD', width: 150 },
        { field: 'thesisAdvisor', headerName: 'GVPB', width: 150 },
        { field: 'requirement', headerName: 'Yêu cầu', width: 250 },
        {
            field: 'action', headerName: 'Action', width: 100, renderCell: (params) => (
                <div>
                    <button className="btnView" onClick={() => handleDetail(params.row.subjectId)}>
                        <NoteAltOutlinedIcon />
                    </button>
                </div>
            )
        },
    ];

    return (
        <>
            <DataGrid
                rows={topics.map((topic) => (
                    {
                        id: topic.subjectId,
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
                    ...topics.initialState,
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[10, 25, 50]}
                getRowId={(row) => row.id}
            />
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                PaperProps={{
                    style: {
                        width: '50%', // Chiều rộng cố định
                        padding: '16px'
                    }
                }}
            >
                <div className="drawer-content">
                    <h4>Chi tiết đề tài</h4>
                    <div className="detail-item">
                        <strong>1. Tên đề tài:</strong>
                        <span>{detail?.subjectName}</span>
                    </div>
                    <div className="detail-item">
                        <strong>2. Loại đề tài:</strong>
                        <span>{detail?.typeSubject?.typeName}</span>
                    </div>
                    <div className="detail-item">
                        <strong>3. Giảng viên hướng dẫn:</strong>
                        <span>{detail?.instructorId?.person?.firstName} {detail?.instructorId?.person?.lastName}</span>
                    </div>
                    <div className="detail-item">
                        <strong>4. Giảng viên phản biện:</strong>
                        <span>{detail?.thesisAdvisorId?.person ? `${detail?.thesisAdvisorId?.person?.firstName} ${detail?.thesisAdvisorId?.person?.lastName}` : 'Chưa có'}</span>
                    </div>
                    <div className="detail-item">
                        <strong>5. Nhóm sinh viên thực hiện:</strong>
                        <div className="student-list">
                            <div><strong>Sinh viên 1:</strong> {detail?.student1}</div>
                            <div><strong>Sinh viên 2:</strong> {detail?.student2}</div>
                            <div><strong>Sinh viên 3:</strong> {detail?.student3}</div>
                        </div>
                    </div>
                    <div className="detail-item">
                        <strong>6. Yêu cầu:</strong>
                        <span>{detail?.requirement}</span>
                    </div>
                    <div className="detail-item">
                        <strong>7. Báo cáo:</strong>
                        <a href={detail?.oneHundredPercent?.url} target="_blank" rel="noopener noreferrer" download className="content-link">
                            {detail?.oneHundredPercent?.name}
                        </a>
                    </div>
                    <div className="detail-item">
                        <strong>8. Kết quả báo cáo:</strong>
                        <div className="student-list">
                            <div><strong>Điểm của GVHD</strong> {detail?.student1}</div>
                            <div><strong>Điểm của GVPB</strong> {detail?.student2}</div>
                        </div>
                    </div>
                </div>
            </Drawer>
        </>
    );
}

export default CompleteTopic;
