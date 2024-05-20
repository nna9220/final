import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import './TableApprove.scss';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import axiosInstance from '../../../API/axios';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';

function TableApproveBeforePBKL() {
    const [topics, setTopics] = useState([]);
    const [timeApprove, setTimeApprove] = useState([]);
    const [currentPeriod, setCurrentPeriod] = useState(null);
    const [topicsDeleted, setTopicsDeleted] = useState([]);
    const userToken = getTokenFromUrlAndSaveToStorage();
    const [showTable, setShowTable] = useState(false);
    const [subjectIdToRefuse, setSubjectIdToRefuse] = useState(null);
    const [reason, setReason] = useState('');

    useEffect(() => {
        console.log("Token: " + userToken);
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
            console.log("Thời gian hiện tại: ", currentDateTime);
        }
    }, [timeApprove]);

    const loadTopics = () => {
        axiosInstance.get('/head/manageCritical/graduation/listSubject', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log("TopicBeforeApprove: ", response.data);
                setTopics(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const loadTimeApprove= () => {
        axiosInstance.get('/head/manageCritical/graduation/listSubject', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                const dataTimeApproveArray = response.data.timeBrowse || [];
                setTimeApprove(dataTimeApproveArray);
                console.log('Times: ', dataTimeApproveArray);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleApproveSubject = (subjectId) => {
        axiosInstance.post(`/head/manageCritical/graduation/browse-score/${subjectId}`, {}, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log('Subject approved:', response.data);
                toast.success("Đề tài đã được chấp nhận và chuyển đến hội đồng!");
                loadTopics();  // Reload topics after approving
            })
            .catch(error => {
                console.error('Error approving subject:', error);
                toast.error("Lỗi khi chấp nhận đề tài");
            });
    };

    const handleRefuseSubject = () => {
        axiosInstance.post(`/head/manageTutorial/graduation/refuse/${subjectIdToRefuse}`, { reason }, {
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
                            <button className='button-res' onClick={() => handleApproveSubject(params.row.subjectId)}>
                                <p className='text'>Duyệt</p>
                            </button>
                            <button className='button-res-de'>
                                <p className='text'>Xóa</p>
                            </button>
                        </div>
                    )}
                </>
            ),
        },
    ];

    const isWithinApprovalPeriod = () => {
        const now = new Date();
        console.log("now", (now));
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
        // Chú ý rằng month - 1 vì tháng trong JavaScript bắt đầu từ 0
        return new Date(year, month - 1, day, hour, minute, second);
    }

    return (
        <div className='body-table'>
            <ToastContainer />
            {isWithinApprovalPeriod() ? (
                <>
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

export default TableApproveBeforePBKL