import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import './TableApprove.scss';
import { Toast } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import axiosInstance from '../../../API/axios';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';

function TableApproveKL() {
    const [topics, setTopics] = useState([]);
    const [topicsDeleted, setTopicsDeleted] = useState([]);
    const userToken = getTokenFromUrlAndSaveToStorage();
    const [showTable, setShowTable] = useState(false);
    const [showDeleteToast, setShowDeleteToast] = useState(false);
    const [showErrorToastDelete, setShowErrorToastDelete] = useState(false);
    const [showApproveToast, setShowApproveToast] = useState(false);
    const [showErrorToastApprove, setShowErrorToastApprove] = useState(false);

    useEffect(() => {
        console.log("Token: " + userToken);
        if (userToken) {
            const tokenSt = sessionStorage.getItem(userToken);
            if (!tokenSt) {
                loadListDelete();
                loadTopics();
            }
        }
    }, [userToken]);

    const loadTopics = () => {
    
        axiosInstance.get('/head/subjectGraduation', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log("Topic: ", response.data);
                const topicsWithId = response.data.map((topic, index) => ({
                    ...topic,
                    id: topic.subjectId,
                    instructorName: topic.instructorId?.person?.firstName + ' ' + topic.instructorId?.person?.lastName
                }));

                setTopics(topicsWithId);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const loadListDelete = () => {
        axiosInstance.get('/head/subjectGraduation/delete', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log("Topic deleted: ", response.data);
                loadTopics();
                const topicsDeletedWithId = response.data.listSubject.map((topic, index) => ({
                    ...topic,
                    id: topic.subjectId,
                    instructorName: topic.instructorId.person.firstName + ' ' + topic.instructorId.person.lastName
                }));
                console.log("Subject: ",topicsDeletedWithId )
                setTopicsDeleted(topicsDeletedWithId);            
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleApprove = (id) => {
        axiosInstance.post(`/head/subjectGraduation/browse/${id}`, null, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log("Duyệt thành công");
                loadTopics(); // Load lại danh sách sau khi duyệt thành công
                setShowApproveToast(true);
            })
            .catch(error => {
                console.error("Lỗi khi duyệt đề tài: ", error);
                setShowErrorToastApprove(true);
            });
    };

    const handleDelete = (id) => {
        axiosInstance.post(`/head/subjectGraduation/delete/${id}`, null, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log("Xóa thành công");
                loadTopics(); // Load lại danh sách sau khi duyệt thành công
                setShowDeleteToast(true);
            })
            .catch(error => {
                console.error("Lỗi khi xóa đề tài: ", error);
                setShowErrorToastDelete(true);
            });
    }

    const columns = [
        { field: 'id', headerName: '#', width: 60 },
        { field: 'subjectName', headerName: 'Tên đề tài', width: 250 },
        { field: 'instructorName', headerName: 'Giảng viên hướng dẫn', width: 200 },
        { field: 'student1', headerName: 'Sinh viên 1', width: 100 },
        { field: 'student2', headerName: 'Sinh viên 2', width: 100 },
        { field: 'student3', headerName: 'Sinh viên 3', width: 100 },
        { field: 'requirement', headerName: 'Yêu cầu', width: 200 },
        {
            field: 'action',
            headerName: 'Action',
            width: 120,
            renderCell: (params) => (
                <>
                    {showTable ? (
                        <button className='button-res'>
                            <p className='text'><RestoreOutlinedIcon /></p>
                        </button>
                    ) : (

                        <div style={{ display: 'flex' }}>
                            <button className='button-res' onClick={() => handleApprove(params.row.id)}>
                                <p className='text'>Duyệt</p>
                            </button>
                            <button className='button-res-de' onClick={() => handleDelete(params.row.id)}>
                                <p className='text'>Xóa</p>
                            </button>
                        </div>
                    )}
                </>
            ),
        },
    ];

    return (
        <div className='body-table'>
             <Toast show={showDeleteToast} onClose={() => setShowDeleteToast(false)} delay={3000} autohide style={{ position: 'fixed', top: '80px', right: '10px' }}>
                <Toast.Header>
                    <strong className="me-auto">Thông báo</strong>
                </Toast.Header>
                <Toast.Body>
                    <DoneOutlinedIcon /> Đề tài đã được xóa!
                </Toast.Body>
            </Toast>

            <Toast show={showErrorToastDelete} onClose={() => setShowErrorToastDelete(false)} delay={3000} autohide style={{ position: 'fixed', top: '80px', right: '10px' }}>
                <Toast.Header>
                    <strong className="me-auto" style={{ color: 'red' }}><ErrorOutlineOutlinedIcon /> Lỗi</strong>
                </Toast.Header>
                <Toast.Body>
                    Xóa đề tài không thành công!
                </Toast.Body>
            </Toast>
            
            <Toast show={showApproveToast} onClose={() => setShowApproveToast(false)} delay={3000} autohide style={{ position: 'fixed', top: '80px', right: '10px' }}>
                <Toast.Header>
                    <strong className="me-auto">Thông báo</strong>
                </Toast.Header>
                <Toast.Body>
                    <DoneOutlinedIcon /> Đề tài đã được duyệt!
                </Toast.Body>
            </Toast>

            <Toast show={showErrorToastApprove} onClose={() => setShowErrorToastApprove(false)} delay={3000} autohide style={{ position: 'fixed', top: '80px', right: '10px' }}>
                <Toast.Header>
                    <strong className="me-auto" style={{ color: 'red' }}><ErrorOutlineOutlinedIcon /> Lỗi</strong>
                </Toast.Header>
                <Toast.Body>
                    Duyệt đề tài không thành công!
                </Toast.Body>
            </Toast>

            <button className='button-listDelete-approve' onClick={() => setShowTable(!showTable)}>
                    {showTable ? <><PlaylistAddCheckOutlinedIcon /> Dánh sách đề tài chưa duyệt</> : <><PlaylistRemoveOutlinedIcon /> Dánh sách đề tài đã xóa</>}
            </button>

            {showTable ? (
                <div>
                    <div className='home-table table-approve'>
                        <DataGrid
                            rows={topicsDeleted}
                            columns={columns}
                            initialState={{
                                ...topics.initialState,
                                pagination: { paginationModel: { pageSize: 10 } },
                            }}
                            pageSizeOptions={[10, 25, 50]}
                        />
                    </div>
                </div>
            ) : (
                <div className='home-table table-approve'>
                    <DataGrid
                        rows={topics}
                        columns={columns}
                        initialState={{
                            ...topics.initialState,
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        pageSizeOptions={[10, 25, 50]}
                    />
                </div>
            )}
        </div>
    );
}

export default TableApproveKL