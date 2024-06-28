import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ColumnKL from './ColumnKL';
import './scroll.scss'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import axiosInstance from '../../../API/axios';
import TimeLineOfStudentGraduation from '../../Timeline/TimeLineOfStudentGraduation';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';

const KanbanBoardKL = () => {
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
        axiosInstance.get('graduation/student/task/list', {
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
    axiosInstance.get('graduation/student/task/new', {
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

    axiosInstance.post('graduation/student/task/create', formNewTask, {
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

    axiosInstance.post(`/graduation/student/task/updateStatus/${taskId}`, { status }, {
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
    setFile(event.target.files[0]);
  };

  const handleSubmitReportFifty = () => {
    if (file) {
      const formData = new FormData();
      formData.append('fileInput', file);

      axiosInstance.post('/student/manage/graduation/submit/fifty', formData, {
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

      axiosInstance.post('/student/manage/graduation/submit/oneHundred', formData, {
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
    <div>
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
                <div className='group-button' style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h6 style={{marginLeft:'10px'}}>  Đề tài: {subject}</h6>
                    <button type="button" style={{border:'none', backgroundColor:'white', color:'#4477CE', fontWeight:'bold'}} data-bs-toggle="modal" data-bs-target="#Reports">
                     <SummarizeOutlinedIcon/> Các bài báo cáo
                    </button>
                  </div>

                  <div className='button-submitTopic'>
                    {statusActive === 2 ? (
                      <button className='submit-1' data-bs-toggle="modal" data-bs-target="#submit50">
                        Nộp báo cáo lần 1
                      </button>) : (
                      <button className='submit-1' data-bs-toggle="modal" data-bs-target="#submit50" disabled>
                        Nộp báo cáo lần 1
                      </button>)
                    }

                    {statusActive === 4 ? (
                      <button className='submit-2' data-bs-toggle="modal" data-bs-target="#submit100">
                        Nộp báo cáo lần 2
                      </button>) : (
                      <button style={{ backgroundColor: '' }} className='submit-2' data-bs-toggle="modal" data-bs-target="#submit100" disabled>
                        Nộp báo cáo lần 2
                      </button>)
                    }
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
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmitReportFifty}>Submit</button>
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
                            <input class="form-control" type="file" id="formFile" onChange={handleFileChange} />
                          </div>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmitReport100}>Submit</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="modal fade" id="Reports" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h1 class="modal-title fs-5" id="exampleModalLabel">Các bài báo cáo của đề tài</h1>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          <p>Báo cáo 50%: <span>{report50}</span></p>
                          <p>Báo cáo 100%: <span>{report100}</span></p>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='list-button'>
                  <button type="button" className='button-add-task' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={handleNewTask}>
                    <AddOutlinedIcon /> Add task
                  </button>
                  <div>
                    <button type="button" className='button-add-task' onClick={toggleListTask}>
                      <DnsOutlinedIcon /> List Task
                    </button>
                    <button type="button" className='button-add-task' onClick={toggleTimeline}>
                      <TimelineOutlinedIcon /> Time Line
                    </button>
                  </div>
                </div>
                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Add task</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <div class="form-floating mb-3 mt-3">
                          <input type="text" class="form-control" id="requirement" placeholder="Enter requirement" name="requirement" value={formNewTask.requirement} onChange={handleChangeAdd} />
                          <label for="requirement">Tên task</label>
                        </div>
                        <div class="form-floating mb-3 mt-3">
                          <input type="date" class="form-control" id="timeStart" placeholder="Enter timeStart" name="timeStart" value={formNewTask.timeStart} onChange={handleChangeAdd} />
                          <label for="timeStart">Thời gian bắt đầu</label>
                        </div>
                        <div class="form-floating mb-3 mt-3">
                          <input type="date" class="form-control" id="timeEnd" placeholder="Enter timeEnd" name="timeEnd" value={formNewTask.timeEnd} onChange={handleChangeAdd} />
                          <label for="timeEnd">Thời gian kết thúc</label>
                        </div>
                        <div class="form-floating mb-3 mt-3">
                          <select class="form-select" id="assignTo" name="assignTo" value={formNewTask.assignTo} onChange={handleChangeAdd}>
                            <option value="" selected disabled>Chọn thành viên</option>
                            {newTask.map((option, index) => (
                              <option key={index} value={option.studentId}>{option.person?.firstName + ' ' + option.person?.lastName} </option>
                            ))}
                          </select>
                          <label for="assignTo" class="form-label">Giao cho:</label>
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-success" data-bs-dismiss="modal" onClick={handleAddNewTask}>Add</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            {!error && (
              <React.Fragment>
                {showListTask && (
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="kanban-board">
                      <ColumnKL title="Must Do" tasks={data.filter(task => task.status && task.status === 'MustDo')} droppableId="MustDo" currentDroppableId={currentDroppableId} />
                      <ColumnKL title="Doing" tasks={data.filter(task => task.status && task.status === 'Doing')} droppableId="Doing" currentDroppableId={currentDroppableId} />
                      <ColumnKL title="Closed" tasks={data.filter(task => task.status && task.status === 'Closed')} droppableId="Closed" currentDroppableId={currentDroppableId} />
                    </div>
                  </DragDropContext>
                )}
                {showTimeLine && <TimeLineOfStudentGraduation />}
              </React.Fragment>
            )}
          </div>
        </>
        )}
    </div>
  );
};

export default KanbanBoardKL;