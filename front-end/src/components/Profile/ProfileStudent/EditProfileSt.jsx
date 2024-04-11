import React from 'react'
import './EditProfileSt.scss'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import { Toast } from 'react-bootstrap';
import axiosInstance from '../../../API/axios';

function EditProfileSt() {
    const [user, setUser] = useState([]);
    const [userEdit, setUserEdit] = useState({
        firstName: '',
        lastName: '',
        birthDay: '',
        phone: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [gender, setGender] = useState(false);

    const handleGenderChange = (e) => {
        const value = e.target.value === 'Nữ' ? true : false;
        setGender(value);
    };

    useEffect(() => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        console.log("Token: " + userToken);
        if (userToken) {
            // Lấy token từ storage
            const tokenSt = sessionStorage.getItem(userToken);

            if (!tokenSt) {
                axiosInstance.get('/student/home', {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                    },
                })
                    .then(response => {
                        console.log("UserStudent: ", response.data);
                        setUser(response.data);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserEdit(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleEdit = () => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        console.log("Token: " + userToken);
        if (userToken) {
            const tokenSt = sessionStorage.getItem(userToken);

            if (!tokenSt) {
                axiosInstance.get('/student/edit', {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                    },
                })
                    .then(response => {
                        console.log("EditStudent: ", response.data);
                        setUserEdit(response.data.person);
                        setShowModal(true);
                        // Cập nhật state user với dữ liệu nhận được từ server
                        setUser(response.data);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        }
    }

    const handleSubmit = () => {
        const id = user.person.personId; // Sử dụng thông tin từ state user
        const userToken = getTokenFromUrlAndSaveToStorage();
        if (userToken) {
            const tokenSt = sessionStorage.getItem(userToken);
            if (!tokenSt) {
                const formData = new FormData();
                formData.append('firstName', userEdit.firstName);
                formData.append('lastName', userEdit.lastName);
                formData.append('birthDay', userEdit.birthDay);
                formData.append('phone', userEdit.phone);
                formData.append('gender', gender);

                axiosInstance.post(`/student/edit/${id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'multipart/form-data'
                    },
                })
                    .then(response => {
                        console.log("EditStudentSuccess: ", response.data);
                        setUser(response.data);
                        setShowSuccessToast(true);
                        setShowModal(false);
                        setTimeout(() => setShowSuccessToast(false), 3000);
                    })
                    .catch(error => {
                        console.error(error);
                    })
            }
        }
    }


    return (
        <div>
            {/* Toast thông báo thành công */}
            <div className='profile'>
                <div class="container rounded bg-white mt-2 mb-5">
                    <div class="row">
                        <div class="d-flex justify-content-between align-items-center mb-3" style={{ display: 'flex' }}>
                            <h4 class="text-right">TRANG CÁ NHÂN</h4>
                            <div>
                                <Toast className='toast align-items-center' show={showSuccessToast} onClose={() => setShowSuccessToast(false)} delay={3000} autohide>
                                    <Toast.Header>
                                        <strong className="me-auto">Thông báo</strong>
                                    </Toast.Header>
                                    <Toast.Body>
                                        Cập nhật thông tin thành công!
                                    </Toast.Body>
                                </Toast>
                            </div>
                        </div>
                        <div class="col-md-3 border-right">
                            <div class="d-flex flex-column align-items-center text-center p-3 py-5"><img class="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" /><span class="font-weight-bold"></span>{user.firstName + ' ' + user.lastName}<span class="text-black-50">{user.username}</span><span> </span></div>
                        </div>
                        <div class="col-md-5 border-right">
                            <div class="p-3 py-5">
                                <div class="row mt-2">
                                    <div class="col-md-6"><label class="labels">Họ</label><p>{user.firstName}</p></div>
                                    <div class="col-md-6"><label class="labels">Tên</label><p>{user.lastName}</p></div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-6"><label class="labels">Ngày sinh</label><p>{user.birthDay}</p></div>
                                    <div class="col-md-6"><label class="labels">Giới tính</label><p>{user.gender ? 'Nữ' : 'Nam'}</p></div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-12"><label class="labels">Số điện thoại</label><p>{user.phone}</p></div>
                                    <div class="col-md-12"><label class="labels">Địa chỉ</label><p>{ }</p></div>
                                    <div class="col-md-12"><label class="labels">Email ID</label><p>{user.username}</p></div>
                                    <div class="col-md-12"><label class="labels">Education</label><p>{ }</p></div>
                                    <div class="col-md-12"><label class="labels">Ghi chú</label><p>{ }</p></div>
                                </div>
                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={handleEdit}>
                                    Cập nhật thông tin
                                </button>

                                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: showModal ? 'block' : 'none' }}>
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="exampleModalLabel">CẬP NHẬT THÔNG TIN CÁ NHÂN</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="mb-3">
                                                    <label htmlFor="firstName" className="form-label">Họ</label>
                                                    <input type="text" className="form-control" id="firstName" name="firstName" value={userEdit.firstName} onChange={handleChange} />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor='lastName' className="form-label">Tên</label>
                                                    <input type="text" className="form-control" id="lastName" name="lastName" value={userEdit.lastName} onChange={handleChange} />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor='gender' className="form-label">Giới tính</label>
                                                    <div>
                                                        <input type="radio" id="nam" name="gender" value="Nam" checked={gender === false} onChange={handleGenderChange} />
                                                        <label htmlFor="nam">Nam</label>
                                                    </div>
                                                    <div>
                                                        <input type="radio" id="nu" name="gender" value="Nữ" checked={gender === true} onChange={handleGenderChange} />
                                                        <label htmlFor="nu">Nữ</label>
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor='brithDay' className="form-label">Ngày sinh</label>
                                                    <input type="date" className="form-control" id="brithDay" name="birthDay" value={userEdit.birthDay} onChange={handleChange} />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor='phone' className="form-label">Số điện thoại</label>
                                                    <input type="text" className="form-control" id="phone" name="phone" value={userEdit.phone} onChange={handleChange} />
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Close</button>
                                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmit}>
                                                    Cập nhật
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfileSt