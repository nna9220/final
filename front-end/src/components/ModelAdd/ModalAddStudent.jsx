import React from 'react'
import { CLoadingButton } from '@coreui/react-pro'

function ModalAddStudent() {
    return (
        <div>
            <div class="d-flex justify-content-between align-items-center experience"><span data-bs-toggle="modal" data-bs-target="#exampleModal"  class="border px-3 p-1 add-experience"><i class="fa fa-plus"></i>&nbsp;Add </span>

            </div><br />
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5 ms-auto" id="exampleModalLabel">Thêm sinh viên</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row mt-2">
                                <div class="col-md-6"><label class="labels">Tên</label><input type="text" class="form-control" placeholder="Nhập tên" value="" /></div>
                                <div class="col-md-6"><label class="labels">Họ</label><input type="text" class="form-control" value="" placeholder="Nhập họ" /></div>
                            </div>
                            <div class="row mt-3">
                                <div class="col-md-6"><label class="labels">Ngày sinh</label><input type="date" class="form-control" placeholder="ngày sinh" value="" /></div>
                                <div class="col-md-6"><label class="labels">Giới tính</label><input type="text" class="form-control" value="" placeholder="Giới tính" /></div>
                            </div>
                            <div class="row mt-3">
                                <div class="col-md-12"><label class="labels">Mã số sinh viên</label><input type="text" class="form-control" placeholder="nhập MSSV" value="" /></div>
                                <div class="col-md-12"><label class="labels">Số điện thoại</label><input type="text" class="form-control" placeholder="nhập số điện thoại" value="" /></div>
                                <div class="col-md-12"><label class="labels">Địa chỉ</label><input type="text" class="form-control" placeholder="nhập địa chỉ" value="" /></div>
                                <div class="col-md-12"><label class="labels">Email ID</label><input type="text" class="form-control" placeholder="nhập email" value="" /></div>
                                <div class="col-md-12"><label class="labels">Ghi chú</label><input type="text" class="form-control" placeholder="nhập ghi chú" value="" /></div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <CLoadingButton color="success" spinnerType="grow" variant="outline" timeout={2000}>Submit</CLoadingButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalAddStudent