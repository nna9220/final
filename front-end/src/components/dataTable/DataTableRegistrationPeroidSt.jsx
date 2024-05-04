import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import './DataTableRegistrationPeroidSt.scss'
import axiosInstance from '../../API/axios';

function DataTableRegistrationPeroidSt() {
    const [dataRegis, setDataRegis] = useState([])
    const [editedStartTime, setEditedStartTime] = useState('');
    const [editedEndTime, setEditedEndTime] = useState('');
    const [selectedPeriodId, setSelectedPeriodId] = useState(null);

    useEffect(() => {
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
                    console.log("DataTable: ", response.data);
                    const dataRegisArray = response.data.period || [];
                    setDataRegis(dataRegisArray);
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
        if (tokenSt && selectedPeriodId) {
            axiosInstance.post(`/admin/PeriodLecturer/edit/${selectedPeriodId}`, null, {
                params: {
                    periodId: selectedPeriodId,
                    start: updatedStartValue,
                    end: updatedEndValue,
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
                                <input type="text" className="form-control" id="startTime" value={editedStartTime} onChange={(e) => setEditedStartTime(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="endTime" className="form-label">Thời gian kết thúc: </label>
                                <input type="text" className="form-control" id="endTime" value={editedEndTime} onChange={(e) => setEditedEndTime(e.target.value)} />
                            </div>
                            
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>Save </button>
                        </div>
                    </div>
                </div>
            </div>
            <table class="table table-hover">
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

export default DataTableRegistrationPeroidSt