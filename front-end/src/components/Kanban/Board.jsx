import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Column from './Column';
import './scroll.scss'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import TimeLineOfStudent from '../Timeline/TimeLineOfStudent';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import axiosInstance from '../../API/axios';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_KB = MAX_FILE_SIZE_MB * 1024; // Convert MB to KB
const KanbanBoard = () => {
  const userToken = getTokenFromUrlAndSaveToStorage();
  const [data, setData] = useState([]);
  const [newTask, setNewTask] = useState([]);
  const [showTimeLine, setShowTimeLine] = useState(false);
  const [showListTask, setShowListTask] = useState(true);
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState();
  const [formNewTask, setFormNewTask] = useState({
    requirement: '',
    timeStart: '',
    timeEnd: '',
    assignTo: '',
  });
  const [statusActive, SetStatusActive] = useState(null);
  const [error, setError] = useState(null);
  const [report50, setReport50] = useState('');
  const [report100, setReport100] = useState('');
  const [currentDroppableId, setCurrentDroppableId] = useState('MustDo'); // State lưu trữ droppableId hiện tại
  const [statusSubject, setStatusSubject] = useState(null);
  const [isFileValid, setIsFileValid] = useState(true); // New state to track file validity

  const handleChangeAdd = (e) => {
    const { name, value } = e.target;
    setFormNewTask(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const toggleTimeline = () => {
    setShowTimeLine(!showTimeLine);
    setShowListTask(false);
  }

  const toggleListTask = () => {
    setShowListTask(!showListTask);
    setShowTimeLine(false);
  }

  useEffect(() => {
    loadList();
  }, []);

  const loadList = () => {
    const userToken = getTokenFromUrlAndSaveToStorage();
    if (userToken) {
      const tokenSt = sessionStorage.getItem(userToken);
      if (!tokenSt) {
        axiosInstance.get('/student/task/list', {
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        })
          .then(response => {
            console.log("list: ", response.data);
            setStatusSubject(response.data.subject.status)
            setSubject(response.data.subject.subjectName)
            setData(response.data.listTask);
            SetStatusActive(response.data.subject.active);
            setReport50(response.data.subject?.fiftyPercent?.name);
            setReport100(response.data.subject?.oneHundredPercent?.name);
          })
          .catch(error => {
            console.error("Error fetching task list:", error);
            setError("Bạn chưa có đề tài!!!!");
          });
      }
    }
  }

  const handleNewTask = () => {
    const userToken = getTokenFromUrlAndSaveToStorage();
    axiosInstance.get('/student/task/new', {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    })
      .then(response => {
        console.log("newTask: ", response.data.listStudentGroup);
        setNewTask(response.data.listStudentGroup);

        console.log("newTask2: ", newTask);//gán có dô đâu
      })
      .catch(error => {
        console.error("Error new task:", error);
      });
  }

  const handleAddNewTask = () => {
    const userToken = getTokenFromUrlAndSaveToStorage();

    axiosInstance.post('/student/task/create', formNewTask, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log("Thêm task thành công", response.data);
        setData([...data, response.data]);
        setFormNewTask({
          requirement: '',
          timeStart: '',
          timeEnd: '',
          assignTo: '',
        });
      })
      .catch(error => {
        console.error("Error add new task:", error);
      });
  }

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const movedTaskIndex = data.findIndex(task => task.taskId === draggableId);
    const movedTask = { ...data[movedTaskIndex] };
    const updatedData = [...data];

    // Xóa nhiệm vụ khỏi danh sách nguồn
    updatedData.splice(source.index, 1);
    // Thêm nhiệm vụ vào danh sách đích
    updatedData.splice(destination.index, 0, movedTask);

    // Cập nhật trạng thái mới cho nhiệm vụ
    switch (destination.droppableId) {
      case 'MustDo':
        movedTask.status = 'MustDo';
        break;
      case 'Doing':

        movedTask.status = 'Doing';
        break;
      case 'Closed':
        movedTask.status = 'Closed';
        break;
      default:
        movedTask.status = 'MustDo';
    }
    setData(updatedData);

    updateTaskStatus(draggableId, movedTask.status);
    setCurrentDroppableId(destination.droppableId);
  };

  const updateTaskStatus = (taskId, status) => {
    const userToken = getTokenFromUrlAndSaveToStorage();

    axiosInstance.post(`/student/task/updateStatus/${taskId}`, { status }, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
      params: {
        selectedOption: status
      }
    })
      .then(response => {
        console.log("Task status updated successfully:", response.data);
        loadList();
      })
      .catch(error => {
        console.error("Error updating task status:", error);
      });
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const allowedTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];
  
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setIsFileValid(true); // File is valid
    } else {
      toast.error('Vui lòng chọn file Word hoặc PDF!');
      setFile(null);
      setIsFileValid(false); // File is not valid
    }
  };
  

  const handleSubmitReportFifty = () => {
    if (file) {
      const formData = new FormData();
      formData.append('fileInput', file);

      axiosInstance.post('/student/manage/submit/fifty', formData, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => {
          toast.success('Nộp báo cáo 50% thành công!');
        })
        .catch(error => {
          toast.error('Lỗi khi nộp báo cáo: ' + error.message);
          console.error('Error:', error);
        });
    } else {
      toast.error('Vui lòng chọn file trước khi nộp!');
    }
  };

  const handleSubmitReport100 = () => {
    if (file) {
      const formData = new FormData();
      formData.append('fileInput', file);

      axiosInstance.post('/student/manage/submit/oneHundred', formData, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => {
          toast.success('Nộp báo cáo 100% thành công!');
        })
        .catch(error => {
          toast.error('Lỗi khi nộp báo cáo: ' + error.message);
          console.error('Error:', error);
        });
    } else {
      toast.error('Vui lòng chọn file trước khi nộp!');
    }
  };

  return (
    <div style={{ marginTop: '16px' }}>
      {statusActive === 0 || statusActive === 8 || statusActive === 9 ? (
        <div class="alert alert-warning" role="alert">
          Bạn không thể truy cập vào đề tài!!!
        </div>
      ) : (
        <>
          <div>
            <ToastContainer />
            {error && <h4 className='elter-error-no-topic'><ReportProblemOutlinedIcon /> {error}</h4>}
            {!error &&
              <div>
                <div className='group-button'>
                  <div className='subject-info' style={{ marginLeft: '10px' }}>
                    <h6>Đề tài: {subject}</h6>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className='button-submitTopic'>
                      <button type="button" className='submit-report' data-bs-toggle="modal" data-bs-target="#Reports">
                        <SummarizeOutlinedIcon /> Các bài báo cáo
                      </button>
                    </div>
                    <div className='button-submitTopic'>
                      <button
                        style={{ padding: '5px' }}
                        className={`submit-button ${statusActive === 2 ? 'active' : 'disabled'}`}
                        data-bs-toggle="modal"
                        data-bs-target="#submit50"
                        disabled={statusActive !== 2}
                      >
                        Nộp báo cáo lần 1
                      </button>
                      <button
                        className={`submit-button ${statusActive === 4 ? 'active' : 'disabled'}`}
                        data-bs-toggle="modal"
                        data-bs-target="#submit100"
                        disabled={statusActive !== 4}
                      >
                        Nộp báo cáo lần 2
                      </button>
                    </div>

                  </div>
                </div>

                <div className='list-button'>
                  <button type="button" className='button-add-task' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={handleNewTask}>
                    <AddOutlinedIcon /> Thêm
                  </button>
                </div>

                <ul class="nav" id="myTab" role="tablist">
                  <li class="nav-item" role="presentation">
                    <button class="nav-link-list active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" role="tab" aria-controls="home-tab-pane" aria-selected="true" onClick={toggleListTask}>List task</button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button class="nav-link-list" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" role="tab" aria-controls="profile-tab-pane" aria-selected="false" onClick={toggleTimeline}>Time Line</button>
                  </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                  <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabIndex="0">
                    {!error && (
                      <React.Fragment>
                        {showListTask && (
                          <DragDropContext onDragEnd={handleDragEnd}>
                            <div className="kanban-board">
                              <Column title="Must Do" tasks={data.filter(task => task.status && task.status === 'MustDo')} droppableId="MustDo" currentDroppableId={currentDroppableId} />
                              <Column title="Doing" tasks={data.filter(task => task.status && task.status === 'Doing')} droppableId="Doing" currentDroppableId={currentDroppableId} />
                              <Column title="Closed" tasks={data.filter(task => task.status && task.status === 'Closed')} droppableId="Closed" currentDroppableId={currentDroppableId} />
                            </div>
                          </DragDropContext>
                        )}
                        {showTimeLine && <TimeLineOfStudent />}
                      </React.Fragment>
                    )}
                  </div>
                  <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabIndex="0">
                    {showTimeLine && <TimeLineOfStudent />}
                  </div>
                </div>

                <div class="modal fade" id="submit50" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Nộp báo cáo 50%</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <div class="mb-3">
                          <label for="formFile" class="form-label">Chọn file báo cáo : </label>
                          <input class="form-control" type="file" id="formFile" onChange={handleFileChange} />
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" disabled={!isFileValid} onClick={handleSubmitReportFifty}>Xác nhận</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="modal fade" id="submit100" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Nộp báo cáo 100%</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <div class="mb-3">
                          <label for="formFile" class="form-label">Chọn file báo cáo : </label>
                          <input class="form-control" type="file" id="formFile"  onChange={handleFileChange} />
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" disabled={!isFileValid} onClick={handleSubmitReport100}>Xác nhận</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="modal fade" id="Reports" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Các bài báo cáo của đề tài</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <p>Báo cáo 50%: <span>{report50 ? report50 : 'Chưa có'}</span></p>
                        <p>Báo cáo 100%: <span>{report100 ? report100 : 'Chưa có'}</span></p>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog">
                    <form class="modal-content" onSubmit={handleAddNewTask}>
                      <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Add task</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <div class="form-floating mb-3 mt-3">
                          <input required type="text" class="form-control" id="requirement" placeholder="Enter requirement" name="requirement" value={formNewTask.requirement} onChange={handleChangeAdd} />
                          <label for="requirement">Tên task</label>
                        </div>
                        <div class="form-floating mb-3 mt-3">
                          <input required type="date" class="form-control" id="timeStart" placeholder="Enter timeStart" name="timeStart" value={formNewTask.timeStart} onChange={handleChangeAdd} />
                          <label for="timeStart">Thời gian bắt đầu</label>
                        </div>
                        <div class="form-floating mb-3 mt-3">
                          <input required type="date" class="form-control" id="timeEnd" placeholder="Enter timeEnd" name="timeEnd" value={formNewTask.timeEnd} onChange={handleChangeAdd} />
                          <label for="timeEnd">Thời gian kết thúc</label>
                        </div>
                        <div class="form-floating mb-3 mt-3">
                          <select required class="form-select" id="assignTo" name="assignTo" value={formNewTask.assignTo} onChange={handleChangeAdd}>
                            <option value="" selected disabled>Chọn thành viên</option>
                            {newTask.map((option, index) => (
                              <option key={index} value={option.studentId}>{option.person?.firstName + ' ' + option.person?.lastName} </option>
                            ))}
                          </select>
                          <label for="assignTo" class="form-label">Giao cho:</label>
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="submit" class="btn btn-success">Thêm</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            }
          </div>
        </>
      )}
    </div>
  );
};

export default KanbanBoard;