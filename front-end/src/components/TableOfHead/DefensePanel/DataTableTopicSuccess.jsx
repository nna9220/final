import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import axiosInstance from '../../../API/axios';
import { useState, useEffect } from 'react';
function DataTableTopicSuccess() {

    const userToken = getTokenFromUrlAndSaveToStorage();
    const [subject, setSubject] = useState([]);

    useEffect(() => {
        loadData();
    }, [userToken]);


    const loadData = () => {
        console.log("Token: " + userToken);
        if (userToken) {
            axiosInstance.get('/head/manager/council/listSubject', {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            })
                .then(response => {
                    console.log("Subject: ", response.data);
                    setSubject(response.data);
                })
                .catch(error => {
                    console.error(error);
                });
        };
    }

    return (
        <div>
            <div className='body-table'>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Tên đề tài</th>
                            <th scope='col'>GVHD</th>
                            <th scope='col'>GVPB</th>
                            <th scope='col'>SV 1</th>
                            <th scope='col'>SV 2</th>
                            <th scope='col'>SV 3</th>
                            <th scope='col'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <td>1</td>
                        <td>Website Đăng ký học phần</td>
                        <td>Huỳnh Xuân Phụng</td>
                        <td>Lê Vĩnh Thịnh</td>
                        <td>20110753</td>
                        <td>20110678</td>
                        <td></td>
                        <td>
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Lập hội đồng
                            </button>
                        </td>
                    </tbody>
                </table>
            </div>

            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Lập hội đồng</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="time" class="form-label">Thời gian</label>
                                <input type="datetime-local" class="form-control" id="time" />
                            </div>
                            <h6>Danh sách thành viên hội đồng: </h6>
                            <div>
                                <table className='table-bordered table'>
                                    <thead>
                                        <tr>
                                            <th>Số thứ tự</th>
                                            <th>Thành viên</th>
                                            <th>Họ và tên</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Thành viên 1</td>
                                            <td>
                                                <select>
                                                    <option value="giang-vien-1">Giảng viên 1</option>
                                                    <option value="giang-vien-2">Giảng viên 2</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>Thành viên 2</td>
                                            <td>
                                                <select>
                                                    <option value="giang-vien-1">Giảng viên 1</option>
                                                    <option value="giang-vien-2">Giảng viên 2</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>Thành viên 3 </td>
                                            <td>
                                                <select>
                                                    <option value="giang-vien-1">Giảng viên 1</option>
                                                    <option value="giang-vien-2">Giảng viên 2</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>4</td>
                                            <td>Thành viên 4</td>
                                            <td>
                                                <select>
                                                    <option value="giang-vien-1">Giảng viên 1</option>
                                                    <option value="giang-vien-2">Giảng viên 2</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>5</td>
                                            <td>Thành viên 5</td>
                                            <td>
                                                <select>
                                                    <option value="giang-vien-1">Giảng viên 1</option>
                                                    <option value="giang-vien-2">Giảng viên 2</option>
                                                </select>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
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
    )
}

export default DataTableTopicSuccess