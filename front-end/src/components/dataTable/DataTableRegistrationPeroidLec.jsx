import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DataTableRegistrationPeroidLec.scss';
import axiosInstance from '../../API/axios';

function DataTableRegistrationPeroidLec() {
    const [dataRegis, setDataRegis] = useState([]);
    const [dataTypeSubject, setTypeSubject] = useState([]);
    const [editedStartTime, setEditedStartTime] = useState('');
    const [editedEndTime, setEditedEndTime] = useState('');
    const [editedType, setEditedType] = useState('');
    const [selectedPeriodId, setSelectedPeriodId] = useState(null); // Lưu ID của đợt đăng ký đang được chỉnh sửa

    useEffect(() => {
        const tokenSt = sessionStorage.getItem('userToken');
        if (tokenSt) {
            axiosInstance.get('/admin/PeriodLecturer', {
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                },
            })
                .then(response => {
                    setDataRegis(response.data.period || []);
                    setTypeSubject(response.data.listTypeSubject || []);
                    console.log("TypeSubject: ", response.data.listTypeSubject);
                })
                .catch(error => {
                    console.error("error: ", error);
                });
        } else {
            console.log("Lỗi !!")
        }
    }, []);

    const handleEdit = (item) => {
        setSelectedPeriodId(item.periodId);
        setEditedStartTime(item.registrationTimeStart);
        setEditedEndTime(item.registrationTimeEnd);
        setEditedType(item.typeSubject);
    };

    const convertToFormattedDateTime = (dateTimeString) => {
        const dateTime = new Date(dateTimeString);
        const year = dateTime.getFullYear();
        const month = String(dateTime.getMonth() + 1).padStart(2, '0');
        const day = String(dateTime.getDate()).padStart(2, '0');
        const hours = String(dateTime.getHours()).padStart(2, '0');
        const minutes = String(dateTime.getMinutes()).padStart(2, '0');
        const seconds = String(dateTime.getSeconds()).padStart(2, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    

    const handleSaveChanges = () => {
        const tokenSt = sessionStorage.getItem('userToken');
        const updatedStartValue = convertToFormattedDateTime(document.getElementById('start').value);
        const updatedEndValue = convertToFormattedDateTime(document.getElementById('end').value);
        const updateTypeValue = document.getElementById('typeSubject').value;
        // Sử dụng editedEndTime thay vì lấy giá trị từ document.getElementById('end').value
        

        console.log("Start: ", updatedStartValue);
        console.log("End: ", updatedEndValue);
        if (tokenSt && selectedPeriodId) {
            axiosInstance.post(`/admin/PeriodLecturer/edit/${selectedPeriodId}`, null, {
                params: {
                    periodId: selectedPeriodId,
                    start: updatedStartValue,
                    end: updatedEndValue,
                    typeSubject:updateTypeValue
                },
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                },
            })
                .then(response => {
                    // Cập nhật lại state hoặc thực hiện các thao tác cần thiết sau khi cập nhật thành công
                    console.log("Chỉnh sửa thành công: ", response.data);
                    // Đóng modal chỉnh sửa
                    document.getElementById("exampleModal").classList.remove('show');
                })
                .catch(error => {
                    console.error("error: ", error);
                    console.log("Lỗi");
                });
        }
    };
    return (
        <div>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">CHỈNH SỬA THỜI GIAN</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="startTime" className="form-label">Thời gian bắt đầu: </label>
                                <input type="datetime-local" className="form-control" id="start" value={editedStartTime} onChange={(e) => setEditedStartTime(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="endTime" className="form-label">Thời gian kết thúc: </label>
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
                            <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>Save </button>
                        </div>
                    </div>
                </div>
            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Đợt đăng ký đề tài</th>
                        <th scope="col">Thời gian bắt đầu</th>
                        <th scope="col">Thời gian kết thúc</th>
                        <th scope="col">Loại đề tài</th>
                        <th scope='col'> Action</th>
                    </tr>
                </thead>
                <tbody>
                    {dataRegis.map((item, index) => (
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
    )
}

export default DataTableRegistrationPeroidLec;
