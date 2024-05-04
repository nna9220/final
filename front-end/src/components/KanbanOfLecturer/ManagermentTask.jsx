import React, { useState, useEffect } from 'react';
import Booard from './Booard';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DetailsIcon from '@mui/icons-material/Details';
import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import './Styles.scss';

function ManagermentTask() {
  const [topics, setTopics] = useState([]);
  const [activeTLChuyenNganh, setActiveTLChuyenNganh] = useState(false);
  const [activeKhoaLuan, setActiveKhoaLuan] = useState(false);
  const [showManagementTask, setShowManagementTask] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedSubjectName, setSelectedSubjectName] = useState("");
  const [showBackButton, setShowBackButton] = useState(false);
  const [showButtons, setShowButtons] = useState(true); // State để ẩn hiện nút "Khóa luận tốt nghiệp" và "Tiểu luận chuyên ngành"
  const userToken = getTokenFromUrlAndSaveToStorage();

  useEffect(() => {
    listTopic();
  }, [userToken]);

  const listTopic = () => {
    axiosInstance.get('/lecturer/subject', {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      }
    })
      .then(response => {
        console.log("TopicTL: ", response.data);
        setTopics(response.data.listSubject);
        setActiveTLChuyenNganh(true);
        setActiveKhoaLuan(false);
        setShowButtons(true); // Hiển thị nút khi chuyển sang danh sách đề tài khác
      })
      .catch(error => {
        console.error(error);
      });
  }

  const listSubjectGraduation = () => {
    axiosInstance.get('/lecturer/subjectGraduation', {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      }
    })
      .then(response => {
        console.log("TopicKL: ", response.data);
        setTopics(response.data.listSubject);
        setActiveKhoaLuan(true);
        setActiveTLChuyenNganh(false);
        setShowButtons(true); // Hiển thị nút khi chuyển sang danh sách đề tài khác
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
  };

  const handleGoBack = () => {
    setShowManagementTask(false);
    setShowBackButton(false);
    setShowButtons(true); // Hiển thị lại nút khi quay lại danh sách đề tài
  };

  return (
    <div className='home-table-myTopicLec'>
      <div className='btn-type'>
        <button className={`button-listDelete ${activeKhoaLuan ? 'active' : ''}`} onClick={listSubjectGraduation} style={{ display: showButtons ? 'inline-block' : 'none' }}> {/* Thêm điều kiện hiển thị */}
          <SummarizeOutlinedIcon /> Khóa luận tốt nghiệp
        </button>
        <button className={`button-listDelete ${activeTLChuyenNganh ? 'active' : ''}`} onClick={listTopic} style={{ display: showButtons ? 'inline-block' : 'none' }}> {/* Thêm điều kiện hiển thị */}
          <TopicOutlinedIcon /> Tiểu luận chuyên ngành
        </button>
      </div>
      <br />
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
        </>
      )}
      {showManagementTask ? (
        <Booard subjectId={selectedSubjectId} />
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
              <th scope="col">Yêu cầu</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((item, index) => (
              <tr key={index}>
                <th scope='row'>{index + 1}</th>
                <td>{item.subjectName}</td>
                <td>{item.thesisAdvisorId?.person?.firstName + ' ' + item.thesisAdvisorId?.person?.lastName}</td>
                <td>{item.student1 || ''}</td>
                <td>{item.student2 || ''}</td>
                <td>{item.student3 || ''}</td>
                <td>{item.typeSubject.typeName || ''}</td>
                <td>{item.requirement}</td>
                <td>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button style={{ marginRight: '20px' }} className='button-res' onClick={() => handleShowManagementTask(item.subjectId, item.subjectName)}>
                      <p className='text'><DetailsIcon /></p>
                    </button>
                    <button className='button-res'>
                      <p className='text'><ModeEditOutlineOutlinedIcon /></p>
                    </button>
                  </div>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      )}

      <div class="modal fade" id="confirmSuccess" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">XÁC NHẬN HOÀN THÀNH ĐỀ TÀI</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              Bạn chắc chắn muốn hoàn thành đề tài này không?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagermentTask;
