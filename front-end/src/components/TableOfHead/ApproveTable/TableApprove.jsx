import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import axiosInstance from '../../../API/axios';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import './TableApprove.scss';

function TableApprove() {
    const [topics, setTopics] = useState([]);
    const [topicsDeleted, setTopicsDeleted] = useState([]);
    const userToken = getTokenFromUrlAndSaveToStorage();
    const [showTable, setShowTable] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [subjectName, setSubjectName] = useState();
    const [subjectId, setSubjectId] = useState(null);
    const [isApprovalPeriod, setIsApprovalPeriod] = useState(true);

    useEffect(() => {
        if (userToken) {
            loadTimeApprove();
        }
    }, [userToken]);

    const loadTopics = () => {
        axiosInstance.get('/head/subject', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                const topicsWithId = response.data.listSubject.map((topic, index) => ({
                    ...topic,
                    id: topic.subjectId,
                    instructorName: `${topic.instructorId.person.firstName} ${topic.instructorId.person.lastName}`
                }));
                setTopics(topicsWithId);
                console.log("Topic: ", response.data.listSubject);
                setShowTable(true);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const loadListDelete = () => {
        axiosInstance.get('/head/subject/delete', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                const topicsDeletedWithId = response.data.lstSubject.map((topic, index) => ({
                    ...topic,
                    id: topic.subjectId,
                    instructorName: `${topic.instructorId.person.firstName} ${topic.instructorId.person.lastName}`
                }));
                setTopicsDeleted(topicsDeletedWithId);
                console.log("Topic đã xóa: ", response.data.lstSubject);
                setShowTable(false);
            })
            .catch(error => {
                console.error(error);
            });
    };

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

    const handleApprove = (id) => {
        axiosInstance.post(`/head/subject/browse/${id}`, null, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                toast.success("Duyệt đề tài thành công!");
                setIsApprovalPeriod(true);
                loadTopics();
            })
            .catch(error => {
                console.error("Lỗi khi duyệt đề tài: ", error);
                if (error.response && error.response.status === 400 && error.response.data === "Không nằm trong thời gian duyệt") {
                    setIsApprovalPeriod(false);
                    loadTopics();
                } else {
                    toast.error("Lỗi khi duyệt đề tài!");
                }
            });
    };

    const handleDelete = (id) => {
        axiosInstance.post(`/head/subject/delete/${id}`, null, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                toast.success("Xóa đề tài thành công");
                loadListDelete();
            })
            .catch(error => {
                console.error("Lỗi khi xóa đề tài: ", error);
                toast.error("Lỗi khi xóa đề tài!");
            });
    };

    const handleRestore = (id) => {
        axiosInstance.post(`/head/subject/restore/${id}`, null, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                toast.success("Khôi phục đề tài thành công");
                loadListDelete();
                loadTopics();
            })
            .catch(error => {
                console.error("Lỗi khi khôi phục đề tài: ", error);
                toast.error("Lỗi khi khôi phục đề tài!");
            });
    };

    const columns = [
        { field: 'id', headerName: '#', width: 60 },
        { field: 'subjectName', headerName: 'Tên đề tài', width: 200 },
        { field: 'instructorName', headerName: 'GVHD', width: 180 },
        { field: 'student1', headerName: 'Sinh viên 1', width: 100 },
        { field: 'student2', headerName: 'Sinh viên 2', width: 100 },
        { field: 'student3', headerName: 'Sinh viên 3', width: 100 },
        { field: 'requirement', headerName: 'Yêu cầu', width: 200 },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => (
                <>
                    {showTable ? (
                        <div style={{ display: 'flex' }}>
                            <button type="button" className="btn button-res" data-bs-toggle="modal" data-bs-target="#approve" onClick={() => { setSubjectName(params.row.subjectName); setSubjectId(params.row.id) }}>
                                <p className='text'><DoneOutlineOutlinedIcon /></p>
                            </button>
                            <button type="button" className="btn button-res-de" data-bs-toggle="modal" data-bs-target="#delete" onClick={() => { setSubjectName(params.row.subjectName); setSubjectId(params.row.id) }}>
                                <p className='text'><DeleteForeverOutlinedIcon /></p>
                            </button>
                        </div>
                    ) : (
                        <button className='button-res' data-bs-toggle="modal" data-bs-target="#restore" onClick={() => { setSubjectName(params.row.subjectName); setSubjectId(params.row.id) }}>
                            <p className='text'><RestoreOutlinedIcon /></p>
                        </button>
                    )}
                </>
            ),
        },
    ];

    const handleExport = () => {
        console.log(userToken);
        axiosInstance.get('/head/subject/export', {
            responseType: 'blob',  // Specify the response type as blob
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
        .then(response => {
            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `subject_${new Date().toISOString()}.xls`; // Adjust filename if needed
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error("Error exporting data:", error);
            toast.error("Error exporting data!");
        });
    }
    

    return (
        <div className='body-table'>
            <ToastContainer />
            <button type="button" class="btn btn-primary"  onClick = {handleExport}><FileDownloadOutlinedIcon/>Export</button>
            {isApprovalPeriod && (
                <button className='button-listDelete-approve' onClick={() => setShowTable(!showTable)}>
                    {showTable ? <><PlaylistAddCheckOutlinedIcon /> Dánh sách đề tài đã xóa</> : <><PlaylistRemoveOutlinedIcon /> Dánh sách đề tài chờ duyệt</>}
                </button>
            )}

            {isApprovalPeriod ? (
                showTable ? (
                    topics.length > 0 ? (
                        <div className='home-table table-approve'>
                            <DataGrid
                                rows={topics}
                                columns={columns}
                                initialState={{
                                    pagination: { paginationModel: { pageSize: 10 } },
                                }}
                                pageSizeOptions={[10, 25, 50]}
                            />
                        </div>
                    ) : (
                        <div className='no-data'>Không có dữ liệu</div>
                    )
                ) : (
                    topicsDeleted.length > 0 ? (
                        <div className='home-table table-approve'>
                            <DataGrid
                                rows={topicsDeleted}
                                columns={columns}
                                pageSize={10}
                                initialState={{
                                    pagination: { paginationModel: { pageSize: 10 } },
                                }}
                                pageSizeOptions={[10, 25, 50]}
                            />
                        </div>
                    ) : (
                        <div className='no-data'>Không có dữ liệu</div>
                    )
                )
            ) : (
                <div className="alert alert-warning alert-head" role="alert" style={{ backgroundColor: 'white', border: 'none' }}>
                    {toastMessage}
                </div>
            )}

            <div className="modal fade" id="approve" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Duyệt đề tài</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Bạn chắc chắn muốn duyệt đề tài {subjectName}?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => handleApprove(subjectId)}>Xác nhận</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="delete" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Xóa đề tài</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Bạn chắc chắn muốn xóa đề tài {subjectName}?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => handleDelete(subjectId)}>Xác nhận</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="restore" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Khôi phục đề tài</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Bạn chắc chắn muốn khôi phục đề tài {subjectName}?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => handleRestore(subjectId)}>Xác nhận</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TableApprove;
