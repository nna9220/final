import React, { useState, useEffect } from 'react';
import './DataTableRegistrationPeroidLec.scss';
import axiosInstance from '../../API/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DataTableTimeApprove.scss'


function DataTableTimeApproveKL() {
    const [timeApprove, setTimeApprove] = useState([]);
    const [selectedTimeId, setSelectedTimeId] = useState(null);
    const [newTimeApprove, setNewTimeApprove] = useState({
        timeStart: '',
        timeEnd: ''
    });
    const [editedStartTime, setEditedStartTime] = useState('');
    const [editedEndTime, setEditedEndTime] = useState('');

    useEffect(() => {
        const tokenSt = sessionStorage.getItem('userToken');
        console.log("Token SV2: " + tokenSt);
        if (tokenSt) {
            console.log("Test: " + tokenSt);
            axiosInstance.get('/admin/graduation/timeBrowse', {
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                },
            })
                .then(response => {
                    const dataTimeApproveArray = response.data.timeBrowse || [];
                    setTimeApprove(dataTimeApproveArray);
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
            axiosInstance.post(`/admin/graduation/timeBrowse/edit/${selectedTimeId}`, {
                start: convertDateTime(editedStartTime),
                end: convertDateTime(editedEndTime)
            }, {
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    console.log("Edit successful");
                    // Tìm và cập nhật chỉ mục của phần tử được chỉnh sửa trong mảng state
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
                    toast.success("Chỉnh sửa thành công!")
                })
                .catch(error => {
                    console.error("Error: ", error);
                    toast.error("Chỉnh sửa thất bại!")
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
            axiosInstance.post('/admin/graduation/timeBrowse/create', formattedNewTimeApprove, {
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    setNewTimeApprove('');
                    console.log('Thêm thành công');
                })
                .catch(error => {
                    console.error("Error: ", error);
                });
        } else {
            console.log("Error: No token found");
        }
    };

    const handleEdit = (item) => {
        setSelectedTimeId(item.timeId);
        const start = convertToDateTimeLocalFormat(item.timeStart);
        const end = convertToDateTimeLocalFormat(item.timeEnd);
        setEditedStartTime(start);
        setEditedEndTime(end);
    };

    function convertToDateTimeLocalFormat(dateTimeString) {
        // Chuyển đổi từ "DD/MM/YYYY HH:MM:SS" sang "YYYY-MM-DDTHH:MM"
        const [date, time] = dateTimeString.split(' ');
        const [day, month, year] = date.split('/');
        const [hours, minutes, seconds] = time.split(':');
        const isoDateTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
        return isoDateTimeString;
    }

    function convertDateTime(dateTimeString) {
        // Phân tích chuỗi thành các phần riêng biệt
        const parts = dateTimeString.split('T');
        const datePart = parts[0]; // Ngày/tháng/năm
        const timePart = parts[1]; // Giờ/phút

        // Phân tích phần thời gian thành giờ và phút
        const timeParts = timePart.split(':');
        const hour = timeParts[0]; // Giờ
        const minute = timeParts[1]; // Phút

        // Định dạng lại chuỗi thành "yyyy-MM-dd HH:mm:ss"
        const formattedDateTime = `${datePart} ${hour}:${minute}:00`;

        return formattedDateTime;
    }
    return (
        <div className='table-timeApprove'>
            <ToastContainer />
            <div className='content-table'>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#AddTimeApprove">
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
                                <td>{item.timeStart}</td>
                                <td>{item.timeEnd}</td>
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
    )
}

export default DataTableTimeApproveKL