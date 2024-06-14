import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    const [toastMessage, setToastMessage] = useState("Duyệt đề tài không thành công!");
    const [subjectName, setSubjectName] = useState();
    const [subjectId, setSubjectId] = useState(null);
    const [isApprovalPeriod, setIsApprovalPeriod] = useState(true);

    useEffect(() => {
        console.log("Token: " + userToken);
        if (userToken) {
            const tokenSt = sessionStorage.getItem(userToken);
            if (!tokenSt) {
                loadTimeApprove();
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
                console.log("Subject: ", topicsDeletedWithId)
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
                toast.success("Duyệt đề tài thành công!");
                loadTopics(); // Load lại danh sách sau khi duyệt thành công
            })
            .catch(error => {
                toast.error("Lỗi khi duyệt đề tài!");
                console.error("Lỗi khi duyệt đề tài: ", error);
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
                toast.success("Xóa thành công")
            })
            .catch(error => {
                console.error("Lỗi khi xóa đề tài: ", error);
                toast.error("Lỗi khi xóa đề tài!")
            });
    }

    const loadTimeApprove = () => {
        axiosInstance.get('/head/subject/timeApprove', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                setIsApprovalPeriod(true);
                loadTopics();
                loadListDelete();
            })
            .catch(error => {
                setIsApprovalPeriod(false);
                setToastMessage("Không nằm trong thời gian duyệt đề tài!!!");
            });
    };

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
                            <button type="button" class="btn button-res" data-bs-toggle="modal" data-bs-target="#approve" onClick={() => { setSubjectName(params.row.subjectName); setSubjectId(params.row.id) }}>
                                <p className='text'>Duyệt</p>
                            </button>
                            <button type="button" class="btn button-res-de" data-bs-toggle="modal" data-bs-target="#delete" onClick={() => { setSubjectName(params.row.subjectName); setSubjectId(params.row.id) }}>
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
            {isApprovalPeriod && (
                <button className='button-listDelete-approve' onClick={() => setShowTable(!showTable)}>
                    {showTable ? <><PlaylistAddCheckOutlinedIcon /> Dánh sách đề tài chưa duyệt</> : <><PlaylistRemoveOutlinedIcon /> Dánh sách đề tài đã xóa</>}
                </button>
            )}

            {isApprovalPeriod ? (
                !showTable ? (
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
                )
            ) : (
                <>
                    <div className="alert alert-warning alert-head" role="alert" style={{ backgroundColor: 'white', border: 'none' }}>
                        {toastMessage}
                    </div>
                </>
            )}

            <div class="modal fade" id="approve" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Duyệt dề tài</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            Bạn chắn chắn muốn duyệt đề tài {subjectName}?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={() => handleApprove(subjectId)}>Confirm</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="delete" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Xóa dề tài</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            Bạn chắn chắn muốn xóa đề tài {subjectName}?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={() => handleDelete(subjectId)}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TableApproveKL