import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import axiosInstance from '../../../API/axios';
import { DataGrid } from '@mui/x-data-grid';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';

function CompleteTopicKL() {
  const [topics, setTopics] = useState([]);
  const userToken = getTokenFromUrlAndSaveToStorage();
  const [detail, setDetail] = useState();

  useEffect(() => {
    if (userToken) {
      listTopic();
    }
  }, [userToken]);

  const listTopic = () => {
    axiosInstance.get('/lecturer/manageTutorial/graduation/subjects/successful', {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      }
    })
      .then(response => {
        console.log("Danh sách đề tài: ", response.data);
        setTopics(response.data.body);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleDetail = (id) => {
    console.log("id student", id);
    axiosInstance.get(`/lecturer/manageTutorial/graduation/subjects/successful/detail/${id}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('userToken')}`,
      },
    })
      .then(response => {
        console.log("Detail", response.data);
        setDetail(response.data.body);
      })
      .catch(error => {
        console.error("Lỗi khi lấy thông tin sinh viên:", error);
      });
  };

  const columns = [
    { field: 'subjectId', headerName: 'ID', width: 100 },
    { field: 'subjectName', headerName: 'Tên đề tài', width: 250 },
    { field: 'instructor', headerName: 'GVHD', width: 150 },
    { field: 'thesisAdvisor', headerName: 'GVPB', width: 150 },
    { field: 'requirement', headerName: 'Yêu cầu', width: 250 },
    {
      field: 'action', headerName: 'Action', width: 100, renderCell: (params) => (
        <div>
          <button className="btnView" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleDetail(params.row.subjectId)}>
            <NoteAltOutlinedIcon />
          </button>
        </div>
      )
    },
  ];

  return (
    <>
      <DataGrid
        rows={topics.map((topic) => (
          {
            subjectId: topic.subjectId,
            subjectName: topic.subjectName,
            instructor: topic.instructorId?.person?.firstName + ' ' + topic.instructorId?.person?.lastName,
            thesisAdvisor: topic.thesisAdvisorId?.person?.firstName + ' ' + topic.thesisAdvisorId?.person?.lastName,
            requirement: topic.requirement
          }
        ))}
        columns={columns}
        pageSize={5}
        initialState={{
          ...topics.initialState,
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 25, 50]}
        getRowId={(row) => row.subjectId}
      />
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Chi tiết đề tài</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div className='items-content-topic'>
                <label>Tên đề tài: <label className='content-name'>{detail?.subjectName}</label></label><br />
                <label>Loại đề tài: <label className='content-name'>{detail?.typeSubject?.typeName}</label></label><br />
                <label>Giảng viên hướng dẫn: <label className='content-name'>{detail?.instructorId?.person?.firstName + ' ' + detail?.instructorId?.person?.lastName}</label></label><br />
                <label>
                  Giảng viên phản biện:
                  <label className='content-name'>
                    {detail?.thesisAdvisorId && detail?.thesisAdvisorId?.person
                      ? detail?.thesisAdvisorId?.person?.firstName + ' ' + detail?.thesisAdvisorId?.person?.lastName
                      : 'Chưa có'}
                  </label>
                </label><br />
                <a>Nhóm sinh viên thực hiện</a><br />
                <label>Sinh viên 1: <label className='content-name'>{detail?.student1}</label></label><br />
                <label>Sinh viên 2: <label className='content-name'>{detail?.student2}</label></label><br />
                <label>Sinh viên 3: <label className='content-name'>{detail?.student3}</label></label><br />
                <label>Yêu cầu: <label className='content-name'>{detail?.requirement}</label></label><br />
                <label> Báo cáo:
                  <a href={detail?.oneHundredPercent?.url} target="_blank" rel="noopener noreferrer" download="" className='content-name'>
                    {detail?.oneHundredPercent?.name}
                  </a>
                </label>

              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CompleteTopicKL