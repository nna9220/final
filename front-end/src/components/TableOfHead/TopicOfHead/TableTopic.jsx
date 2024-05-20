import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import './TableTopic.scss';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import { BsPentagonHalf } from "react-icons/bs";
import { BsPentagonFill } from "react-icons/bs";
import { BsCursorFill } from "react-icons/bs";
import ManagementTask from '../../KanbanOfHead/ManagementTask';
import axiosInstance from '../../../API/axios';

function TableTopic() {
  const [topics, setTopics] = useState([]);
  const [showManagementTask, setShowManagementTask] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedSubjectName, setSelectedSubjectName] = useState("");
  const [showBackButton, setShowBackButton] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const userToken = getTokenFromUrlAndSaveToStorage();
  const [scores, setScores] = useState({});
  const [subjectIdForSubmit50, setSubjectIdForSubmit50] = useState(null);
  const [subjectIdForSubmit100, setSubjectIdForSubmit100] = useState(null);
  const [showToastSuccess, setShowToastSuccess] = useState(false);
  useEffect(() => {
    console.log("TokenTopic: " + userToken);
    if (userToken) {
      const tokenSt = sessionStorage.getItem(userToken);
      if (!tokenSt) {
        axiosInstance.get('/head/manager', {
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        })
          .then(response => {
            console.log("Topic: ", response.data);
            setTopics(response.data.listSubject);
            const initialScores = {};
            response.data.listSubject.forEach(topic => {
              initialScores[topic.subjectId] = 0;
            });
            setScores(initialScores);
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  }, [userToken]);

  const handleShowManagementTask = (subjectId, subjectName) => {
    setSelectedSubjectId(subjectId);
    setSelectedSubjectName(subjectName);
    setShowManagementTask(true);
    setShowBackButton(true);
    setShowSubmitButton(false);
  };

  const handleGoBack = () => {
    setShowManagementTask(false);
    setShowBackButton(false);
    setShowSubmitButton(true);
  };

  const handleScoreChange = (subjectId, event) => {
    const value = parseFloat(event.target.value);
    setScores(prevScores => ({
      ...prevScores,
      [subjectId]: value
    }));
  };

  const handleSubmit50 = () => {
    console.log(subjectIdForSubmit50);
    if (subjectIdForSubmit50) {
      axiosInstance.post(`/head/manageTutorial/fiftyRecent/${subjectIdForSubmit50}`, {}, {
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
      axiosInstance.post(`/head/manageTutorial/fiftyRecent/${subjectIdForSubmit100}`, {}, {
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
    axiosInstance.post('/head/manageTutorial/fiftyRecent/listSubject', {}, {
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
    axiosInstance.post('/head/manageTutorial/OneHundredRecent/listSubject', {}, {
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

  return (
    <div>
      <ToastContainer/>
      {showSubmitButton && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="submit50-all" style={{ marginRight: '10px' }} type="button" data-bs-toggle="modal" data-bs-target="#submit50">
              Nộp báo cáo 50%
            </button>
            <button className="submit100-all" type="button" data-bs-toggle="modal" data-bs-target="#submit100">
              Nộp báo cáo 100%
            </button>
          </div>
        </>
      )}

      {showBackButton && (
        <>
          <div className='group-lecturer'>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="#" onClick={handleGoBack}>Danh sách đề tài</a></li>
                <li className="breadcrumb-item active" aria-current="page">{selectedSubjectName}</li>
              </ol>
            </nav>
            <button data-bs-toggle="modal" data-bs-target="#confirmSuccess">Hoàn thành đề tài</button>
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
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary">Confirm</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className='home-table-myTopic'>
        {showManagementTask ? (
          <ManagementTask subjectId={selectedSubjectId} />
        ) : (
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col" style={{ width: '250px' }}>Tên đề tài</th>
                <th scope="col">GVHD</th>
                <th scope="col">GVPB</th>
                <th scope="col">SV1</th>
                <th scope="col">SV2</th>
                <th scope="col">SV3</th>
                <th scope="col" style={{ width: '150px' }}>Yêu cầu</th>
                <th scope="col" style={{ width: '150px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((item, index) => (
                <tr key={index}>
                  <th scope='row'>{index + 1}</th>
                  <td>{item.subjectName}</td>
                  <td>{item.instructorId?.person?.firstName + ' ' + item.instructorId?.person?.lastName}</td>
                  <td>{item.thesisAdvisorId?.person?.firstName + ' ' + item.thesisAdvisorId?.person?.lastName}</td>
                  <td>{item.student1}</td>
                  <td>{item.student2}</td>
                  <td>{item.student3}</td>
                  <td>{item.requirement}</td>
                  <td>
                    <button className="management" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Đi đến chi tiết để quản lý đề tài" onClick={() => handleShowManagementTask(item.subjectId, item.subjectName)}><BsCursorFill /></button>
                    <button className="submit50" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-placement="bottom" title="Yêu cầu nộp báo cáo 50%" onClick={() => setSubjectIdForSubmit50(item.subjectId)}>
                      <BsPentagonHalf />
                    </button>
                    <button className="submit100" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal1" data-bs-placement="bottom" title="Yêu cầu nộp báo cáo 100%" onClick={() => setSubjectIdForSubmit100(item.subjectId)}>
                      <BsPentagonFill />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div>
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Thông báo</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                Yêu cầu nộp báo cáo 50% cho đề tài này?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmit50}>Confirm</button>
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
                Yêu cầu nộp báo cáo 100% cho đề tài này?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmit100}>Confirm</button>
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
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmitAll50}>Confirm</button>
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
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmitAll100}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableTopic;
