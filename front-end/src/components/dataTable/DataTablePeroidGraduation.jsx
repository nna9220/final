import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from '../../API/axios';
import { toast, ToastContainer } from 'react-toastify';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import 'react-toastify/dist/ReactToastify.css';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteForeverOutlined from '@mui/icons-material/DeleteForeverOutlined';
import { Breadcrumbs, Link, Typography, Grid, TextField, Button } from '@mui/material';

function DataTablePeroidGraduation() {
  const [peroids, setPeroids] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const tokenSt = sessionStorage.getItem('userToken');
    if (tokenSt) {
      axiosInstance.get('/admin/PeriodGraduationLecturer', {
        headers: {
          'Authorization': `Bearer ${tokenSt}`,
        },
      })
        .then(response => {
          const dataTimeApproveArray = response.data.period || [];
          console.log("Period: ", dataTimeApproveArray);
          setPeroids(dataTimeApproveArray);
        })
        .catch(error => {
          console.error("error: ", error);
        });
    } else {
      console.log("Lỗi !!")
    }
  }

  const handleEdit = (period) => {
    setSelectedPeriod(period);
  };

  const columns = [
    { field: 'stt', headerName: 'STT', width: 100 },
    { field: 'name', headerName: 'Tên đợt', width: 500 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <div>
          <button className="btnView" onClick={() => handleEdit(params.row)}>
            <EditOutlined />
          </button>
          <button className='btnDelete' data-bs-toggle="modal" data-bs-target="#delete">
            <DeleteForeverOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {selectedPeriod ? (
        <div>
          <Breadcrumbs aria-label="breadcrumb" separator="›"
            style={{ marginLeft: '20px', paddingTop: '10px', paddingBottom: '10px', borderBottom: '1px solid #ddd' }}>
            <Link color="inherit" href="#" onClick={() => setSelectedPeriod(null)}>
              DANH SÁCH ĐỢT ĐĂNG KÝ
            </Link>
            <Typography color="textPrimary">{selectedPeriod.name}</Typography>
          </Breadcrumbs>
          <h6 style={{ padding: '20px', color: '#1597BB' }}>CHI TIẾT ĐỢT ĐĂNG KÝ</h6>
          <div style={{ marginLeft: '20px', marginRight: '20px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Tên đợt" defaultValue={selectedPeriod.name} variant="outlined" />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>Đợt đăng ký của Giảng viên</Typography>
                <TextField fullWidth label="Thời gian bắt đầu" type="datetime-local" defaultValue={selectedPeriod.lecturerStart} InputLabelProps={{ shrink: true }} variant="outlined" />
              </Grid>
              <Grid item xs={6} style={{ marginTop: '40px' }}>
                <TextField fullWidth label="Thời gian kết thúc" type="datetime-local" defaultValue={selectedPeriod.lecturerEnd} InputLabelProps={{ shrink: true }} variant="outlined" />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>Đợt đăng ký của Sinh viên</Typography>
                <TextField fullWidth label="Thời gian bắt đầu" type="datetime-local" defaultValue={selectedPeriod.studentStart} InputLabelProps={{ shrink: true }} variant="outlined" />
              </Grid>
              <Grid item xs={6} style={{ marginTop: '40px' }}>
                <TextField fullWidth label="Thời gian kết thúc" type="datetime-local" defaultValue={selectedPeriod.studentEnd} InputLabelProps={{ shrink: true }} variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>Danh sách sinh viên:</Typography>
                <div class="input-group">
                  <input type="file" class="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload" />
                  <button class="btn btn-outline-secondary" type="button" id="inputGroupFileAddon04">Import danh sách sinh viên</button>
                </div>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>Thời gian duyệt đề tài cho TBM:</Typography>
                <TextField fullWidth label="Thời gian bắt đầu" type="datetime-local" defaultValue={selectedPeriod.approvalStart} InputLabelProps={{ shrink: true }} variant="outlined" />
              </Grid>
              <Grid item xs={6} style={{ marginTop: '40px' }}>
                <TextField fullWidth label="Thời gian kết thúc" type="datetime-local" defaultValue={selectedPeriod.approvalEnd} InputLabelProps={{ shrink: true }} variant="outlined" />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>Thời gian nộp báo cáo:</Typography>
                <TextField fullWidth label="Thời gian bắt đầu" type="datetime-local" defaultValue={selectedPeriod.approvalStart} InputLabelProps={{ shrink: true }} variant="outlined" />
              </Grid>
              <Grid item xs={6} style={{ marginTop: '40px' }}>
                <TextField fullWidth label="Thời gian kết thúc" type="datetime-local" defaultValue={selectedPeriod.approvalEnd} InputLabelProps={{ shrink: true }} variant="outlined" />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>Thời gian lập hội đồng:</Typography>
                <TextField fullWidth label="Thời gian bắt đầu" type="datetime-local" defaultValue={selectedPeriod.approvalStart} InputLabelProps={{ shrink: true }} variant="outlined" />
              </Grid>
              <Grid item xs={6} style={{ marginTop: '40px' }}>
                <TextField fullWidth label="Thời gian kết thúc" type="datetime-local" defaultValue={selectedPeriod.approvalEnd} InputLabelProps={{ shrink: true }} variant="outlined" />
              </Grid>
              <Grid item xs={12} style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary" style={{ marginRight: '10px' }}>
                  Cập nhật
                </Button>
                <Button variant="outlined" color="secondary">
                  Đóng
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>
      ) : (
        <div>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <h6 style={{ padding: '20px', color: '#1597BB' }}>DANH SÁCH ĐỢT ĐĂNG KÝ</h6>
            <button style={{ margin: '20px', backgroundColor: '#1597BB', color:'white' }}type="button" class="btn"><AddOutlinedIcon /></button>
          </div>
          <DataGrid
            style={{ marginLeft: '20px', marginRight: '20px' }}
            rows={peroids.map((item, index) => ({
              stt: index + 1,
              id: item.periodId,
              name: item.registrationName,
              lecturerStart: item.lecturerStart,
              lecturerEnd: item.lecturerEnd,
              studentStart: item.studentStart,
              studentEnd: item.studentEnd,
              approvalStart: item.approvalStart,
              approvalEnd: item.approvalEnd,
            }))}
            columns={columns}
            initialState={{
              ...peroids.initialState,
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25, 50]}
          />
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default DataTablePeroidGraduation;