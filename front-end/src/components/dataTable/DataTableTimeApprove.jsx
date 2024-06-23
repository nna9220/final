import React, { useState, useEffect } from 'react';
import './DataTableRegistrationPeroidLec.scss';
import axiosInstance from '../../API/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DataTableTimeApprove.scss'

function DataTableTimeApprove() {
    const [timeApprove, setTimeApprove] = useState([]);
    const [selectedTimeId, setSelectedTimeId] = useState(null);
    const [newTimeApprove, setNewTimeApprove] = useState({
        timeStart: '',
        timeEnd: ''
    });
    const [editedStartTime, setEditedStartTime] = useState('');
    const [editedEndTime, setEditedEndTime] = useState('');

    const loadData = () => {
        const tokenSt = sessionStorage.getItem('userToken');
        if (tokenSt) {
            axiosInstance.get('/admin/timeBrowse', {
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                },
            })
                .then(response => {
                    const dataTimeApproveArray = response.data.timeBrowse || [];
                    setTimeApprove(dataTimeApproveArray);
                })
                .catch(error => {
                    console.error("error: ", error);
                });
        } else {
            console.log("Lỗi !!")
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTimeApprove(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEditTimeApprove = () => {
        const tokenSt = sessionStorage.getItem('userToken');
        if (tokenSt && selectedTimeId) {
            axiosInstance.post(`/admin/timeBrowse/edit/${selectedTimeId}`, {
                start: convertDateTime(editedStartTime),
                end: convertDateTime(editedEndTime)
            }, {
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
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
                    toast.success("Chỉnh sửa thành công!");
                })
                .catch(error => {
                    console.error("Error: ", error);
                    toast.error("Chỉnh sửa thất bại!");
                });
        } else {
            console.log("Error: No token found or no selected period ID");
        }
    };

    const handleAddType = (event) => {
        event.preventDefault();
        const tokenSt = sessionStorage.getItem('userToken');

        const formattedNewTimeApprove = {
            timeStart: convertDateTime(newTimeApprove.timeStart),
            timeEnd: convertDateTime(newTimeApprove.timeEnd)
        };

        if (tokenSt) {
            axiosInstance.post('/admin/timeBrowse/create', formattedNewTimeApprove, {
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    setNewTimeApprove({ timeStart: '', timeEnd: '' });
                    toast.success("Thêm thành công!");
                    // Đóng modal
                    const closeModalButton = document.querySelector('#AddTimeApprove .btn-close');
                    if (closeModalButton) {
                        closeModalButton.click();
                    }
                    // Tải lại dữ liệu
                    loadData();
                })
                .catch(error => {
                    console.error("Error: ", error);
                    toast.error("Thêm thất bại!");
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
        const [date, time] = dateTimeString.split(' ');
        const [day, month, year] = date.split('/');
        const [hours, minutes, seconds] = time.split(':');
        const isoDateTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
        return isoDateTimeString;
    }

    function convertDateTime(dateTimeString) {
        const parts = dateTimeString.split('T');
        const datePart = parts[0]; // Ngày/tháng/năm
        const timePart = parts[1]; // Giờ/phút

        const timeParts = timePart.split(':');
        const hour = timeParts[0]; // Giờ
        const minute = timeParts[1]; // Phút

        const formattedDateTime = `${datePart} ${hour}:${minute}:00`;

        return formattedDateTime;
    }

    return (
        <div className='table-timeApprove'>
            <ToastContainer />
            <div className='content-table'>
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#AddTimeApprove">
                    Add
                </button>
                <div className="modal fade" id="AddTimeApprove" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" onSubmit={handleAddType}>
                    <div className="modal-dialog">
                        <form className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Thêm thời gian duyệt đề tài</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-floating mb-3 mt-3">
                                    <input required type="datetime-local" className="form-control" id="timeStart" placeholder="Enter email" name="timeStart" onChange={handleChange} />
                                    <label htmlFor="timeStart">Thời gian bắt đầu</label>
                                </div>
                                <div className="form-floating mb-3 mt-3">
                                    <input required type="datetime-local" className="form-control" id="timeEnd" placeholder="Enter email" name="timeEnd" onChange={handleChange} />
                                    <label htmlFor="timeStart">Thời gian kết thúc</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Add</button>
                            </div>
                        </form>
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
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Thời gian bắt đầu</th>
                            <th scope="col">Thời gian kết thúc</th>
                            <th scope="col">Loại đề tài</th>
                            <th scope='col'>Action</th>
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

export default DataTableTimeApprove;
