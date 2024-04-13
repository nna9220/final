import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DataTableRegistrationPeroidLec.scss';
import axiosInstance from '../../API/axios';

function DataTableRegistrationPeroidLec() {
    const [dataRegis, setDataRegis] = useState([]);
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
                    console.log("RegisterPeriod: ", response.data.period)
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
    

    const handleSaveChanges = () => {
        const tokenSt = sessionStorage.getItem('userToken');
        const updatedStartValue = document.getElementById('start').value;
        const updatedEndValue = document.getElementById('end').value;

        console.log("Type of updatedStartValue:", typeof updatedStartValue);

        if (tokenSt && selectedPeriodId) {
            console.log("Data: ", updatedEndValue,updatedStartValue);
            axiosInstance.post(`/admin/PeriodLecturer/edit/${selectedPeriodId}`,{
                params:{
                periodId: selectedPeriodId,
                start: updatedStartValue,
                end: updatedEndValue,}
            }, {
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
                                <input type="text" className="form-control" id="start" value={editedStartTime} onChange={(e) => setEditedStartTime(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="endTime" className="form-label">Thời gian kết thúc: </label>
                                <input type="text" className="form-control" id="end" value={editedEndTime} onChange={(e) => setEditedEndTime(e.target.value)} />
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
                        <th scope="col">loại đề tài</th>
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
                            <td>{item.typeSubject}</td>
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
