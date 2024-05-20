import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import './TableApprove.scss';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import axiosInstance from '../../../API/axios';

function TableApproveBeforePB() {
    const [topics, setTopics] = useState([]);
    const [timeApprove, setTimeApprove] = useState([]);
    const [currentPeriod, setCurrentPeriod] = useState(null);
    const [topicsDeleted, setTopicsDeleted] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [subjectIdToRefuse, setSubjectIdToRefuse] = useState(null);
    const [reason, setReason] = useState('');

    const userToken = getTokenFromUrlAndSaveToStorage();

    useEffect(() => {
        if (userToken) {
            loadTopics();
            loadTimeApprove();
        }
    }, [userToken]);

    useEffect(() => {
        if (timeApprove.length > 0) {
            const currentDate = new Date();
            const currentDateTime = currentDate.getTime();
            const currentPeriod = timeApprove.find(time => {
                const startTime = convertStringToDate(time.timeStart).getTime();
                const endTime = convertStringToDate(time.timeEnd).getTime();
                return currentDateTime >= startTime && currentDateTime <= endTime;
            });
            setCurrentPeriod(currentPeriod);
        }
    }, [timeApprove]);

    const loadTopics = () => {
        axiosInstance.get('/head/manageCritical/listSubject', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                setTopics(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const loadTimeApprove = () => {
        axiosInstance.get('/head/manageCritical/timeBrowse', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                setTimeApprove(response.data.timeBrowse || []);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleApproveSubject = (subjectId) => {
        axiosInstance.post(`/head/manageTutorial/browse-score/${subjectId}`, {}, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                toast.success("Đề tài đã được chấp nhận và chuyển đến hội đồng!");
                loadTopics(); 
            })
            .catch(error => {
                toast.error("Lỗi khi chấp nhận đề tài");
                console.error('Error approving subject:', error);
            });
    };

    const handleRefuseSubject = () => {
        axiosInstance.post(`/head/manageTutorial/refuse/${subjectIdToRefuse}`, { reason }, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                toast.success("Đề tài đã bị từ chối!");
                loadTopics();  // Reload topics after refusing
                setSubjectIdToRefuse(null);  // Reset after processing
                setReason('');  // Clear reason
            })
            .catch(error => {
                toast.error("Lỗi khi từ chối đề tài");
                console.error('Error refusing subject:', error);
            });
    };

    const columns = [
        { field: 'id', headerName: '#', width: 60 },
        { field: 'subjectName', headerName: 'Tên đề tài', width: 250 },
        { field: 'instructorName', headerName: 'GVHD', width: 200 },
        { field: 'instructorName', headerName: 'GVPB', width: 200 },
        { field: 'student1', headerName: 'SV1', width: 100 },
        { field: 'student2', headerName: 'SV2', width: 100 },
        { field: 'student3', headerName: 'SV3', width: 100 },
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
                            <button className='button-res' onClick={() => handleApproveSubject(params.row.subjectId)}>
                                <p className='text'>Duyệt</p>
                            </button>
                            <button className='button-res-de' data-bs-toggle="modal" data-bs-target="#refuseModal" onClick={() => setSubjectIdToRefuse(params.row.subjectId)}>
                                <p className='text'>Từ chối</p>
                            </button>
                        </div>
                    )}
                </>
            ),
        },
    ];

    const isWithinApprovalPeriod = () => {
        const now = new Date();
        if (currentPeriod) {
            const timeStart = convertStringToDate(currentPeriod.timeStart);
            const timeEnd = convertStringToDate(currentPeriod.timeEnd);
            return now >= timeStart && now <= timeEnd;
        }
        return false;
    };

    function convertStringToDate(dateTimeString) {
        const [datePart, timePart] = dateTimeString.split(' ');
        const [day, month, year] = datePart.split('/');
        const [hour, minute, second] = timePart.split(':');
        return new Date(year, month - 1, day, hour, minute, second);
    }

    return (
        <div className='body-table'>
            <ToastContainer />
            {isWithinApprovalPeriod() ? (
                <>
                    <button className='button-listDelete-approve' onClick={() => setShowTable(!showTable)}>
                        {showTable ? <><PlaylistAddCheckOutlinedIcon /> Danh sách đề tài chưa duyệt</> : <><PlaylistRemoveOutlinedIcon /> Danh sách đề tài đã xóa</>}
                    </button>

                    {showTable ? (
                        <div className='home-table table-approve'>
                            <DataGrid
                                rows={topicsDeleted}
                                columns={columns}
                                pageSizeOptions={[10, 25, 50]}
                                initialState={{
                                    pagination: { paginationModel: { pageSize: 10 } },
                                }}
                            />
                        </div>
                    ) : (
                        <div className='home-table table-approve'>
                            <DataGrid
                                rows={topics}
                                columns={columns}
                                pageSizeOptions={[10, 25, 50]}
                                initialState={{
                                    pagination: { paginationModel: { pageSize: 10 } },
                                }}
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className='alert-danger-approve'>
                    <p>Không nằm trong thời gian duyệt đề tài trước khi phản biện !!!</p>
                </div>
            )}

            <div>
                <div className="modal fade" id="refuseModal" tabIndex="-1" aria-labelledby="refuseModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="refuseModalLabel">Từ chối đề tài</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="refuseReason" className="form-label">Lý do từ chối</label>
                                    <input type="text" className="form-control" id="refuseReason" value={reason} onChange={(e) => setReason(e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleRefuseSubject} data-bs-dismiss="modal">Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TableApproveBeforePB;
