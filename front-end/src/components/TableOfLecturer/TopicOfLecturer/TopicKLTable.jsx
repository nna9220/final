import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import ViewComfyAltOutlinedIcon from '@mui/icons-material/ViewComfyAltOutlined';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import axiosInstance from '../../../API/axios';
import Booard from '../../KanbanOfLecturer/Booard';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import './TopicTable.scss'
import BoardKL from '../../KanbanOfLecturer/Graduation/BoardKL';

export default function TopicKLTable() {
    const [topics, setTopics] = useState([]);
    const [activeTLChuyenNganh, setActiveTLChuyenNganh] = useState(false);
    const [activeKhoaLuan, setActiveKhoaLuan] = useState(false);
    const [showManagementTask, setShowManagementTask] = useState(false);
    const [showSubmitButton, setShowSubmitButton] = useState(true);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [selectedSubjectName, setSelectedSubjectName] = useState("");
    const [showBackButton, setShowBackButton] = useState(false);
    const [showButtons, setShowButtons] = useState(true); // State để ẩn hiện nút "Khóa luận tốt nghiệp" và "Tiểu luận chuyên ngành"
    const userToken = getTokenFromUrlAndSaveToStorage();
    const [subjectIdForSubmit50, setSubjectIdForSubmit50] = useState(null);
    const [subjectIdForSubmit100, setSubjectIdForSubmit100] = useState(null);
    const [subjectIdForApproval, setSubjectIdForApproval] = useState(null);
    const [subjectIdForRefuse, setSubjectIdForRefuse] = useState(null);
    const [subjectName, setSubjectName] = useState('');
    const [refusalReason, setRefusalReason] = useState("");
    const [activeSubject, setActiveSubject] = useState(null);
    useEffect(() => {
        listTopic();
    }, [userToken]);

    const listTopic = () => {
        axiosInstance.get('/lecturer/subjectGraduation', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            }
        })
            .then(response => {
                console.log("TopicTL: ", response.data);
                setTopics(response.data.listSubject);
                setActiveTLChuyenNganh(true);
                setActiveKhoaLuan(false);
                setShowButtons(true);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleShowManagementTask = (subjectId, subjectName) => {
        setSelectedSubjectId(subjectId);
        setSelectedSubjectName(subjectName);
        setShowManagementTask(true);
        setShowBackButton(true);
        setShowButtons(false); // Ẩn nút khi mở chi tiết task
        setShowSubmitButton(false);
    };

    const handleGoBack = () => {
        setShowManagementTask(false);
        setShowBackButton(false);
        setShowButtons(true); // Hiển thị lại nút khi quay lại danh sách đề tài
        setShowSubmitButton(true);
    };

    const handleSubmit50 = () => {
        console.log(subjectIdForSubmit50);
        if (subjectIdForSubmit50) {
            axiosInstance.post(`/lecturer/manageTutorial/graduation/fiftyRecent/${subjectIdForSubmit50}`, {}, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                }
            })
                .then(response => {
                    console.log('Yêu cầu nộp báo cáo 50% đã được gửi thành công:', response.data);
                    toast.success("Yêu cầu nộp báo cáo 50% đã được gửi thành công!")
                })
                .catch(error => {
                    console.error('Lỗi khi gửi yêu cầu nộp báo cáo 50%:', error);
                    toast.error("Lỗi khi gửi yêu cầu nộp báo cáo 50%")
                });
        }
    };

    const handleSubmit100 = () => {
        console.log(subjectIdForSubmit100);
        if (subjectIdForSubmit100) {
            axiosInstance.post(`/lecturer/manageTutorial/graduation/OneHundredRecent/${subjectIdForSubmit100}`, {}, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                }
            })
                .then(response => {
                    console.log('Yêu cầu nộp báo cáo 100% đã được gửi thành công:', response.data);
                    toast.success("Yêu cầu nộp báo cáo 100% đã được gửi thành công!")
                })
                .catch(error => {
                    console.error('Lỗi khi gửi yêu cầu nộp báo cáo 100%:', error);
                    toast.error("Lỗi khi gửi yêu cầu nộp báo cáo 100%")
                });
        }
    };

    const handleSubmitAll50 = () => {
        axiosInstance.post('/lecturer/manageTutorial/graduation/fiftyRecent/listSubject', {}, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            }
        })
            .then(response => {
                console.log('Yêu cầu nộp báo cáo 50% cho toàn bộ đề tài đã được gửi thành công:', response.data);
                toast.success("Yêu cầu nộp báo cáo 50% cho toàn bộ đề tài đã được gửi thành công!")
            })
            .catch(error => {
                console.error('Lỗi khi gửi yêu cầu nộp báo cáo 50% cho toàn bộ đề tài:', error);
                toast.error("Lỗi khi gửi yêu cầu nộp báo cáo 50% cho toàn bộ đề tài")
            });
    };

    const handleSubmitAll100 = () => {
        axiosInstance.post('/lecturer/manageTutorial/graduation/OneHundredRecent/listSubject', {}, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            }
        })
            .then(response => {
                console.log('Yêu cầu nộp báo cáo 100% cho toàn bộ đề tài đã được gửi thành công:', response.data);
                toast.success("Yêu cầu nộp báo cáo 100% cho toàn bộ đề tài đã được gửi thành công!")
            })
            .catch(error => {
                console.error('Lỗi khi gửi yêu cầu nộp báo cáo 100% cho toàn bộ đề tài:', error);
                toast.error("Lỗi khi gửi yêu cầu nộp báo cáo 100% cho toàn bộ đề tài")
            });
    };

    const handleSubmitApproval = () => {
        console.log(subjectIdForApproval);
        if (subjectIdForApproval) {
            axiosInstance.post(`/lecturer/manageTutorial/graduation/browse/${subjectIdForApproval}`, {}, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                }
            })
                .then(response => {
                    console.log('Xác nhận hoàn thành đề tài. Vui lòng chờ TBM duyệt qua phản biện!', response.data);
                    toast.success("Xác nhận hoàn thành đề tài. Vui lòng chờ TBM duyệt qua phản biện!")
                })
                .catch(error => {
                    console.error('Lỗi khi Xác nhận hoàn thành', error);
                    toast.error("Xác nhận hoàn thành thất bại!")
                });
        }
    };

    const handleSubmitRefuse = () => {
        console.log(subjectIdForRefuse);
        if (subjectIdForRefuse) {
            axiosInstance.post(`/lecturer/manageTutorial/graduation/refuse/${subjectIdForRefuse}`, null, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
                params: {
                    reason: refusalReason
                }
            })
                .then(response => {
                    console.log('Đề tài đã bị từ chối thành công!', response.data);
                    toast.success("Đề tài đã bị từ chối thành công!")
                })
                .catch(error => {
                    console.error('Lỗi khi từ chối đề tài:', error);
                    toast.error("Lỗi khi từ chối đề tài")
                });
        }
    };


    return (
        <div className='home-table-myTopicLec'>
            <ToastContainer />
            {showSubmitButton && (
                <div>
                    {topics.length > 0 ? (
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                className="submit50-all"
                                style={{ marginRight: '10px' }}
                                type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#submit50"
                                disabled={topics.every((item) => item.active == 9)}
                            >
                                Nộp báo cáo 50%
                            </button>
                            <button
                                className="submit100-all"
                                type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#submit100"
                                disabled={topics.every((item) => item.active == 9)}
                            >
                                Nộp báo cáo 100%
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                className="submit50-all"
                                style={{ marginRight: '10px' }}
                                type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#submit50"
                                disabled
                            >
                                Nộp báo cáo 50%
                            </button>
                            <button
                                className="submit100-all"
                                type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#submit100"
                                disabled
                            >
                                Nộp báo cáo 100%
                            </button>
                        </div>
                    )}
                </div>
            )}
            {showBackButton && (
                <>
                    <div className='group-lecturer'>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#" onClick={handleGoBack}> <ChevronLeftOutlinedIcon /> Danh sách đề tài</a></li>
                                <li className="breadcrumb-item active" aria-current="page">{selectedSubjectName}</li>
                            </ol>
                        </nav>
                        <button data-bs-toggle="modal" data-bs-target="#modalApproval2">Hoàn thành đề tài</button>
                    </div>
                </>
            )}
            {showManagementTask ? (
                <BoardKL subjectId={selectedSubjectId} />
            ) : (
                <table className="table table-hover table-lec-topic">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Tên đề tài</th>
                            <th scope="col">GVPB</th>
                            <th scope="col">Sinh viên 1</th>
                            <th scope="col">Sinh viên 2</th>
                            <th scope="col">Sinh viên 3</th>
                            <th scope='col'>Loại đề tài</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topics.length > 0 ? (
                            topics.filter((item) => item.active != 9).length > 0 ? (
                                topics.filter((item) => item.active != 9).map((item, index) => (
                                    <tr key={index}>
                                        <th scope='row'>{index + 1}</th>
                                        <td>{item.subjectName}</td>
                                        <td>{item.thesisAdvisorId?.person?.firstName ? `${item.thesisAdvisorId?.person?.firstName} ${item.thesisAdvisorId?.person?.lastName}` : 'Chưa có'}</td>
                                        <td>{item.student1 || ''}</td>
                                        <td>{item.student2 || ''}</td>
                                        <td>{item.student3 || ''}</td>
                                        <td>{item.typeSubject?.typeName || ''}</td>
                                        <td>
                                            <div style={{ display: 'flex' }}>
                                                <button className="management" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Đi đến chi tiết để quản lý đề tài" onClick={() => handleShowManagementTask(item.subjectId, item.subjectName)}><ViewComfyAltOutlinedIcon /></button>
                                                <div class="dropdown">
                                                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <MenuOutlinedIcon />
                                                    </button>
                                                    <ul class="dropdown-menu">
                                                        <li><button class="dropdown-item" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-placement="bottom" onClick={() => { setSubjectIdForSubmit50(item.subjectId); setSubjectName(item.subjectName) }}>Yêu cầu nộp báo cáo 50%</button></li>
                                                        <li><button class="dropdown-item" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal1" data-bs-placement="bottom" onClick={() => { setSubjectIdForSubmit100(item.subjectId); setSubjectName(item.subjectName) }}>Yêu cầu nộp báo cáo 100%</button></li>
                                                        <li><button class="dropdown-item" type="button" data-bs-toggle="modal" data-bs-target="#modalApproval" data-bs-placement="bottom" onClick={() => { setSubjectIdForApproval(item.subjectId); setSubjectName(item.subjectName) }}>Hoàn thành đề tài</button></li>
                                                        <li><button class="dropdown-item" type="button" data-bs-toggle="modal" data-bs-target="#modalRefuse" data-bs-placement="bottom" onClick={() => { setSubjectIdForRefuse(item.subjectId); setSubjectName(item.subjectName) }}>Từ chối đề tài</button></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">Không có dữ liệu</td>
                                </tr>
                            )
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center">Không có dữ liệu</td>
                            </tr>
                        )}
                    </tbody>

                </table>
            )}
            <div>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Thông báo</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Yêu cầu nộp báo cáo 50% cho đề tài {subjectName} này?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmit50}>Xác nhận</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="exampleModal1" tabIndex="-1" aria-labelledby="exampleModalLabel1" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Thông báo</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Yêu cầu nộp báo cáo 100% cho đề tài {subjectName} này?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmit100}>Xác nhận</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="submit50" tabIndex="-1" aria-labelledby="exampleModalLabel50" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel50">Thông báo</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Yêu cầu nôp báo cáo 50% cho toàn bộ đề tài?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmitAll50}>Xác nhận</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="submit100" tabIndex="-1" aria-labelledby="exampleModalLabel100" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel100">Thông báo</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Yêu cầu nôp báo cáo 100% cho toàn bộ đề tài?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmitAll100}>Xác nhận</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="modalApproval" tabIndex="-1" aria-labelledby="exampleModalApproval" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalApproval">Hoàn thành đề tài</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Xác nhận hoàn thành đề tài {subjectName} và chờ duyệt qua phản biện!
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmitApproval}>Xác nhận</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="modalRefuse" tabIndex="-1" aria-labelledby="exampleModalRefuse" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalRefuse">Từ chối đề tài</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Đề tài {subjectName}
                                <div class="mb-3">
                                    <label for="reason" class="form-label">Lý do từ chối</label>
                                    <input type="text" class="form-control" id="reason" value={refusalReason} onChange={(e) => setRefusalReason(e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmitRefuse}>Xác nhận</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="confirmSuccess" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">XÁC NHẬN HOÀN THÀNH ĐỀ TÀI</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Bạn chắc chắn muốn hoàn thành đề tài này không?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                <button type="button" className="btn btn-primary">Xác nhận</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
