import React, { useState, useEffect } from 'react';
import './DataTableRegistrationPeroidLec.scss';
import axiosInstance from '../../API/axios';

function DataTableRegistrationPeroidLec() {

    const [timeApprove, setTimeApprove] = useState([]);
    const [dataTypeSubject, setTypeSubject] = useState([]);
    const [selectedTimeId, setSelectedTimeId] = useState(null); 
    const [newTimeApprove, setNewTimeApprove] = useState({
        timeStart: '',
        timeEnd: '',
    });
    const [editedStartTime, setEditedStartTime] = useState('');
    const [editedEndTime, setEditedEndTime] = useState('');
    const [editedType, setEditedType] = useState('');


    useEffect(() => {
        const tokenSt = sessionStorage.getItem('userToken');
        console.log("Token SV2: " + tokenSt);
        if (tokenSt) {
            console.log("Test: " + tokenSt);
            axiosInstance.get('/admin/PeriodLecturer', {
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                },
            })
                .then(response => {
                    const dataTimeApproveArray = response.data.period || [];

                    setTimeApprove(dataTimeApproveArray);
                    setTypeSubject(response.data.listTypeSubject || []);

                    console.log('Times: ', dataTimeApproveArray);
                })
                .catch(error => {
                    console.error("error: ", error);
                });
        } else {
            console.log("Lỗi !!")
        }

    }, [])

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
            axiosInstance.post(`/admin/PeriodLecturer/edit/${selectedTimeId}`, {
                start: convertDateTime(editedStartTime),
                end: convertDateTime(editedEndTime),
                typeSubject: editedType

            }, {
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                    'Content-Type': 'multipart/form-data',
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
                // Cập nhật state với dữ liệu mới
                setTimeApprove(updatedTimeApprove);
            })
            .catch(error => {
                console.error("Error: ", error);
            });
        } else {
            console.log("Error: No token found or no selected period ID");
        }
    };
    

    const handleAddType = () => {
        const tokenSt = sessionStorage.getItem('userToken');
        console.log(newTimeApprove.timeStart);
        console.log(newTimeApprove.timeEnd);

        const formattedNewTimeApprove = {
            timeStart: convertDateTime(newTimeApprove.timeStart),
            timeEnd: convertDateTime(newTimeApprove.timeEnd)
        };

        console.log(formattedNewTimeApprove.timeStart);
        console.log(formattedNewTimeApprove.timeEnd);

        if (tokenSt) {
            axiosInstance.post('/admin/PeriodLecturer/create', formattedNewTimeApprove, {
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    setNewTimeApprove('');
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
        const start = convertToDateTimeLocalFormat(item.registrationTimeEnd);
        const end = convertToDateTimeLocalFormat(item.registrationTimeStart);
        setEditedStartTime(start);
        setEditedEndTime(end);
        setEditedType(item.typeSubject);

    };

    function convertToDateTimeLocalFormat(dateTimeString) {
        if (!dateTimeString) {
            return ''; // hoặc xử lý trường hợp một cách phù hợp dựa trên yêu cầu của bạn
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

        // Định dạng lại chuỗi thành "yyyy-MM-dd HH:mm:ss"
        const formattedDateTime = `${datePart} ${hour}:${minute}:00`;

        return formattedDateTime;
    }
    return (
        <div>
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#AddTimeApprove">
                Add
            </button>

            <div className="modal fade" id="AddTimeApprove" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Thêm thời gian duyệt đề tài</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
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
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleAddType}>Add</button>
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
                            <div className="mb-3">
                                <label htmlFor="class" className="form-label">loại đề tài</label>
                                <select className="form-select" id="typeSubject" name="typeSubject" defaultValue={editedType} onChange={(e) => setEditedType(e.target.value)}>
                                    {dataTypeSubject.map((typeItem, index) => (
                                        <option key={index} value={typeItem.typeId}>{typeItem.typeName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleEditTimeApprove}>Save</button>
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
                            <td>{item.registrationTimeEnd}</td>
                            <td>{item.registrationTimeStart}</td>
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
    )
}

export default DataTableRegistrationPeroidLec;