import React, { useState, useEffect } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import axiosInstance from '../../../API/axios';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
function CriteriaForTL() {
    const userToken = getTokenFromUrlAndSaveToStorage();
    const [criterias, setCriterias] = useState([]);
    const [nameCriteria, setNameCriteria] = useState('');
    const [scoreCriteria, setScoreCriteria] = useState('');

    const [editCriteriaId, setEditCriteriaId] = useState(null);
    const [editNameCriteria, setEditNameCriteria] = useState('');
    const [editScoreCriteria, setEditScoreCriteria] = useState('');
    const [deleteCriteriaId, setDeleteCriteriaId] = useState(null);


    useEffect(() => {
        fetchCriterias();
    }, [userToken]);

    const fetchCriterias = () => {
        console.log("Token: " + userToken);
        if (userToken) {
            axiosInstance.get('/head/criteria/list', {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            })
                .then(response => {
                    console.log("Criterias: ", response.data);
                    setCriterias(response.data);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };


    const handleSubmitAdd = () => {
        const scoreAsDouble = parseFloat(scoreCriteria);
        console.log("Submitting new criteria:");
        console.log("nameCriteria:", nameCriteria);
        console.log("scoreCriteria:", scoreAsDouble);

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
                console.log('Tiêu chí đã tạo thành công:', response.data);
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
        console.log("edit name: ", editNameCriteria);
        console.log("edit id: ", editCriteriaId);

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
                console.log('Tiêu chí đã edit thành công:', response.data);
                setCriterias(criterias.map(item =>
                    item.id === editCriteriaId ? response.data : item
                ));
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
                console.log('Tiêu chí đã xóa thành công');
                setCriterias(criterias.filter(item => item.id !== deleteCriteriaId));
                fetchCriterias();

            })
            .catch(error => {
                console.error("Error response:", error.response);
            });
    };

    return (
        <div>
            <div className='add-criteria'>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <AddOutlinedIcon/>
                </button>

                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">Thêm tiêu chí đánh giá</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="nameCriteria" className="form-label">Tiêu chí đánh giá</label>
                                    <input type="text" className="form-control" id="nameCriteria" value={nameCriteria} onChange={(e) => setNameCriteria(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="scoreCriteria" className="form-label">Điểm</label>
                                    <input type="number" className="form-control" id="scoreCriteria" min={0} step={0.25} max={10} value={scoreCriteria} onChange={(e) => setScoreCriteria(e.target.value)} />
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmitAdd}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='edit-criteria'>
                <div class="modal fade" id="editCriteria" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">Chỉnh sửa tiêu chí đánh giá</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="exampleFormControlInput1" class="form-label">Tiêu chí đánh giá</label>
                                    <input type="text" className="form-control" id="editNameCriteria" value={editNameCriteria} onChange={(e) => setEditNameCriteria(e.target.value)} />
                                </div><div class="mb-3">
                                    <label for="exampleFormControlInput1" class="form-label">Điểm</label>
                                    <input type="number" className="form-control" id="editScoreCriteria" min={0} step={0.25} max={10} value={editScoreCriteria} onChange={(e) => setEditScoreCriteria(e.target.value)} />
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmitEdit}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='delete-criteria'>
                <div class="modal fade" id="deleteCriteria" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">Xóa</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                Bạn chắc chắn muốn xóa tiêu chí đánh giá này ?
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmitDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tiêu chí đánh giá</th>
                        <th scope="col">Điểm</th>
                        <th scope="col">Năm</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {criterias.map((item, index) => (
                        <tr key={index}>
                            <th scope='row'>{index + 1}</th>
                            <td>{item.criteriaName}</td>
                            <td>{item.criteriaScore}</td>
                            <td>{item.year ? item.year : 'Chưa có'}</td>
                            <td>
                                <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#editCriteria" style={{ marginRight: '10px' }} onClick={() => handleEditClick(item)}>
                                    <ModeEditOutlineOutlinedIcon />
                                </button>
                                <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteCriteria" onClick={() => handleDeleteClick(item.criteriaId)}>
                                    <DeleteOutlinedIcon />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default CriteriaForTL