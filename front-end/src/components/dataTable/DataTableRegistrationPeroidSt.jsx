import React from 'react'
import { useState, useEffect } from 'react';
import './DataTableRegistrationPeroidSt.scss'
import axiosInstance from '../../API/axios';

function DataTableRegistrationPeroidSt() {
    const [timeApprove, setTimeApprove] = useState([]);
    const [timeApprove2, setTimeApprove2] = useState([]);
    const [selectedTimeId, setSelectedTimeId] = useState(null);
    const [newTimeApprove, setNewTimeApprove] = useState({
        periodName: '',
        timeStart: '',
        timeEnd: ''
    });
    const [editedStartTime, setEditedStartTime] = useState('');
    const [editedEndTime, setEditedEndTime] = useState('');

    useEffect(() => {
        loadData();
        loadData2();
    }, [])

    const loadData = () => {
        const tokenSt = sessionStorage.getItem('userToken');
        console.log("Token SV2: " + tokenSt);
        if (tokenSt) {
            console.log("Test: " + tokenSt);
            axiosInstance.get('/admin/Period', {
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                },
            })
                .then(response => {
                    const dataTimeApproveArray = response.data.period || [];
                    setTimeApprove(dataTimeApproveArray);
                    console.log('Times: ', dataTimeApproveArray);
                })
                .catch(error => {
                    console.error("error: ", error);
                });
        } else {
            console.log("Lỗi !!")
        }
    }

    const loadData2 = () => {
        const tokenSt = sessionStorage.getItem('userToken');
        console.log("Token SV2: " + tokenSt);
        if (tokenSt) {
            console.log("Test: " + tokenSt);
            axiosInstance.get('/admin/PeriodGraduation', {
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                },
            })
                .then(response => {
                    const dataTimeApproveArray = response.data.period || [];
                    setTimeApprove2(dataTimeApproveArray);
                    console.log('Times: ', dataTimeApproveArray);
                })
                .catch(error => {
                    console.error("error: ", error);
                });
        } else {
            console.log("Lỗi !!")
        }
    }
 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTimeApprove(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleEditTimeApprove = () => {
        const tokenSt = sessionStorage.getItem('userToken');
        if (tokenSt && selectedTimeId) {
            axiosInstance.post(`/admin/Period/edit/${selectedTimeId}`, null, {
                params: {
                    start: convertDateTime(editedStartTime),
                    end: convertDateTime(editedEndTime)
                },
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                },
            })
                .then(response => {
                    console.log("Edit successful");
                    const updatedTimeApprove = timeApprove.map(item => {
                        if (item.timeId === selectedTimeId) {
                            return {
                                ...item,
                                timeStart: editedStartTime,
                                timeEnd: editedEndTime
                            };
                        }
                        return item;
                    });
                    setTimeApprove(updatedTimeApprove);
                    loadData();
                })
                .catch(error => {
                    console.error("Error: ", error);
                });
        } else {
            console.log("Error: No token found or no selected period ID");
        }
    };

    const handleEditTimeApprove2 = () => {
        const tokenSt = sessionStorage.getItem('userToken');
        if (tokenSt && selectedTimeId) {
            axiosInstance.post(`/admin/PeriodGraduation/edit/${selectedTimeId}`, null, {
                params: {
                    start: convertDateTime(editedStartTime),
                    end: convertDateTime(editedEndTime)
                },
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                },
            })
                .then(response => {
                    console.log("Edit successful");
                    const updatedTimeApprove = timeApprove.map(item => {
                        if (item.timeId === selectedTimeId) {
                            return {
                                ...item,
                                timeStart: editedStartTime,
                                timeEnd: editedEndTime
                            };
                        }
                        return item;
                    });
                    setTimeApprove2(updatedTimeApprove);
                    loadData2();
                })
                .catch(error => {
                    console.error("Error: ", error);
                });
        } else {
            console.log("Error: No token found or no selected period ID");
        }
    };


    const handleAddPeroid = () => {
        const tokenSt = sessionStorage.getItem('userToken');
        console.log(newTimeApprove.periodName);
        console.log(newTimeApprove.timeStart);
        console.log(newTimeApprove.timeEnd);

        const formattedNewTimeApprove = {
            periodName: newTimeApprove.periodName,
            timeStart: convertDateTime(newTimeApprove.timeStart),
            timeEnd: convertDateTime(newTimeApprove.timeEnd)
        };

        console.log(formattedNewTimeApprove.timeStart);
        console.log(formattedNewTimeApprove.timeEnd);
        console.log("Data: ", formattedNewTimeApprove);

        if (tokenSt) {
            axiosInstance.post('/admin/Period/create', formattedNewTimeApprove, {
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    setNewTimeApprove('');
                    loadData();
                })
                .catch(error => {
                    console.error("Error: ", error);
                });
        } else {
            console.log("Error: No token found");
        }
    };

    const handleAddPeroid2 = () => {
        const tokenSt = sessionStorage.getItem('userToken');
        console.log(newTimeApprove.periodName);
        console.log(newTimeApprove.timeStart);
        console.log(newTimeApprove.timeEnd);

        const formattedNewTimeApprove = {
            periodName: newTimeApprove.periodName,
            timeStart: convertDateTime(newTimeApprove.timeStart),
            timeEnd: convertDateTime(newTimeApprove.timeEnd)
        };

        console.log(formattedNewTimeApprove.timeStart);
        console.log(formattedNewTimeApprove.timeEnd);
        console.log("Data: ", formattedNewTimeApprove);

        if (tokenSt) {
            axiosInstance.post('/admin/PeriodGraduation/create', formattedNewTimeApprove, {
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    setNewTimeApprove('');
                    loadData2();
                })
                .catch(error => {
                    console.error("Error: ", error);
                });
        } else {
            console.log("Error: No token found");
        }
    };

    const handleEdit = (item) => {
        setSelectedTimeId(item.periodId);
        const start = convertToDateTimeLocalFormat(item.registrationTimeStart);
        const end = convertToDateTimeLocalFormat(item.registrationTimeEnd);
        setEditedStartTime(start);
        setEditedEndTime(end);
    };

    function convertToDateTimeLocalFormat(dateTimeString) {
        if (!dateTimeString) {
            return '';
        }

        const date = new Date(dateTimeString);
        const isoDateTimeString = date.toISOString().slice(0, 16);
        return isoDateTimeString;
    }



    function convertDateTime(dateTimeString) {
        const parts = dateTimeString.split('T');
        const datePart = parts[0];
        const timePart = parts[1];

        const timeParts = timePart.split(':');
        const hour = timeParts[0]; // Giờ
        const minute = timeParts[1]; // Phút

        const formattedDateTime = `${datePart} ${hour}:${minute}:00`;

        return formattedDateTime;
    }
    
    return (
        <div>
            <div className='border-container'>
                <div className='body-table-period'>
                    <div style={{ display: 'flex' }}>
                        <div>

                        </div>
                    </div>

                    <div className="modal fade" id="AddTimeApprove" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Thêm thời đợt đăng ký đề tài</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-floating mb-3 mt-3">
                                        <input type="text" className="form-control" id="periodName" placeholder="Enter email" name="periodName" onChange={handleChange} />
                                        <label for="periodName">Tên đợt</label>
                                    </div>
                                    <div className="form-floating mb-3 mt-3">
                                        <input type="datetime-local" className="form-control" id="timeStart" placeholder="Enter email" name="timeStart" onChange={handleChange} />
                                        <label for="timeStart">Thời gian bắt đầu</label>
                                    </div>
                                    <div className="form-floating mb-3 mt-3">
                                        <input type="datetime-local" className="form-control" id="timeEnd" placeholder="Enter email" name="timeEnd" onChange={handleChange} />
                                        <label for="timeStart">Thời gian kết thúc</label>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleAddPeroid}>Add</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">CHỈNH SỬA THỜI GIAN</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="start" className="form-label">Thời gian bắt đầu: </label>
                                        <input type="datetime-local" className="form-control" id="start" value={editedStartTime} onChange={(e) => setEditedStartTime(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="end" className="form-label">Thời gian kết thúc: </label>
                                        <input type="datetime-local" className="form-control" id="end" value={editedEndTime} onChange={(e) => setEditedEndTime(e.target.value)} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleEditTimeApprove}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Đợt đăng ký</th>
                                <th scope="col">Thời gian bắt đầu</th>
                                <th scope="col">Thời gian kết thúc</th>
                                <th scope="col">Loại đề tài</th>
                                <th scope='col'> Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timeApprove.map((item, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{item.registrationName}</td>
                                    <td>{item.registrationTimeStart}</td>
                                    <td>{item.registrationTimeEnd}</td>
                                    <td>{item.typeSubjectId.typeName}</td>
                                    <td>
                                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleEdit(item)}>
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/*Khóa luận tốt nghiệp*/}
            <div className='border-container-2'>
                <div className='body-table-period'>
                    <div style={{ display: 'flex' }}>
                    
                        <div>

                        </div>
                    </div>

                    <div className="modal fade" id="AddTimeApprove2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Thêm thời đợt đăng ký đề tài</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-floating mb-3 mt-3">
                                        <input type="text" className="form-control" id="periodName" placeholder="Enter email" name="periodName" onChange={handleChange} />
                                        <label for="periodName">Tên đợt</label>
                                    </div>
                                    <div className="form-floating mb-3 mt-3">
                                        <input type="datetime-local" className="form-control" id="timeStart" placeholder="Enter email" name="timeStart" onChange={handleChange} />
                                        <label for="timeStart">Thời gian bắt đầu</label>
                                    </div>
                                    <div className="form-floating mb-3 mt-3">
                                        <input type="datetime-local" className="form-control" id="timeEnd" placeholder="Enter email" name="timeEnd" onChange={handleChange} />
                                        <label for="timeStart">Thời gian kết thúc</label>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleAddPeroid2}>Add</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="edit2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">CHỈNH SỬA THỜI GIAN</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="start" className="form-label">Thời gian bắt đầu: </label>
                                        <input type="datetime-local" className="form-control" id="start" value={editedStartTime} onChange={(e) => setEditedStartTime(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="end" className="form-label">Thời gian kết thúc: </label>
                                        <input type="datetime-local" className="form-control" id="end" value={editedEndTime} onChange={(e) => setEditedEndTime(e.target.value)} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleEditTimeApprove2}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Đợt đăng ký</th>
                                <th scope="col">Thời gian bắt đầu</th>
                                <th scope="col">Thời gian kết thúc</th>
                                <th scope="col">Loại đề tài</th>
                                <th scope='col'> Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timeApprove2.map((item, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{item.registrationName}</td>
                                    <td>{item.registrationTimeStart}</td>
                                    <td>{item.registrationTimeEnd}</td>
                                    <td>{item.typeSubjectId.typeName}</td>
                                    <td>
                                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#edit2" onClick={() => handleEdit(item)}>
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DataTableRegistrationPeroidSt