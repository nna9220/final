import React, { useState, useEffect } from 'react';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import axiosInstance from '../../../API/axios';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './criteria.scss'

function CriteriaForTL() {
    const userToken = getTokenFromUrlAndSaveToStorage();
    const [criterias, setCriterias] = useState([]);
    const [filteredCriterias, setFilteredCriterias] = useState([]);
    const [nameCriteria, setNameCriteria] = useState('');
    const [scoreCriteria, setScoreCriteria] = useState('');
    const [selectedYear, setSelectedYear] = useState('All');
    const [editCriteriaId, setEditCriteriaId] = useState(null);
    const [editNameCriteria, setEditNameCriteria] = useState('');
    const [editScoreCriteria, setEditScoreCriteria] = useState('');
    const [deleteCriteriaId, setDeleteCriteriaId] = useState(null);

    useEffect(() => {
        fetchCriterias();
    }, [userToken]);

    useEffect(() => {
        filterCriteriasByYear(selectedYear);
    }, [criterias, selectedYear]);

    const fetchCriterias = () => {
        if (userToken) {
            axiosInstance.get('/head/criteria/list', {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            })
                .then(response => {
                    setCriterias(response.data);
                    console.log("List:", response.data)
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    const filterCriteriasByYear = (year) => {
        if (year === 'All') {
            setFilteredCriterias(criterias);
        } else {
            setFilteredCriterias(criterias.filter(item => item.year === year));
        }
    };

    const handleSubmitAdd = () => {
        const scoreAsDouble = parseFloat(scoreCriteria);
        const totalScore = filteredCriterias.reduce((sum, item) => sum + item.criteriaScore, 0) + scoreAsDouble;

        if (totalScore > 10) {
            toast.error("Tổng điểm đang lớn hơn 10!");
            return;
        }

        axiosInstance.post('/head/criteria/create', null, {
            params: {
                nameCriteria: nameCriteria,
                scoreCriteria: scoreAsDouble
            },
            headers: {
                'Authorization': `Bearer ${userToken}`,
            }
        })
            .then(response => {
                toast.success('Tiêu chí đã tạo thành công');
                fetchCriterias();
            })
            .catch(error => {
                console.error("Error response:", error.response);
            });
    };

    const handleEditClick = (criteria) => {
        setEditCriteriaId(criteria.criteriaId);
        setEditNameCriteria(criteria.criteriaName);
        setEditScoreCriteria(criteria.criteriaScore);
    };

    const handleSubmitEdit = () => {
        const scoreAsDouble = parseFloat(editScoreCriteria);
        const totalScore = filteredCriterias.reduce((sum, item) => item.criteriaId === editCriteriaId ? sum : sum + item.criteriaScore, scoreAsDouble);

        if (totalScore > 10) {
            toast.error("Tổng điểm đang lớn hơn 10!");
            return;
        }

        axiosInstance.post(`/head/criteria/edit/${editCriteriaId}`, null, {
            params: {
                nameCriteria: editNameCriteria,
                scoreCriteria: scoreAsDouble
            },
            headers: {
                'Authorization': `Bearer ${userToken}`,
            }
        })
            .then(response => {
                toast.success('Tiêu chí đã chỉnh sửa thành công');
                fetchCriterias();
            })
            .catch(error => {
                console.error("Error response:", error.response);
            });
    };

    const handleDeleteClick = (id) => {
        setDeleteCriteriaId(id);
    };

    const handleSubmitDelete = () => {
        axiosInstance.post(`/head/criteria/delete/${deleteCriteriaId}`, null, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            }
        })
            .then(() => {
                toast.success('Tiêu chí đã xóa thành công');
                setCriterias(criterias.filter(item => item.id !== deleteCriteriaId));
                fetchCriterias();
            })
            .catch(error => {
                console.error("Error response:", error.response);
            });
    };

    const totalScoreForSelectedYear = filteredCriterias.reduce((sum, item) => sum + item.criteriaScore, 0);

    return (
        <div>
            <ToastContainer />

            <div className='add-criteria'>
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <AddOutlinedIcon />
                </button>

                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Thêm tiêu chí đánh giá</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="nameCriteria" className="form-label">Tiêu chí đánh giá</label>
                                    <input type="text" className="form-control" id="nameCriteria" value={nameCriteria} onChange={(e) => setNameCriteria(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="scoreCriteria" className="form-label">Điểm</label>
                                    <input type="number" className="form-control" id="scoreCriteria" min={0} step={0.25} max={10} value={scoreCriteria} onChange={(e) => setScoreCriteria(e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmitAdd}>Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='edit-criteria'>
                <div className="modal fade" id="editCriteria" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Chỉnh sửa tiêu chí đánh giá</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="editNameCriteria" className="form-label">Tiêu chí đánh giá</label>
                                    <input type="text" className="form-control" id="editNameCriteria" value={editNameCriteria} onChange={(e) => setEditNameCriteria(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="editScoreCriteria" className="form-label">Điểm</label>
                                    <input type="number" className="form-control" id="editScoreCriteria" min={0} step={0.25} max={10} value={editScoreCriteria} onChange={(e) => setEditScoreCriteria(e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmitEdit}>Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='delete-criteria'>
                <div className="modal fade" id="deleteCriteria" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Xóa tiêu chí đánh giá</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Bạn chắc chắn muốn xóa tiêu chí đánh giá này ?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmitDelete}>Xóa</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {totalScoreForSelectedYear <= 10 ? (
                    <div className="alert alert-warning" role="alert" style={{ backgroundColor: 'white', border: 'none', fontWeight: 'bolder' }}>
                        Tổng điểm các tiêu chí đang là {totalScoreForSelectedYear}
                    </div>
                ) : null}
                <div className="criteria-header d-flex justify-content-end mb-3">
                    <label htmlFor="yearSelect" className="form-label me-2">Chọn năm</label>
                    <select id="yearSelect" className="form-select form-select-sm" style={{ width: '100px' }} value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        {[...new Set(criterias.map(item => item.year))].map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tên tiêu chí</th>
                        <th scope="col">Điểm</th>
                        <th scope="col">Năm</th>
                        <th scope="col">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCriterias.map((criteria, index) => (
                        <tr key={criteria.criteriaId}>
                            <th scope="row">{index + 1}</th>
                            <td>{criteria.criteriaName}</td>
                            <td>{criteria.criteriaScore}</td>
                            <td>{criteria.year}</td>
                            <td>
                                <button type="button" className="btn btn-edit me-2" onClick={() => handleEditClick(criteria)} data-bs-toggle="modal" data-bs-target="#editCriteria">
                                    <ModeEditOutlineOutlinedIcon />
                                </button>
                                <button type="button" className="btn btn-delete" onClick={() => handleDeleteClick(criteria.criteriaId)} data-bs-toggle="modal" data-bs-target="#deleteCriteria">
                                    <DeleteOutlinedIcon />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CriteriaForTL;
