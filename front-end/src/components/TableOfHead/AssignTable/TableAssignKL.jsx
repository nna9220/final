import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import axiosInstance from '../../../API/axios';
import './assign.scss';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TableAssignKL() {
  const [topics, setTopics] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [lecturerIds, setLecturerIds] = useState([]);
  const userToken = getTokenFromUrlAndSaveToStorage();

  const fetchTopics = () => {
    if (userToken) {
      const tokenSt = sessionStorage.getItem(userToken);
      if (!tokenSt) {
        axiosInstance.get('/head/subjectGraduation/listAdd', {
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        })
          .then(response => {
            console.log("Topic: ", response.data);
            setTopics(response.data.listSubject);
            setLecturerIds(Array(response.data.listSubject.length).fill(''));
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  };

  useEffect(() => {
    console.log("Token: " + userToken);
    fetchTopics();
  }, [userToken]);

  const handleSelectChange = (event, index) => {
    const { value } = event.target;
    const newLecturerIds = [...lecturerIds];
    newLecturerIds[index] = value;
    setLecturerIds(newLecturerIds);
  };

  const handleAssignGVPB = (subjectId, index) => {
    axiosInstance.get(`/head/subjectGraduation/listLecturer/${subjectId}`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    })
      .then(response => {
        console.log("List of lecturers for counter argument: ", response.data.listLecturer);
        setLecturers(response.data.listLecturer);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleGVPB = (subjectId, index) => {
    const lecturerId = lecturerIds[index];
    if (lecturerId && subjectId) {
      axiosInstance.post(`/head/subjectGraduation/addCounterArgumrnt/${subjectId}/${lecturerId}`, null, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      })
        .then(response => {
          console.log('Successfully assigned lecturer for counter argument:', response.data);
          toast.success("Phân giảng viên thành công!");
          fetchTopics(); // Tải lại danh sách đề tài sau khi phân giảng viên thành công
        })
        .catch(error => {
          if (error.response) {
            switch (error.response.status) {
              case 403:
                toast.error("Bạn không có quyền thực hiện hành động này!");
                break;
              case 404:
                toast.error(error.response.data);
                break;
              case 406:
                toast.error("Thời gian đăng ký của SV phải ở sau thời gian duyệt đề tài của TBM");
                break;
              case 500:
                toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
                break;
              default:
                toast.error("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
            }
          } else {
            console.error('Error assigning lecturer for counter argument:', error);
            toast.error("Phân giảng viên thất bại!");
          }
        });
    } else {
      console.error('LectureId or subjectId is undefined or empty');
      console.log("LectureId: ", lecturerId);
      console.log("SubjectId: ", subjectId);
      toast.error("LectureId hoặc SubjectId không hợp lệ!");
    }
  };

  return (
    <div className='home-table-assign'>
      <ToastContainer />
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Tên đề tài</th>
            <th scope="col">Sinh viên 1</th>
            <th scope="col">Sinh viên 2</th>
            <th scope="col">Sinh viên 3</th>
            <th scope="col">GVHD</th>
            <th scope="col">Phân GVPB</th>
          </tr>
        </thead>
        <tbody>
          {topics.map((item, index) => (
            <tr key={index}>
              <th scope='row'>{index + 1}</th>
              <td>{item.subjectName}</td>
              <td>{item.student1}</td>
              <td>{item.student2}</td>
              <td>{item.student3}</td>
              <td>{item.instructorId.person.firstName + ' ' + item.instructorId.person.lastName}</td>
              <td>
                <div className='group-assign'>
                  <select className='optionLecs' value={lecturerIds[index]} onChange={(event) => handleSelectChange(event, index)} onClick={() => handleAssignGVPB(item.subjectId, index)}>
                    <option className='option' value="">Chọn GVPB</option>
                    {lecturers.map((lecturer, idx) => (
                      <option key={idx} value={lecturer.lecturerId}>{lecturer.person.firstName} {lecturer.person.lastName}</option>
                    ))}
                  </select>
                  <button className='btn-assign' onClick={() => handleGVPB(item.subjectId, index)}>Phân công</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableAssignKL;
