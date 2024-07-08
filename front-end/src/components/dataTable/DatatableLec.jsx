import React, { useState, useEffect } from 'react';
import { DataGrid, GridSaveAltIcon } from '@mui/x-data-grid';
import './DatatableLec.scss';
import { Modal, Button } from 'react-bootstrap';
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import axiosInstance from '../../API/axios';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

function DatatableLec() {
    const [lectures, setLectures] = useState([]);
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
        username: '',
        major: '',
        address: '',
        status: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [gender, setGender] = useState(false);
    const [formData, setFormData] = useState({
        personId: '',
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        birthDay: '',
        phone: '',
        address: '',
        major: '',
        author: ''
    });

    const handleChangeAdd = (e) => {
        const { name, value } = e.target;
        if (name === 'gender') {
            setFormData(prevState => ({
                ...prevState,
                [name]: value === 'Nữ'
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };


    const handleMajorChange = (e) => {
        const value = e.target.value;
        console.log("Selected major:", value); // Kiểm tra giá trị được chọn
        setUserEdit(prevState => ({
            ...prevState,
            major: value
        }));
    };

    const handleAuthorityChange = (e) => {
        const value = e.target.value;
        console.log("Selected authority:", value); // Kiểm tra giá trị được chọn
        setUserEdit(prevState => ({
            ...prevState,
            authority: value
        }));
    };

    useEffect(() => {
        console.log("Selected major:", userEdit.major);
    }, [userEdit.major]);

    useEffect(() => {
        console.log("Selected authority:", userEdit.authority);
    }, [userEdit.authority]);

    const handleSubmitAdd = (event) => {
        event.preventDefault();
        const userToken = getTokenFromUrlAndSaveToStorage();
        console.log(formData);
        axiosInstance.post('/admin/lecturer/create', formData, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            console.log('Giảng viên đã được tạo thành công:', response.data);
            loadData();
            toast.success("Thêm giảng viên thành công!");
            handleCloseModal();
        })
        .catch(error => {
            console.error(error);
            if (error.response && error.response.status === 409) {
                toast.error("Mã số giảng viên đã tồn tại");
            } else {
                toast.error("Lỗi khi thêm giảng viên");
            }
            console.log("Lỗi");
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
                    setLectures(prevState => prevState.filter(lecturer => lecturer.lecturerId !== lecturerId));
                    setShowConfirmation(false);
                    loadData();
                    toast.success("Xóa thành công!")
                } else if (response.status === 404) {
                    console.log('Sinh viên không tồn tại.');
                } else if (response.status === 403) {
                    console.log('Truy cập bị từ chối.');
                }
            })
            .catch(error => {
                console.error("Lỗi khi xóa sinh viên:", error);
                toast.error("Xóa thất bại!")
            });
    };

    const cancelDelete = () => {
        setShowConfirmation(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        console.log("userEdit:", userEdit);
    }, [userEdit]);

    const handleCloseModal = () => {
        setShowModalAdd(false);
        // Remove the modal backdrop manually
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    };

    const handleCloseModalEdit = () => {
        // Remove the modal backdrop manually
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    };

    const loadData = () => {
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
                    console.log("Authority: ", response.data.authors)
                    console.log("Data: ", response.data);
                })
                .catch(error => {
                    console.error("error: ", error);
                });
        }
    }

    const handleEdit = (id) => {
        console.log("id student", id);
        axiosInstance.get(`/admin/lecturer/${id}`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('userToken')}`,
            },
        })
            .then(response => {
                const data = response.data;
                if (data.lecturer && data.lecturer.person) {
                    const formattedDate = moment(data.lecturer.person.birthDay, "YYYY-MM-DD").format("YYYY-MM-DD");
                    data.lecturer.person.birthDay = formattedDate;
                    setUserEdit(prevState => ({
                        ...prevState,
                        personId: data.lecturer.person.personId,
                        firstName: data.lecturer.person.firstName,
                        lastName: data.lecturer.person.lastName,
                        birthDay: data.lecturer.person.birthDay,
                        phone: data.lecturer.person.phone,
                        gender: data.lecturer.person.gender,
                        authority: data.lecturer?.authors?.name,
                        username: data.lecturer.person.username,
                        major: data.lecturer.major,
                        address: data.lecturer.person.address,
                        status: data.lecturer.person.status,
                    }), () => {
                        setGender(data.lecturer.person.gender);
                        setShowModal(true);
                        setAuthors(data.lecturer.authors.name);
                        console.log("userEdit:", userEdit);
                    });
                } else {
                    console.log("Giảng viên không tồn tại.");
                }
            })
            .catch(error => {
                console.error("Lỗi khi lấy thông tin giảng viên:", error);
            });
    };

    const handleSubmitEdit = (event) => {
        event.preventDefault();
        const id = userEdit.personId; // Sử dụng thông tin từ state userEdit
        const formDataEdit = new FormData();
        formDataEdit.append('personId', userEdit.personId);
        formDataEdit.append('firstName', userEdit.firstName);
        formDataEdit.append('lastName', userEdit.lastName);
        formDataEdit.append('birthDay', userEdit.birthDay);
        formDataEdit.append('phone', userEdit.phone);
        formDataEdit.append('address', userEdit.address);
        formDataEdit.append('gender', gender);
        formDataEdit.append('authority', userEdit.authority);
        formDataEdit.append('major', userEdit.major);
        formDataEdit.append('username', userEdit.username);
        formDataEdit.append('address', userEdit.address);

        console.log(userEdit.birthDay);
        console.log("Major: ", formDataEdit);
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
                                address: userEdit.address,
                                gender: gender,
                                address: userEdit.address,
                                username: userEdit.username
                            },
                            lecture: {
                                major: userEdit.major,
                                authority: userEdit.authority
                            }
                        };
                    }
                    return lecture;
                });
                setLectures(updatedLecturer);
                setShowModal(false);
                toast.success("Chỉnh sửa thành công!")
                handleCloseModalEdit();
            })
            .catch(error => {
                console.error(error);
                toast.error("Chỉnh sửa thất bại!")
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
                            <button className="btnView" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => {handleEdit(params.row.lecturerId)}}>
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
        <div className='table-lecturer'>
            <div className='content-table'>
                <ToastContainer />
                <div className='header-table'>
                    <div className='btn-add'>
                        <button style={{ marginBottom: '10px', marginRight: '20px' }} type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#AddLecturere" onClick={() => setShowModalAdd(true)}>
                            <AddCircleOutlineOutlinedIcon/>
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
                        initialState={{
                            ...lectures.initialState,
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        pageSizeOptions={[10, 25, 50]}
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
                        initialState={{
                            ...lectures.initialState,
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        pageSizeOptions={[10, 25, 50]}
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

                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel1" aria-hidden="true" style={{ display: showModal ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-lg modal-dialog-scrollable" onSubmit={handleSubmitEdit}>
                        <form className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel1">CẬP NHẬT THÔNG TIN GIẢNG VIÊN</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor='id' className="form-label">MSGV <span className='note-required'>*</span></label>
                                    <input disabled type="text" className="form-control" id="personId" name="personId" value={userEdit.personId} onChange={handleChange} />
                                </div>
                                <div className='row mb-3'>
                                    <div className="col">
                                        <label htmlFor="firstName" className="form-label">Họ <span className='note-required'>*</span></label>
                                        <input required type="text" className="form-control" id="firstName" name="firstName" value={userEdit.firstName} onChange={handleChange} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='lastName' className="form-label">Tên <span className='note-required'>*</span></label>
                                        <input required type="text" className="form-control" id="lastName" name="lastName" value={userEdit.lastName} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor='email' className="form-label">Email <span className='note-required'>*</span></label>
                                    <input required pattern=".*@.*" type="text" className="form-control" id="username" name="username" value={userEdit.username} onChange={handleChange} />
                                </div>
                                <div className='row mb-3'>
                                    <div className="col">
                                        <label htmlFor='birthDay' className="form-label">Ngày sinh <span className='note-required'>*</span></label>
                                        <input required type="date" className="form-control" id="birthDay" name="birthDay" value={userEdit.birthDay} onChange={handleChange} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='phone' className="form-label">Số điện thoại <span className='note-required'>*</span></label>
                                        <input required pattern='\d{10}' type="text" className="form-control" id="phone" name="phone" value={userEdit.phone} onChange={handleChange} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='gender' className="form-label">Giới tính <span className='note-required'>*</span></label>
                                        <div style={{ display: "flex" }}>
                                            <div>
                                                <input required type="radio" id="nam" name="gender" value="Nam" checked={gender === false} onChange={handleGenderChange} />
                                                <label htmlFor="nam">Nam</label>
                                            </div>
                                            <div>
                                                <input required type="radio" id="nu" name="gender" value="Nữ" checked={gender === true} onChange={handleGenderChange} />
                                                <label htmlFor="nu">Nữ</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor='address' className="form-label">Địa chỉ</label>
                                    <input type="text" className="form-control" id="address" name="address" value={userEdit.address} onChange={handleChange} />
                                </div>
                                <div className='row mb-3'>
                                    <div className="col">
                                        <label htmlFor="major" className="form-label">Chuyên ngành <span className='note-required'>*</span></label>
                                        <select required className="form-select" id="major" value={userEdit.major} onChange={handleMajorChange} name="major">
                                            {major.map((majorItem, index) => (
                                                <option key={index} value={majorItem}>{majorItem}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label htmlFor="author" className="form-label">Role <span className='note-required'>*</span></label>
                                        <select required className="form-select" id="author" value={userEdit.authority} onChange={handleAuthorityChange} name="author">
                                            {author.filter(Item => Item.name === "ROLE_LECTURER" || Item.name === "ROLE_HEAD").map((Item, index) => (
                                                <option key={index} value={Item.name}>{Item.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                                <button type="submit" className="btn btn-primary">
                                    Cập nhật
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className={`modal fade ${showModalAdd ? 'show' : ''}`} id="AddLecturere" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: showModalAdd ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-lg modal-dialog-scrollable" onSubmit={handleSubmitAdd}>
                        <form className="modal-content ">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">THÊM GIẢNG VIÊN</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="id" className="form-label">MSGV <span className='note-required'>*</span></label>
                                    <input required type="text" className="form-control" id="id" name="personId" value={formData.personId} onChange={handleChangeAdd} />
                                </div>
                                <div className='row mb-3'>
                                    <div className="col">
                                        <label htmlFor="firstName" className="form-label">Họ <span className='note-required'>*</span></label>
                                        <input required type="text" className="form-control" id="firstName" name="firstName" value={formData.firstName} onChange={handleChangeAdd} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="lastName" className="form-label">Tên <span className='note-required'>*</span></label>
                                        <input required type="text" className="form-control" id="lastName" name="lastName" value={formData.lastName} onChange={handleChangeAdd} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email <span className='note-required'>*</span></label>
                                    <input required pattern=".*@.*" type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChangeAdd} />
                                    <div class="form-text"></div>
                                </div>
                                <div className='row mb-3'>
                                    <div className="col">
                                        <label htmlFor="birthDay" className="form-label">Ngày sinh <span className='note-required'>*</span></label>
                                        <input required type="date" className="form-control" id="birthDay" name="birthDay" value={formData.birthDay} onChange={handleChangeAdd} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="phone" className="form-label">Số điện thoại <span className='note-required'>*</span></label>
                                        <input required pattern="\d{10}" type="text" className="form-control" id="phone" name="phone" value={formData.phone} onChange={handleChangeAdd} />
                                        <div class="form-text">Số điện thoại gồm 10 số.</div>
                                    </div>
                                    <div className="col">
                                        <label htmlFor='genderAdd' className="form-label">Giới tính <span className='note-required'>*</span></label>
                                        <div style={{ display: 'flex' }}>
                                            <div>
                                                <input required type="radio" id="nam" name="gender" value="Nam" checked={formData.gender === false} onChange={handleChangeAdd} />
                                                <label htmlFor="nam">Nam</label>
                                            </div>
                                            <div>
                                                <input required type="radio" id="nu" name="gender" value="Nữ" checked={formData.gender === true} onChange={handleChangeAdd} />
                                                <label htmlFor="nu">Nữ</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">Địa chỉ </label>
                                    <input type="address" className="form-control" id="address" name="address" value={formData.address} onChange={handleChangeAdd} />
                                </div>
                                <div className='row mb-3'>
                                    <div className="col">
                                        <label htmlFor="major" className="form-label">Chuyên ngành <span className='note-required'>*</span></label>
                                        <select required className="form-select" id="major" value={formData.major.name} onChange={handleChangeAdd} name="major">
                                            <option value="">Chọn ...</option>
                                            {major.map((majorItem, index) => (
                                                <option key={index} value={majorItem}>{majorItem}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label htmlFor="author" className="form-label">Role <span className='note-required'>*</span></label>
                                        <select required className="form-select" id="author" value={formData.author} onChange={handleChangeAdd} name="author">
                                            <option value="">Chọn ...</option>
                                            {author.filter(Item => Item.name === "ROLE_LECTURER" || Item.name === "ROLE_HEAD").map((Item, index) => (
                                                <option key={index} value={Item.name}>{Item.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModalAdd(false)}>Hủy</button>
                                <button type="submit" className="btn btn-primary">
                                    Lưu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default DatatableLec;

