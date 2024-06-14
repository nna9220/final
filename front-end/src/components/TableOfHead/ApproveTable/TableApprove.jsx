import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import axiosInstance from '../../../API/axios';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
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
        console.log("Token: " + userToken);
        if (userToken) {
            const tokenSt = sessionStorage.getItem(userToken);
            if (!tokenSt) {
                loadTimeApprove();
            }
        }
    }, [userToken]);

    const loadTopics = () => {
        axiosInstance.get('/head/subject', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log("Topic: ", response.data);
                const topicsWithId = response.data.listSubject.map((topic, index) => ({
                    ...topic,
                    id: topic.subjectId,
                    instructorName: topic.instructorId.person.firstName + ' ' + topic.instructorId.person.lastName
                }));
                setTopics(topicsWithId);
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
                console.log("Topic deleted: ", response.data);
                const topicsDeletedWithId = response.data.lstSubject.map((topic, index) => ({
                    ...topic,
                    id: topic.subjectId,
                    instructorName: topic.instructorId.person.firstName + ' ' + topic.instructorId.person.lastName
                }));
                setTopicsDeleted(topicsDeletedWithId);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const loadTimeApprove = () => {
        axiosInstance.get('/head/subjectGraduation/timeApprove', {
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
            })
            .catch(error => {
                console.error("Lỗi khi duyệt đề tài: ", error);
                if (error.response && error.response.status === 400 && error.response.data === "Không nằm trong thời gian duyệt") {
                    setIsApprovalPeriod(false);
                } else {
                }
                toast.error(toastMessage);
            });
    };

    const handleDelete = (id) => {
        axiosInstance.post(`/head/subject/delete/${id}`, null, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                toast.success("Xóa thành công");
                console.log("Xóa thành công");
            })
            .catch(error => {
                console.error("Lỗi khi xóa đề tài: ", error);
                toast.error("Lỗi khi xóa đề tài!");
            });
    };

    const columns = [
        { field: 'id', headerName: '#', width: 60 },
        { field: 'subjectName', headerName: 'Tên đề tài', width: 250 },
        { field: 'instructorName', headerName: 'GVHD', width: 150 },
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
                    {!showTable ? (
                        <div style={{ display: 'flex' }}>
                            <button type="button" className="btn button-res" data-bs-toggle="modal" data-bs-target="#approve" onClick={() => { setSubjectName(params.row.subjectName); setSubjectId(params.row.id) }}>
                                <p className='text'>Duyệt</p>
                            </button>
                            <button type="button" className="btn button-res-de" data-bs-toggle="modal" data-bs-target="#delete" onClick={() => { setSubjectName(params.row.subjectName); setSubjectId(params.row.id) }}>
                                <p className='text'>Xóa</p>
                            </button>
                        </div>
                    ) : (
                        <button className='button-res'>
                            <p className='text'><RestoreOutlinedIcon /></p>
                        </button>
                    )}
                </>
            ),
        },
    ];

    return (
        <div className='body-table'>
            <ToastContainer />
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
                    <div className="alert alert-warning alert-head" role="alert" style={{backgroundColor:'white', border:'none'}}>
                             {toastMessage}
                        </div>
                </>
            )}

            <div className="modal fade" id="approve" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Duyệt dề tài</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Bạn chắn chắn muốn duyệt đề tài {subjectName}?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => handleApprove(subjectId)}>Confirm</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="delete" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Xóa dề tài</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Bạn chắn chắn muốn xóa đề tài {subjectName}?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => handleDelete(subjectId)}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TableApprove;
