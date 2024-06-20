import React, { useState, useEffect } from 'react';
import axiosInstance from '../../API/axios';
import { DataGrid } from '@mui/x-data-grid';
import './DatatableContact.scss'
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DatatableContact() {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [replyTitle, setReplyTitle] = useState("");
    const [replyContent, setReplyContent] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const tokenSt = sessionStorage.getItem('userToken');
        if (tokenSt) {
            axiosInstance.get('/admin/feedback/listContact', {
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                },
            })
                .then(response => {
                    setContacts(response.data);
                    console.log('contacts: ', response.data);
                })
                .catch(error => {
                    console.error("error: ", error);
                });
        } else {
            console.log("Lỗi !!");
        }
    };

    const getDetailContact = (id) => {
        console.log("id detail", id)
        const tokenSt = sessionStorage.getItem('userToken');
        if (tokenSt) {
            axiosInstance.get(`/admin/feedback/contact-detail/${id}`, {
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                },
            })
                .then(response => {
                    setSelectedContact(response.data);
                    console.log('selected contact: ', response.data);
                })
                .catch(error => {
                    console.error("error: ", error);
                });
        } else {
            console.log("Lỗi !!");
        }
    };

    const replyContact = (contactId) => {
        console.log("contactID: ", contactId);
        console.log("content", replyContent);
        console.log("title", replyTitle);

        const tokenSt = sessionStorage.getItem('userToken');
        if (tokenSt) {
            // Lấy thông tin liên hệ trước khi gửi email
            axiosInstance.get(`/admin/feedback/contact-detail/${contactId}`, {
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                },
            })
                .then(response => {
                    const existedContact = response.data;
                    // Kiểm tra xem liên hệ đã được giải quyết chưa
                    if (existedContact.status) {
                        // Nếu đã được giải quyết, hiển thị thông báo và không gửi email
                        toast.warning("Liên hệ này đã được giải quyết trước đó!");
                    } else {
                        // Nếu chưa được giải quyết, thực hiện gửi email
                        axiosInstance.post(`/admin/feedback/reply/${contactId}`, null, {
                            headers: {
                                'Authorization': `Bearer ${tokenSt}`,
                            },
                            params: {
                                title: replyTitle,
                                content: replyContent,
                            },
                        })
                            .then(response => {
                                if (response.status === 200) {
                                    console.log('reply contact: ', response.data);
                                    loadData(); // Reload the data to reflect the changes
                                    setSelectedContact(null); // Clear the selected contact after replying
                                    toast.success("Đã gửi mail giải đáp thắc mắc!")
                                    // Set title và content thành rỗng
                                    setReplyTitle("");
                                    setReplyContent("");
                                } else {
                                    console.error("error: ", response.data);
                                    toast.error("Đã xảy ra lỗi !");
                                }
                            })
                            .catch(error => {
                                console.error("error: ", error);
                                toast.error("Đã xảy ra lỗi !");
                            });
                    }
                })
                .catch(error => {
                    console.error("error: ", error);
                    toast.error("Đã xảy ra lỗi khi kiểm tra trạng thái liên hệ !");
                });
        } else {
            console.log("Lỗi !!");
        }
    };

    const columns = [
        { field: 'stt', headerName: 'STT', width: 70 },
        { field: 'name', headerName: 'Họ và tên', width: 200 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phone', headerName: 'Số điện thoại', width: 150 },
        { field: 'content', headerName: 'Nội dung', width: 300 },
        {
            field: 'status', headerName: 'Trạng thái', width: 150, renderCell: (params) => {
                return (
                    <span className={params.value === 'Đã phản hồi' ? 'status-responded' : 'status-pending'}>
                        {params.value}
                    </span>
                );
            }
        },
        {
            field: 'action', headerName: 'Action', width: 120, renderCell: (params) => {
                return (
                    <div>
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => getDetailContact(params.row.id)}>
                            <MarkEmailReadOutlinedIcon />
                        </button>
                    </div>
                );
            }
        }
    ];


    const rows = contacts
        .sort((a, b) => new Date(b.time) - new Date(a.time)) // Sắp xếp dữ liệu theo thời gian tạo giảm dần
        .map((item, index) => ({
            id: item.contactId,
            stt: index + 1,
            name: item.name,
            email: item.email,
            phone: item.phone,
            content: item.content,
            status: item.status ? 'Đã phản hồi' : 'Chưa giải đáp',
            time: item.time
        }));

    return (
        <div className='table-contact'>
            <ToastContainer />
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[10, 25, 50]}
            />

            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-scrollable">
                    <form class="modal-content" onSubmit={(e) => {
                        e.preventDefault();
                        const title = e.target.title.value;
                        const content = e.target.content.value;
                        replyContact(selectedContact.contactId, title, content);
                    }}>
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Giải đáp thắc mắc</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div className='contact-detail'>
                                <h5 className='title-contact'>Chi tiết liên hệ</h5>
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td style={{ width: '150px' }}><strong>Họ và tên:</strong></td>
                                            <td>{selectedContact && selectedContact.name}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '100px' }}><strong>Email:</strong></td>
                                            <td>{selectedContact && selectedContact.email}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '150px' }}><strong>Số điện thoại:</strong></td>
                                            <td>{selectedContact && selectedContact.phone}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '100px' }}><strong>Nội dung:</strong></td>
                                            <td>{selectedContact && selectedContact.content}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '100px' }}><strong>Trạng thái:</strong></td>
                                            <td>{selectedContact && (selectedContact.status ? 'Đã phản hồi' : 'Chưa giải đáp')}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '200px' }}><strong>Nội dung phản hồi:</strong></td>
                                            <td>{selectedContact && (selectedContact.feedback?.content)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                {selectedContact && !selectedContact.status && (
                                    <>
                                        <h5 className='title-contact'>Phản hồi liên hệ</h5>
                                        <div class="mb-3">
                                            <label for="exampleFormControlInput1" class="form-label">Tiêu đề</label>
                                            <input name="title" required type="text" class="form-control" id="exampleFormControlInput1" value={replyTitle} onChange={(e) => setReplyTitle(e.target.value)} />
                                        </div>
                                        <div class="mb-3">
                                            <label for="exampleFormControlTextarea1" class="form-label">Nội dung</label>
                                            <textarea name="content" required class="form-control" id="exampleFormControlTextarea1" rows="3" value={replyContent} onChange={(e) => setReplyContent(e.target.value)}></textarea>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div class="modal-footer">
                            {selectedContact && !selectedContact.status && (
                                <>
                                    <button className='buttonContact' type="submit" data-bs-dismiss="modal">Gửi liên hệ</button>

                                </>
                            )}
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DatatableContact;

