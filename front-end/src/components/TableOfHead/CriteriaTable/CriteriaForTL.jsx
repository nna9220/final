import React from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

function CriteriaForTL() {
  return (
    <div>
            <div className='add-criteria'>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Add
                </button>

                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">Thêm tiêu chí đánh giá</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="exampleFormControlInput1" class="form-label">Tiêu chí đánh giá</label>
                                    <input type="text" class="form-control" id="exampleFormControlInput1" />
                                </div><div class="mb-3">
                                    <label for="exampleFormControlInput1" class="form-label">Điểm</label>
                                    <input type="number" class="form-control" id="exampleFormControlInput1" min={0} step={0.25} max={10} />
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary">Add</button>
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
                                    <input type="text" class="form-control" id="exampleFormControlInput1" />
                                </div><div class="mb-3">
                                    <label for="exampleFormControlInput1" class="form-label">Điểm</label>
                                    <input type="number" class="form-control" id="exampleFormControlInput1" min={0} step={0.25} max={10} />
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary">Save changes</button>
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
                                <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                Bạn chắc chắn muốn xóa tiêu chí đánh giá này ?
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary">Delete</button>
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
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Đầy đủ nội dung</td>
                        <td>1</td>
                        <td>
                            <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#editCriteria" style={{marginRight:'10px'}}>
                                <ModeEditOutlineOutlinedIcon/>
                            </button>
                            <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteCriteria">
                                <DeleteOutlinedIcon/>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Đầy đủ nội dung</td>
                        <td>1</td>
                        <td>
                            <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#editCriteria"  style={{marginRight:'10px'}}>
                            <ModeEditOutlineOutlinedIcon/>
                            </button>
                            <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteCriteria">
                                <DeleteOutlinedIcon/>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Đầy đủ nội dung</td>
                        <td>1</td>
                        <td>
                            <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#editCriteria"  style={{marginRight:'10px'}}>
                            <ModeEditOutlineOutlinedIcon/>
                            </button>
                            <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteCriteria">
                                <DeleteOutlinedIcon/>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
  )
}

export default CriteriaForTL