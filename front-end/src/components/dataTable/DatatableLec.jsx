import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import './DatatableLec.scss';
import { Modal, Button } from 'react-bootstrap';
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { Toast } from 'react-bootstrap';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Item from 'antd/es/list/Item';
import axiosInstance from '../../API/axios';

function DatatableLec() {
    const [lectures, setLectures] = useState([]);
    const [person, setPerson] = useState([]);
    const [author, setAuthors] = useState([]);
    const [major, setMajor] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDeletedLecturers, setShowDeleteLecturers] = useState(false);
    const [userEdit, setUserEdit] = useState({
        personId: '',
        firstName: '',
        lastName: '',
        birthDay: '',
        phone: '',
        gender: '',
        authority: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [showDeleteToast, setShowDeleteToast] = useState(false);
    const [showAddToast, setShowAddToast] = useState(false);
    const [showErrorToastAdd, setShowErrorToastAdd] = useState(false);
    const [gender, setGender] = useState(false);
    const [formData, setFormData] = useState({
        personId: '',
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        birthDay: '',
        phone: '',
        major: '',
        author: ''
    });

    const handleChangeAdd = (e) => {
        const { name, value } = e.target;
        if (name === 'gender') {
            setFormData(prevState => ({
                ...prevState,
                [name]: value === 'Nữ' // Chuyển giá trị về true nếu là "Nữ", ngược lại là false
            }));
        } else {
            // Các trường nhập liệu khác
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmitAdd = () => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        console.log(formData)
        axiosInstance.post('/admin/lecturer/create',
            formData
            , {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(response => {
                console.log('Giảng viên đã được tạo thành công:', response.data);
                setShowModalAdd(false);
                setShowAddToast(true);

            })
            .catch(error => {
                console.error(error);
                console.log("Lỗi");
                setShowErrorToastAdd(true);
            });
    };
    const handleDelete = (row) => {
        setSelectedRow(row);
        setShowConfirmation(true);
    };
    const handleRestore = (row) => {
        setSelectedRow(row);
        setShowConfirmation(true);
    };

    const confirmDelete = () => {
        const lecturerId = selectedRow.lecturerId;
        axiosInstance.post(`/admin/lecturer/delete/${lecturerId}`, {}, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('userToken')}`,
            }
        })
            .then(response => {
                if (response.status === 200) {
                    // Xóa thành công
                    setLectures(prevState => prevState.filter(lecturer => lecturer.lecturerId !== lecturerId));
                    setShowConfirmation(false);
                    setShowDeleteToast(true);
                    console.log('Xóa thành công');
                } else if (response.status === 404) {
                    console.log('Sinh viên không tồn tại.');
                } else if (response.status === 403) {
                    console.log('Truy cập bị từ chối.');
                }
            })
            .catch(error => {
                console.error("Lỗi khi xóa sinh viên:", error);
            });
    };

    const cancelDelete = () => {
        setShowConfirmation(false);
    };

    const [isDataFetched, setIsDataFetched] = useState(false);

    useEffect(() => {
        if (!isDataFetched) {
            const tokenSt = sessionStorage.getItem('userToken');
            if (tokenSt) {
                axiosInstance.get('/admin/lecturer', {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('userToken')}`,
                    },
                })
                    .then(response => {
                        const lecturerArray = response.data.listLecturer || [];
                        setLectures(lecturerArray);
                        const majorArray = response.data.major || [];
                        setMajor(majorArray);
                        const authorArray = response.data.authors || [];
                        setAuthors(authorArray);
                        console.log("Data: ", response.data);
                    })
                    .catch(error => {
                        console.error("error: ", error);
                    });
            }
        }
    }, [isDataFetched]);

    const handleEdit = (lecture) => {
        if (lecture.person && lecture.person.gender) {
            setUserEdit(lecture.person);
            setGender(lecture.person.gender);
            setShowModal(true);
            console.log(lecture.person.gender);
        } else {
            console.error("Không thể chỉnh sửa. Thông tin giới tính không tồn tại.");
        }
    };

    const handleSubmitEdit = () => {
        const id = userEdit.personId; // Sử dụng thông tin từ state userEdit
        const formDataEdit = new FormData();
        formDataEdit.append('personId', userEdit.personId);
        formDataEdit.append('firstName', userEdit.firstName);
        formDataEdit.append('lastName', userEdit.lastName);
        formDataEdit.append('birthDay', userEdit.birthDay);
        formDataEdit.append('phone', userEdit.phone);
        formDataEdit.append('gender', gender);
        formDataEdit.append('authority', userEdit.authority);

        console.log(userEdit);
        axiosInstance.post(`/admin/lecturer/edit/${id}`, formDataEdit, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('userToken')}`,
                'Content-Type': 'multipart/form-data'
            },
        })
            .then(response => {
                console.log("EditHeaderSuccess: ", response.data);
                const updatedLecturer = lectures.map(lecture => {
                    if (lecture.person.personId === id) {
                        return {
                            ...lecture,
                            person: {
                                ...lecture.person,
                                firstName: userEdit.firstName,
                                lastName: userEdit.lastName,
                                birthDay: userEdit.birthDay,
                                phone: userEdit.phone,
                                gender: gender,
                                authority: userEdit.authority,
                            }
                        };
                    }
                    return lecture;
                });
                setLectures(updatedLecturer);
                setShowSuccessToast(true);
                setShowModal(false);
            })
            .catch(error => {
                console.error(error);
                setShowErrorToast(true);
            })
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserEdit(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleGenderChange = (e) => {
        const value = e.target.value === 'Nữ' ? true : false;
        setGender(value);
    };

    const columns = [
        { field: 'lecturerId', headerName: 'MSGV', width: 100 },
        { field: 'fullName', headerName: 'Họ và tên', width: 200 },
        { field: 'gender', headerName: 'Giới tính', width: 100, valueGetter: (params) => params.row.person?.gender ? 'Nữ' : 'Nam' },
        { field: 'phone', headerName: 'Số điện thoại', width: 200 },
        { field: 'major', headerName: 'Chuyên ngành', width: 200 },
        { field: 'authority', headerName: 'Role', width: 150 },
        {
            field: 'action', headerName: 'Action', width: 200, renderCell: (params) => (
                <div>
                    {showDeletedLecturers && (
                        <button className='btnView' onClick={() => handleRestore(params.row)}>
                            <RestoreOutlinedIcon />
                        </button>
                    )}
                    {!showDeletedLecturers && (
                        <>
                            <button className="btnView" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleEdit(params.row)}>
                                <EditOutlinedIcon />
                            </button>
                            <button className='btnDelete' onClick={() => handleDelete(params.row)}>
                                <DeleteRoundedIcon />
                            </button>
                        </>
                    )}
                </div>
            )
        },
    ];


    return (
        <div>
            <div className='header-table'>
                <div className='btn-add'>
                    <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#AddLecturere" style={{ marginBottom: '20px' }}>
                        Add
                    </button>
                </div>
                <button className='button-listDelete' onClick={() => setShowDeleteLecturers(!showDeletedLecturers)}>
                    {showDeletedLecturers ? <><PlaylistAddCheckOutlinedIcon /> Dánh sách giảng viên</> : <><PlaylistRemoveOutlinedIcon /> Dánh sách giảng viên đã xóa</>}
                </button>
            </div>
            {showDeletedLecturers && (
                <DataGrid
                    rows={lectures.filter(lecture => lecture.person.status === false).map((lecture, index) => ({
                        id: index + 1,
                        lecturerId: lecture.lecturerId,
                        fullName: lecture.person.firstName + ' ' + lecture.person.lastName,
                        gender: lecture.person.gender ? 'Nữ' : 'Nam',
                        phone: lecture.person.phone,
                        major: lecture.major,
                        authority: lecture.authority.name,
                    }
                    ))}
                    columns={columns}
                    pageSizeOptions={[10, 100, { value: 1000, label: '1,000' }]}
                />
            )}

            {!showDeletedLecturers && (
                <DataGrid
                    rows={lectures.filter(lecture => lecture.person.status === true).map((lecture, index) => ({
                        id: index + 1,
                        lecturerId: lecture.lecturerId,
                        fullName: lecture.person.firstName + ' ' + lecture.person.lastName,
                        gender: lecture.person.gender ? 'Nữ' : 'Nam',
                        phone: lecture.person.phone,
                        major: lecture.major,
                        authority: lecture.authority.name,
                    }
                    ))}
                    columns={columns}
                    pageSizeOptions={[10, 100, { value: 1000, label: '1,000' }]}
                />
            )}

            <Modal show={showConfirmation} onHide={cancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa giảng viên</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa giảng viên này không?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cancelDelete}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={confirmDelete}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>

            <Toast show={showSuccessToast} onClose={() => setShowSuccessToast(false)} delay={3000} autohide style={{ position: 'fixed', top: '80px', right: '10px' }}>
                <Toast.Header>
                    <strong className="me-auto">Thông báo</strong>
                </Toast.Header>
                <Toast.Body>
                    <DoneOutlinedIcon /> Cập nhật thông tin thành công!
                </Toast.Body>
            </Toast>

            <Toast show={showDeleteToast} onClose={() => setShowDeleteToast(false)} delay={3000} autohide style={{ position: 'fixed', top: '80px', right: '10px' }}>
                <Toast.Header>
                    <strong className="me-auto">Thông báo</strong>
                </Toast.Header>
                <Toast.Body>
                    <DoneOutlinedIcon /> Xóa giảng viên thành công!
                </Toast.Body>
            </Toast>

            <Toast show={showErrorToast} onClose={() => setShowErrorToast(false)} delay={3000} autohide style={{ position: 'fixed', top: '80px', right: '10px' }}>
                <Toast.Header>
                    <strong className="me-auto" style={{ color: 'red' }}><ErrorOutlineOutlinedIcon /> Lỗi</strong>
                </Toast.Header>
                <Toast.Body>
                    Đã xảy ra lỗi khi cập nhật thông tin!
                </Toast.Body>
            </Toast>

            <Toast show={showAddToast} onClose={() => setShowAddToast(false)} delay={3000} autohide style={{ position: 'fixed', top: '80px', right: '10px' }}>
                <Toast.Header>
                    <strong className="me-auto">Thông báo</strong>
                </Toast.Header>
                <Toast.Body>
                    <DoneOutlinedIcon /> Thêm giảng viên thành công!
                </Toast.Body>
            </Toast>

            <Toast show={showErrorToastAdd} onClose={() => setShowErrorToastAdd(false)} delay={3000} autohide style={{ position: 'fixed', top: '80px', right: '10px' }}>
                <Toast.Header>
                    <strong className="me-auto" style={{ color: 'red' }}><ErrorOutlineOutlinedIcon /> Lỗi</strong>
                </Toast.Header>
                <Toast.Body>
                    Thêm giảng viên không thành công!
                </Toast.Body>
            </Toast>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel1" aria-hidden="true" style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel1">CẬP NHẬT THÔNG TIN GIẢNG VIÊN</h1>
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
                                <label htmlFor="authority" className="form-label">Role</label>
                                <select className="form-select" id="authority" value={userEdit.authority} onChange={handleChange} name="authority">
                                    {author && author.filter(Item => Item.name === 'ROLE_HEAD' || Item.name === 'ROLE_LECTURER').map((Item, index) => (
                                        <option key={index} value={Item.name}>{Item.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor='phone' className="form-label">Số điện thoại</label>
                                <input type="text" className="form-control" id="phone" name="phone" value={userEdit.phone} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmitEdit}>
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="AddLecturere" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: showModalAdd ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">THÊM GIẢNG VIÊN</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="id" className="form-label">MSSV</label>
                                <input type="text" className="form-control" id="id" name="personId" value={formData.personId} onChange={handleChangeAdd} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label">Họ</label>
                                <input type="text" className="form-control" id="firstName" name="firstName" value={formData.firstName} onChange={handleChangeAdd} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label">Tên</label>
                                <input type="text" className="form-control" id="lastName" name="lastName" value={formData.lastName} onChange={handleChangeAdd} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChangeAdd} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">Số điện thoại</label>
                                <input type="text" className="form-control" id="phone" name="phone" value={formData.phone} onChange={handleChangeAdd} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor='genderAdd' className="form-label">Giới tính</label>
                                <div>
                                    <input type="radio" id="nam" name="gender" value="Nam" checked={formData.gender === false} onChange={handleChangeAdd} />
                                    <label htmlFor="nam">Nam</label>
                                </div>
                                <div>
                                    <input type="radio" id="nu" name="gender" value="Nữ" checked={formData.gender === true} onChange={handleChangeAdd} />
                                    <label htmlFor="nu">Nữ</label>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="birthDay" className="form-label">Ngày sinh</label>
                                <input type="text" className="form-control" id="birthDay" name="birthDay" value={formData.birthDay} onChange={handleChangeAdd} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="major" className="form-label">Chuyên ngành</label>
                                <select className="form-select" id="major" value={formData.major.name} onChange={handleChangeAdd} name="major">
                                    {major.map((majorItem, index) => (
                                        <option key={index} value={majorItem}>{majorItem}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="author" className="form-label">Role</label>
                                <select className="form-select" id="author" value={formData.author} onChange={handleChangeAdd} name="author">
                                    {author.filter(Item => Item.name === "ROLE_LECTURER" || Item.name === "ROLE_HEAD").map((Item, index) => (
                                        <option key={index} value={Item.name}>{Item.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModalAdd(false)}>Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmitAdd}>
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default DatatableLec;
