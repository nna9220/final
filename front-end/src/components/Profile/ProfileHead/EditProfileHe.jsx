import { useState, useEffect } from 'react';
import React from 'react';
import './EditProfileHe.scss';
import moment from 'moment';
import AutoFixNormalOutlinedIcon from '@mui/icons-material/AutoFixNormalOutlined';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import { Alert, Toast } from 'react-bootstrap';
import axiosInstance from '../../../API/axios';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
function EditProfileHe() {
    const [user, setUser] = useState([]);
    const [userEdit, setUserEdit] = useState({
        firstName: '',
        lastName: '',
        birthDay: '',
        phone: '',
        gender: '',
        address:'',
    });
    const [showModal, setShowModal] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorPhone, setErrorPhone] = useState('');
    const [errorFirstName, setErrorFirstName] = useState('');
    const [errorLastName, setErrorLastName] = useState('');
    const [isCancelClicked, setIsCancelClicked] = useState(false);

    const [editingMode, setEditingMode] = useState(false);

    const handleGenderChange = (e) => {
        const value = e.target.value === 'true'; // Chuyển đổi giá trị từ chuỗi sang boolean
        setUserEdit(prevState => ({
            ...prevState,
            gender: value
        }));
    };


    useEffect(() => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        console.log("Token: " + userToken);

        if (userToken) {
            // Lấy token từ storage
            const tokenSt = sessionStorage.getItem(userToken);

            if (!tokenSt) {
                axiosInstance.get('/head/home', {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                    },
                })
                    .then(response => {
                        console.log("UserHeader: ", response.data);
                        setUser(response.data);
                        setUserEdit(response.data);
                        console.log('userEdittt: ', userEdit);
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
                axiosInstance.get('/head/edit', {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                    },
                })
                    .then(response => {
                        console.log("EditHeader: ", response.data);
                        const formattedDate = moment(response.data.birthDay, "DD/MM/YYYY", true);
                        if (formattedDate.isValid()) {
                            response.data.birthDay = formattedDate.format("YYYY-MM-DD");
                            setUserEdit(prevState => ({
                                ...prevState,
                                firstName: response.data.firstName,
                                lastName: response.data.lastName,
                                birthDay: response.data.birthDay,
                                phone: response.data.phone,
                                gender: response.data.gender,
                                address: response.data.address
                            }));
                            setShowModal(true);
                            setUser(response.data);
                        } else {
                            console.error("Ngày không hợp lệ!");
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        setShowErrorToast(true);
                    });
            }
        }
    }

    const isValidPhoneNumber = (phone) => {
        return /^\d{10}$/.test(phone) && /^[0-9]*$/.test(phone);
    };

    const isValidInputFirstName = (firsName) => {
        return firsName.trim() !== '';
    }

    const isValidInputLastName = (lastName) => {
        return lastName.trim() !== '';
    }

    const handleBlur = () => {
        if (!isCancelClicked && !isValidPhoneNumber(userEdit.phone)) {
            setErrorPhone('Định dạng số điện thoại chưa đúng');
        } else {
            setErrorPhone('');
        }
    };

    const handleBlurFirstName = (e) => {
        if (!isCancelClicked && !isValidInputFirstName(e.target.value)) {
            setErrorFirstName('Không được để trống');
        } else {
            setErrorFirstName('');
        }
    };

    const handleBlurLastName = (e) => {
        if (!isCancelClicked && !isValidInputLastName(e.target.value)) {
            setErrorLastName('Không được để trống');
        } else {
            setErrorLastName('');
        }
    };

    const handleSubmit = () => {
        const id = user.personId;
        const userToken = getTokenFromUrlAndSaveToStorage();
        console.log('userEdittt2: ', userEdit);
        if (userToken) {
            const tokenSt = sessionStorage.getItem(userToken);
            if (!tokenSt) {
                if (!isValidPhoneNumber(userEdit.phone)) {
                    setErrorPhone('Định dạng số điện thoại chưa đúng');
                    return;
                }
                if (!isValidInputFirstName(userEdit.firstName)) {
                    setErrorFirstName('Vui lòng nhập họ');
                    return;
                }
                if (!isValidInputLastName(userEdit.lastName)) {
                    setErrorLastName('Vui lòng nhập tên');
                    return;
                }
                const formData = new FormData();
                formData.append('firstName', userEdit.firstName);
                formData.append('lastName', userEdit.lastName);
                formData.append('birthDay', userEdit.birthDay);
                formData.append('phone', userEdit.phone);
                formData.append('gender', userEdit.gender);
                formData.append('address', userEdit.address);

                console.log("update profile: ", formData.data);
                console.log('userEdittt3: ', userEdit);
                axiosInstance.post(`/head/edit/${id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'multipart/form-data'
                    },
                })
                    .then(response => {
                        console.log("EditHeaderSuccess: ", response.data);
                        setUser(response.data);
                        setShowSuccessToast(true);
                        setShowModal(false);
                        setTimeout(() => setShowSuccessToast(false), 3000);
                    })
                    .catch(error => {
                        console.error(error);
                        setShowErrorToast(true);
                    })
            }
        }
    }

    const handleCancel = () => {
        setUserEdit({
            firstName: user.firstName,
            lastName: user.lastName,
            birthDay: user.birthDay,
            phone: user.phone,
            gender: user.gender,
            address:user.address,
        });
        setEditingMode(false);
        setIsCancelClicked(true);
        setErrorPhone('');
        setErrorFirstName('');
        setErrorLastName('');
    };

    const handleUpdate = async () => {
        await handleSubmit();
        if (!errorFirstName && !errorLastName && !errorPhone) {
            setEditingMode(false);
        }
    };

    return (
        <div>
            <div class="container">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 class="text-right">TRANG CÁ NHÂN</h4>
                    <div>
                        <Toast className='toast align-items-center' show={showSuccessToast} onClose={() => setShowSuccessToast(false)} delay={3000} autohide>
                            <Toast.Header>
                                <strong className="me-auto">Thông báo</strong>
                            </Toast.Header>
                            <Toast.Body style={{color:'green'}}>
                                Cập nhật thông tin cá nhân thành công!
                            </Toast.Body>
                        </Toast>
                        <Toast className='toast align-items-center' show={showErrorToast} onClose={() => setShowSuccessToast(false)} delay={3000} autohide>
                            <Toast.Header>
                                <strong className="me-auto">Thông báo</strong>
                            </Toast.Header>
                            <Toast.Body style={{color:'red'}}>
                                Cập nhật thông tin cá nhân thất bại!
                            </Toast.Body>
                        </Toast>
                    </div>
                </div>
                <br />
                <div class="row gutters">
                    <div class="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                        <div class="card h-100">
                            <div class="card-body">
                                <div class="account-settings">
                                    <div class="user-profile">
                                        <div class="user-avatar">
                                            <img src="/assets/team-1.jpg" alt="Maxwell Admin" />
                                        </div>
                                        <h5 class="user-name">{user.firstName + ' ' + user.lastName}</h5>
                                        <h6 class="user-email">{user.username}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
                        <div class="card h-100">
                            <div class="card-body" onSubmit={handleSubmit}>
                                <div class="row gutters">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }} class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <h6 class="mb-2 text-primary">Thông tin cá nhân</h6>
                                        <button className='btn-edit-info' onClick={() => { setEditingMode(true); handleEdit(); }}> <AutoFixNormalOutlinedIcon /> Cập nhật thông tin cá nhân</button>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div class="form-group">
                                            <label for="firstName">Họ</label>
                                            <input type="text" class="form-control" id="firstName" name="firstName" required value={userEdit.firstName} onBlur={handleBlurFirstName} onChange={handleChange} disabled={!editingMode} />
                                            {errorFirstName && <Alert variant="danger" style={{ padding: '5px', marginTop: '5px', marginBottom: '2px', border: 'none', backgroundColor: 'white' }}><ErrorOutlineOutlinedIcon />{errorFirstName}</Alert>}
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div class="form-group">
                                            <label for="lastName">Tên</label>
                                            <input type="text" class="form-control" id="lastName" name="lastName" required value={userEdit.lastName} onBlur={handleBlurLastName} onChange={handleChange} disabled={!editingMode} />
                                            {errorLastName && <Alert variant="danger" style={{ padding: '5px', marginTop: '5px', marginBottom: '2px', border: 'none', backgroundColor: 'white' }}><ErrorOutlineOutlinedIcon />{errorLastName}</Alert>}
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div class="form-group">
                                            <label for="phone">Số điện thoại</label>
                                            <input type="tel" class="form-control" id="phone" name="phone" pattern="[0-9]{10}" onBlur={handleBlur} required value={userEdit.phone} onChange={handleChange} disabled={!editingMode} />
                                            {errorPhone && <Alert variant="danger" style={{ padding: '5px', marginTop: '5px', marginBottom: '2px', border: 'none', backgroundColor: 'white' }}><ErrorOutlineOutlinedIcon /> {errorPhone}</Alert>}
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div class="form-group">
                                            <label for="email">Email</label>
                                            <input type="email" class="form-control" id="email" name="email" value={user.username} disabled />
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div class="form-group">
                                            <label for="birthDay">Ngày sinh</label>
                                            <input type="date" class="form-control" id="birthDay" name="birthDay" value={userEdit.birthDay} onChange={handleChange} disabled={!editingMode} />
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div class="form-group">
                                            <label for="gender">Giới tính</label>
                                            <select class="form-control" id="gender" name="gender" value={userEdit.gender} onChange={handleGenderChange} disabled={!editingMode}>
                                                <option value="false">Nam</option>
                                                <option value="true">Nữ</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <div class="form-group">
                                            <label for="address">Địa chỉ</label>
                                            <input type="text" class="form-control" id="address" name="address" value={userEdit.address} onChange={handleChange} disabled={!editingMode} />
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <div class="row gutters">
                                    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <div class="text-left">
                                            {editingMode && (
                                                <>
                                                    <button type="button" id="cancel" name="cancel" class="btn btn-secondary" onClick={handleCancel} style={{ marginRight: '10px' }}>Cancel</button>
                                                    <button type="submit" id="update" name="update" class="btn btn-primary" onClick={handleUpdate}>Update</button>
                                                </>
                                            )}
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

export default EditProfileHe