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
    const [formDataAprrove, setFormDataApprove] = useState({
        reviewContent: '',
        reviewAdvantage: '',
        reviewWeakness: '',
        status: '',
        classification: '',
        score: ''
    })

    const handleChangeApprove = (e) => {
        const { name, value } = e.target;
        setFormDataApprove((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };
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
            const formDataToSend = {
                ...formDataAprrove,
                score: parseFloat(formDataAprrove.score),
                status: formDataAprrove.status === 'true' // Convert string to boolean
            };

            console.log("Data send: ", formDataToSend);
            axiosInstance.post(`/lecturer/manageTutorial/graduation/browse/${subjectIdForApproval}`, null, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
                params: formDataToSend
            })
                .then(response => {
                    // Handle success
                    console.log('Success:', response);
                    toast.success("Xác nhận đề tài thành công!")
                })
                .catch(error => {
                    // Handle error
                    console.error('Error:', error);
                    if(error.code === "ERR_BAD_REQUEST" && error.response.status === 400) {
                        toast.warning("Chưa phân giảng viên phản biện!");
                    }else{
                        toast.error("Lỗi !!!")
                    }
                });
        }
    };

    const handleScoreInput = (e) => {
        const value = parseFloat(e.target.value);
        if (value > 10) {
            e.target.value = 10;
        } else if (value < 0) {
            e.target.value = 0;
        }
        handleChangeApprove(e);
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
                    <div className="modal-dialog modal-dialog-scrollable modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalApproval">Nhận xét, đánh giá</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <h5>Đề tài: {subjectName}</h5>
                                <div class="mb-3">
                                    <label for="reviewContent" class="form-label">1.	Về nội dung đề tài & khối lượng thực hiện:</label>
                                    <textarea id="reviewContent" class="form-control" name="reviewContent" value={formDataAprrove.reviewContent} onChange={handleChangeApprove} rows="3"></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="reviewAdvantage" class="form-label">2.	Ưu điểm:</label>
                                    <textarea class="form-control" id="reviewAdvantage" name="reviewAdvantage" value={formDataAprrove.reviewAdvantage} onChange={handleChangeApprove} rows="3"></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="reviewWeakness" class="form-label">3.	Nhược điểm:</label>
                                    <textarea class="form-control" id="reviewWeakness" name="reviewWeakness" value={formDataAprrove.reviewWeakness} onChange={handleChangeApprove} rows="3"></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="status" className="form-label">4. Đề nghị cho bảo vệ hay không?</label>
                                    <div id="status" style={{ display: 'flex' }}>
                                        <div className="form-check" style={{ marginRight: '30px' }}>
                                            <input className="form-check-input" type="radio" id="defenseYes" name="status" value="true" checked={formDataAprrove.status === 'true'} onChange={handleChangeApprove} />
                                            <label className="form-check-label" htmlFor="defenseYes">
                                                Có
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" id="defenseNo" name="status" value="false" checked={formDataAprrove.status === 'false'} onChange={handleChangeApprove} />
                                            <label className="form-check-label" htmlFor="defenseNo">
                                                Không
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="classification" className="form-label">5. Đánh giá loại:</label>
                                    <div id="classification" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" id="excellent" name="classification" value="Xuất sắc" checked={formDataAprrove.classification === 'Xuất sắc'} onChange={handleChangeApprove} />
                                            <label className="form-check-label" htmlFor="excellent">
                                                Xuất sắc
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" id="good" name="classification" value="Giỏi" checked={formDataAprrove.classification === 'Giỏi'} onChange={handleChangeApprove} />
                                            <label className="form-check-label" htmlFor="good">
                                                Giỏi
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" id="fair" name="classification" value="Khá" checked={formDataAprrove.classification === 'Khá'} onChange={handleChangeApprove} />
                                            <label className="form-check-label" htmlFor="fair">
                                                Khá
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" id="average" name="classification" value="Trung bình" checked={formDataAprrove.classification === 'Trung bình'} onChange={handleChangeApprove} />
                                            <label className="form-check-label" htmlFor="average">
                                                Trung bình
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" id="weak" name="classification" value="Yếu" checked={formDataAprrove.classification === 'Yếu'} onChange={handleChangeApprove} />
                                            <label className="form-check-label" htmlFor="weak">
                                                Yếu
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="score" className="form-label">6. Điểm:</label>
                                    <input
                                        type='number'
                                        id="score"
                                        max={10}
                                        min={0}
                                        step={0.25}
                                        name='score'
                                        value={(formDataAprrove.score)}
                                        onInput={handleScoreInput}
                                        onChange={() => {handleChangeApprove}}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmitApproval}>Xác nhận</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
