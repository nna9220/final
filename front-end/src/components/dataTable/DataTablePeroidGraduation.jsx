import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from '../../API/axios';
import { toast, ToastContainer } from 'react-toastify';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import 'react-toastify/dist/ReactToastify.css';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteForeverOutlined from '@mui/icons-material/DeleteForeverOutlined';
import { Breadcrumbs, Link, Typography, Grid, TextField, Button } from '@mui/material';
import { format, parseISO, addDays, addHours } from 'date-fns';

function DataTablePeroidGraduation() {
  const [peroids, setPeroids] = useState([]);
  const [peroidsOfStudent, setPeroidsOfStudent] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  const [file, setFile] = useState(null);
  const [newPeroid, setNewPeroid] = useState({
    registrationTimeStart: '',
    registrationTimeEnd: '',
    registrationName: '',
    timeBrowsOfHeadStart: '',
    timeBrowsOfHeadEnd: '',
    registrationPeriodStart: '',
    registrationPeriodEnd: '',
    registrationPeriodName: '',
    reportSubmissionTimeStart: '',
    reportSubmissionTimeEnd: '',
    reportSubmissionTimeName: '',
    councilReportTimeStart: '',
    councilReportTimeEnd: '',
    councilReportTimeName: '',
    file: null
  });

  const [formEditData, setFormEditData] = useState({
    registrationTimeStart: '',
    registrationTimeEnd: '',
    registrationName: '',
    timeBrowsOfHeadStart: '',
    timeBrowsOfHeadEnd: '',
    registrationPeriodStart: '',
    registrationPeriodEnd: '',
    registrationPeriodName: '',
    reportSubmissionTimeStart: '',
    reportSubmissionTimeEnd: '',
    reportSubmissionTimeName: '',
    councilReportTimeStart: '',
    councilReportTimeEnd: '',
    councilReportTimeName: '',
    file: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const tokenSt = sessionStorage.getItem('userToken');
    if (tokenSt) {
      axiosInstance.get('/admin/timeGraduation/registration-periods', {
        headers: {
          'Authorization': `Bearer ${tokenSt}`,
        },
      })
        .then(response => {
          const dataTimeApproveArray = response.data;
          setPeroids(dataTimeApproveArray);
          console.log("Peroid Lec: ", response.data)
        })
        .catch(error => {
          console.error("error: ", error);
        });
    } else {
      console.log("Lỗi !!")
    }
  }

  function convertDateTime(dateTimeString) {
    const parts = dateTimeString.split('T');
    const datePart = parts[0];
    const timePart = parts[1];

    const timeParts = timePart.split(':');
    const hour = timeParts[0]; // Giờ
    const minute = timeParts[1]; // Phút

    const formattedDateTime = `${datePart} ${hour}:${minute}:00`;

    return formattedDateTime;
  }

  const handleAddPeroid = async () => {
    const tokenSt = sessionStorage.getItem('userToken');
  
    // Tạo FormData và thêm các dữ liệu
    const formData = new FormData();
    formData.append('registrationTimeStart', convertDateTime(newPeroid.registrationTimeStart));
    formData.append('registrationTimeEnd', convertDateTime(newPeroid.registrationTimeEnd));
    formData.append('registrationName', newPeroid.registrationName);
    formData.append('timeBrowsOfHeadStart', convertDateTime(newPeroid.timeBrowsOfHeadStart));
    formData.append('timeBrowsOfHeadEnd', convertDateTime(newPeroid.timeBrowsOfHeadEnd));
    formData.append('registrationPeriodStart', convertDateTime(newPeroid.registrationPeriodStart));
    formData.append('registrationPeriodEnd', convertDateTime(newPeroid.registrationPeriodEnd));
    formData.append('registrationPeriodName', newPeroid.registrationName);
    formData.append('reportSubmissionTimeStart', convertDateTime(newPeroid.reportSubmissionTimeStart));
    formData.append('reportSubmissionTimeEnd', convertDateTime(newPeroid.reportSubmissionTimeEnd));
    formData.append('reportSubmissionTimeName', newPeroid.registrationName);
    formData.append('councilReportTimeStart', convertDateTime(newPeroid.councilReportTimeStart));
    formData.append('councilReportTimeEnd', convertDateTime(newPeroid.councilReportTimeEnd));
    formData.append('councilReportTimeName', newPeroid.registrationName);
  
    // Thêm tệp tin vào FormData nếu có
    if (newPeroid.file) {
      formData.append('file', newPeroid.file);
    }
  
    if (tokenSt) {
      // Hiển thị dữ liệu trước khi gửi
      console.log("Data gửi: ");
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
  
      try {
        const response = await axiosInstance.post('/admin/timeGraduation/create', formData, {
          headers: {
            'Authorization': `Bearer ${tokenSt}`,
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Hiển thị phản hồi từ server
        console.log("Phản hồi từ server: ", response);
  
        if (response.status === 201) {
          toast.success('Tạo đợt đăng ký thành công!');
          // Đóng modal hoặc làm gì đó sau khi thành công
          loadData();
          document.getElementById('addPeroid').classList.remove('show');
          document.querySelector('#addPeroid .btn-close').click();
        } else {
          toast.error('Đã có lỗi xảy ra. Vui lòng thử lại!');
        }
      } catch (error) {
        if (error.response) {
          // Xử lý lỗi từ server
          console.log("Lỗi từ server: ", error.response);
          if (error.response.status === 400) {
            const errorMessage = error.response.data;
            toast.error('Dữ liệu không hợp lệ: ' + errorMessage);
          } else if (error.response.status === 401) {
            toast.error('Bạn không có quyền truy cập.');
          } else if (error.response.status === 500) {
            toast.error('Lỗi máy chủ, vui lòng thử lại sau.');
          } else {
            toast.error('Đã có lỗi xảy ra 1: ' + error.response.data);
          }
        } else if (error.request) {
          // Lỗi không nhận được phản hồi
          console.log("Lỗi không nhận được phản hồi: ", error.request);
          toast.error('Không nhận được phản hồi từ máy chủ.');
        } else {
          // Lỗi khác
          console.log("Lỗi khác: ", error.message);
          toast.error('Đã có lỗi xảy ra 2: ' + error.message);
        }
      }
    } else {
      console.log("Error: No token found");
      toast.error("Lỗi xác thực. Vui lòng đăng nhập lại");
    }
  };
  
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };


  const handleInputChange1 = (event) => {
    const { name, value, type, files } = event.target;
    if (type === 'file') {
      setNewPeroid((prevData) => ({
        ...prevData,
        [name]: files[0], // Chỉ lấy file đầu tiên trong trường hợp người dùng chọn nhiều file
      }));
    } else {
      setNewPeroid((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleDetailPeroid = (id) => {
    console.log("id student", id);
    axiosInstance.get(`/admin/timeGraduation/details/${id}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('userToken')}`,
      },
    })
      .then(response => {
        const data = response.data;
        setSelectedPeriod({
          name: data.RegistrationLecturer.registrationName,
          id: data.RegistrationLecturer.periodId,
        });
        setFormEditData({
          registrationTimeStart: (data.RegistrationLecturer.registrationTimeStart),
          registrationTimeEnd: (data.RegistrationLecturer.registrationTimeEnd),
          registrationName: data.RegistrationLecturer.registrationName,
          timeBrowsOfHeadStart: (data.TimeBrowseOfHead.timeStart),
          timeBrowsOfHeadEnd: (data.TimeBrowseOfHead.timeEnd),
          registrationPeriodStart: (data.RegistrationStudent.registrationTimeStart),
          registrationPeriodEnd: (data.RegistrationStudent.registrationTimeEnd),
          registrationPeriodName: data.RegistrationLecturer.registrationName,
          reportSubmissionTimeStart: (data.ReportSubmissionTime.reportTimeStart),
          reportSubmissionTimeEnd: (data.ReportSubmissionTime.reportTimeEnd),
          reportSubmissionTimeName: data.RegistrationLecturer.registrationName,
          councilReportTimeStart: (data.CouncilReportTime.reportTimeStart),
          councilReportTimeEnd: (data.CouncilReportTime.reportTimeStart),
          councilReportTimeName: data.RegistrationLecturer.registrationName,
          file: null
        });
        console.log("Dtail: ", response.data);
        console.log("name: ", (response.data.ReportSubmissionTime.reportTimeEnd));

      })
      .catch(error => {
        console.error("Lỗi khi lấy thông tin:", error);
      });
  };

  const handleInputChange = (event) => {
    const { name, value, type, files } = event.target;
    if (type === 'file') {
      setFormEditData((prevData) => ({
        ...prevData,
        [name]: files[0], // Chỉ lấy file đầu tiên trong trường hợp người dùng chọn nhiều file
      }));
    } else {
      setFormEditData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };


  const handleEditPeroid = async () => {
    const tokenSt = sessionStorage.getItem('userToken');

    if (!tokenSt) {
      console.log("Error: No token found");
      toast.error("Lỗi xác thực. Vui lòng đăng nhập lại");
      return;
    }

    // Tạo đối tượng FormData
    const formData = new FormData();
    formData.append('registrationTimeStart', formatDateTime(formEditData.registrationTimeStart));
    formData.append('registrationTimeEnd', formatDateTime(formEditData.registrationTimeEnd));
    formData.append('registrationName', formEditData.registrationName);
    formData.append('timeBrowsOfHeadStart', formatDateTime(formEditData.timeBrowsOfHeadStart));
    formData.append('timeBrowsOfHeadEnd', formatDateTime(formEditData.timeBrowsOfHeadEnd));
    formData.append('registrationPeriodStart', formatDateTime(formEditData.registrationPeriodStart));
    formData.append('registrationPeriodEnd', formatDateTime(formEditData.registrationPeriodEnd));
    formData.append('registrationPeriodName', formEditData.registrationPeriodName);
    formData.append('reportSubmissionTimeStart', formatDateTime(formEditData.reportSubmissionTimeStart));
    formData.append('reportSubmissionTimeEnd', formatDateTime(formEditData.reportSubmissionTimeEnd));
    formData.append('reportSubmissionTimeName', formEditData.reportSubmissionTimeName);
    formData.append('councilReportTimeStart', formatDateTime(formEditData.councilReportTimeStart));
    formData.append('councilReportTimeEnd', formatDateTime(formEditData.councilReportTimeEnd));
    formData.append('councilReportTimeName', (formEditData.councilReportTimeName));

    // Thêm file vào FormData nếu có
    if (formEditData.file) {
      formData.append('file', formEditData.file);
    } else {
      // Nếu không có file, bạn có thể đặt file là null hoặc không cần thêm gì
      formData.append('file', null);
    }

    // Log dữ liệu FormData
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: ${value.name}`); // Hiển thị tên file
      } else {
        console.log(`${key}: ${value}`); // Hiển thị giá trị trường
      }
    }

    try {
      const response = await axiosInstance.post(`/admin/time/edit/${selectedPeriod.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${tokenSt}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        toast.success('Cập nhật đợt đăng ký thành công!');
      } else {
        toast.error('Đã có lỗi xảy ra. Vui lòng thử lại!');
      }
    } catch (error) {
      console.log("Lỗi", error);
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại!');
    }
  };



  const formatDateTime = (isoString) => {
    // Tạo đối tượng Date từ chuỗi ISO
    const date = new Date(isoString);

    // Lấy các phần của ngày giờ
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Tạo định dạng YYYY-MM-DD HH:mm:ss
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  function convertToDateTimeLocalFormat(dateTimeString) {
    if (!dateTimeString) {
      return '';
    }

    const [datePart, timePart] = dateTimeString.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');
    const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
    if (isNaN(date)) {
      console.error(`Invalid date string: ${dateTimeString}`);
      return '';
    }
    return date.toISOString().slice(0, 16);
  }


  const columns = [
    { field: 'stt', headerName: 'STT', flex: 0.2 },
    { field: 'name', headerName: 'Tên đợt', flex: 1 },
    { field: 'status', headerName: 'Trạng thái', flex: 0.5 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.5,
      renderCell: (params) => (
        <div>
          <button className="btnView" onClick={() => handleDetailPeroid(params.row.id)}>
            <EditOutlined />
          </button>
          <button className='btnDelete' data-bs-toggle="modal" data-bs-target="#delete">
            <DeleteForeverOutlined />
          </button>
        </div>
      ),
    },
  ];

  const rowST = peroidsOfStudent.map((item, index) => ({
    stt: index + 1,
    id: item.periodId,
    status: item.status ? 'Đang hoạt động' : 'Đã ngừng',
    name: item.registrationName,
    lecturerStart: item.registrationTimeStart,
    lecturerEnd: item.registrationTimeEnd,
  }))

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
          <div style={{ marginLeft: '20px', marginRight: '20px', marginBottom:'16px'}}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Tên đợt" name="registrationName" value={formEditData.registrationName} onChange={handleInputChange} variant="outlined" />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>Đợt đăng ký của Giảng viên</Typography>
                <TextField fullWidth label="Thời gian bắt đầu" type="datetime-local" name="registrationTimeStart" value={formEditData.registrationTimeStart} onChange={handleInputChange} InputLabelProps={{ shrink: true }} variant="outlined" />
              </Grid>
              <Grid item xs={6} style={{ marginTop: '40px' }}>
                <TextField fullWidth label="Thời gian kết thúc" type="datetime-local" name="registrationTimeEnd" value={formEditData.registrationTimeEnd} onChange={handleInputChange} InputLabelProps={{ shrink: true }} variant="outlined" />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>Thời gian duyệt đề tài cho TBM:</Typography>
                <TextField fullWidth label="Thời gian bắt đầu" type="datetime-local" name="timeBrowsOfHeadStart" value={formEditData.timeBrowsOfHeadStart} onChange={handleInputChange} InputLabelProps={{ shrink: true }} variant="outlined" />
              </Grid>
              <Grid item xs={6} style={{ marginTop: '40px' }}>
                <TextField fullWidth label="Thời gian kết thúc" type="datetime-local" name="timeBrowsOfHeadEnd" value={formEditData.timeBrowsOfHeadEnd} onChange={handleInputChange} InputLabelProps={{ shrink: true }} variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>Danh sách sinh viên:</Typography>
                <div class="input-group">
                  <input type="file" class="form-control" id="inputGroupFile04" name="file" onChange={handleInputChange} aria-describedby="inputGroupFileAddon04" aria-label="Upload" />
                  <button class="btn btn-outline-secondary" type="button" id="inputGroupFileAddon04">Import danh sách sinh viên</button>
                </div>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>Đợt đăng ký của Sinh viên</Typography>
                <TextField fullWidth label="Thời gian bắt đầu" type="datetime-local" name="registrationPeriodStart" value={formEditData.registrationPeriodStart} onChange={handleInputChange} InputLabelProps={{ shrink: true }} variant="outlined" />
              </Grid>
              <Grid item xs={6} style={{ marginTop: '40px' }}>
                <TextField fullWidth label="Thời gian kết thúc" type="datetime-local" name="registrationPeriodEnd" value={formEditData.registrationPeriodEnd} onChange={handleInputChange} InputLabelProps={{ shrink: true }} variant="outlined" />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>Thời gian nộp báo cáo:</Typography>
                <TextField fullWidth label="Thời gian bắt đầu" type="datetime-local" name="reportSubmissionTimeStart" value={formEditData.reportSubmissionTimeStart} onChange={handleInputChange} InputLabelProps={{ shrink: true }} variant="outlined" />
              </Grid>
              <Grid item xs={6} style={{ marginTop: '40px' }}>
                <TextField fullWidth label="Thời gian kết thúc" type="datetime-local" name="reportSubmissionTimeEnd" value={formEditData.reportSubmissionTimeEnd} onChange={handleInputChange} InputLabelProps={{ shrink: true }} variant="outlined" />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>Thời gian lập hội đồng:</Typography>
                <TextField fullWidth label="Thời gian bắt đầu" type="datetime-local" name="councilReportTimeStart" value={formEditData.councilReportTimeStart} onChange={handleInputChange} InputLabelProps={{ shrink: true }} variant="outlined" />
              </Grid>
              <Grid item xs={6} style={{ marginTop: '40px' }}>
                <TextField fullWidth label="Thời gian kết thúc" type="datetime-local" name="councilReportTimeEnd" value={formEditData.councilReportTimeEnd} onChange={handleInputChange} InputLabelProps={{ shrink: true }} variant="outlined" />
              </Grid>
              <Grid item xs={12} style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button type='submit' variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={handleEditPeroid}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h6 style={{ padding: '20px', color: '#1597BB' }}>DANH SÁCH ĐỢT ĐĂNG KÝ</h6>
            <button style={{ margin: '20px', backgroundColor: '#1597BB', color: 'white' }} type="button" class="btn" data-bs-toggle="modal" data-bs-target="#addPeroid">
              <AddOutlinedIcon />
            </button>
          </div>
          <DataGrid
            style={{ marginLeft: '20px', marginRight: '20px', width: '150vh' }}
            rows={peroids.map((item, index) => ({
              stt: index + 1,
              id: item.periodId,
              status: item.status ? 'Đang hoạt động' : 'Đã ngừng',
              name: item.registrationName,
              lecturerStart: item.registrationTimeStart,
              lecturerEnd: item.registrationTimeEnd,
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


      <div class="modal fade" id="addPeroid" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-xl">
          <form class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Thêm đợt đăng ký</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <h6 style={{ padding: '10px', color: '#1597BB' }}>CHI TIẾT ĐỢT ĐĂNG KÝ</h6>
              <div style={{ marginLeft: '10px', marginRight: '10px' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField required fullWidth label="Tên đợt" name='registrationName' value={newPeroid.registrationName} onChange={handleInputChange1} variant="outlined" />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>Đợt đăng ký của Giảng viên</Typography>
                    <TextField required fullWidth label="Thời gian bắt đầu" type="datetime-local" name='registrationPeriodStart' value={newPeroid.registrationPeriodStart} onChange={handleInputChange1} InputLabelProps={{ shrink: true }} variant="outlined" />
                  </Grid>
                  <Grid item xs={6} style={{ marginTop: '40px' }}>
                    <TextField required fullWidth label="Thời gian kết thúc" type="datetime-local" name='registrationPeriodEnd' value={newPeroid.registrationPeriodEnd} onChange={handleInputChange1} InputLabelProps={{ shrink: true }} variant="outlined" />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>Thời gian duyệt đề tài cho TBM:</Typography>
                    <TextField required fullWidth label="Thời gian bắt đầu" type="datetime-local" name='timeBrowsOfHeadStart' value={newPeroid.timeBrowsOfHeadStart} onChange={handleInputChange1} InputLabelProps={{ shrink: true }} variant="outlined" />
                  </Grid>
                  <Grid item xs={6} style={{ marginTop: '40px' }}>
                    <TextField required fullWidth label="Thời gian kết thúc" type="datetime-local" name='timeBrowsOfHeadEnd' value={newPeroid.timeBrowsOfHeadEnd} onChange={handleInputChange1} InputLabelProps={{ shrink: true }} variant="outlined" />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>Danh sách sinh viên:</Typography>
                    <div class="input-group">
                      <input type="file" class="form-control" id="inputGroupFile04" name='file' aria-describedby="inputGroupFileAddon04" aria-label="Upload" onChange={handleInputChange1} />
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>Đợt đăng ký của Sinh viên</Typography>
                    <TextField required fullWidth label="Thời gian bắt đầu" type="datetime-local" name='registrationTimeStart' value={newPeroid.registrationTimeStart} onChange={handleInputChange1} InputLabelProps={{ shrink: true }} variant="outlined" />
                  </Grid>
                  <Grid item xs={6} style={{ marginTop: '40px' }}>
                    <TextField required fullWidth label="Thời gian kết thúc" type="datetime-local" name='registrationTimeEnd' value={newPeroid.registrationTimeEnd} onChange={handleInputChange1} InputLabelProps={{ shrink: true }} variant="outlined" />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>Thời gian nộp báo cáo:</Typography>
                    <TextField required fullWidth label="Thời gian bắt đầu" type="datetime-local" name='reportSubmissionTimeStart' value={newPeroid.reportSubmissionTimeStart} onChange={handleInputChange1} InputLabelProps={{ shrink: true }} variant="outlined" />
                  </Grid>
                  <Grid item xs={6} style={{ marginTop: '40px' }}>
                    <TextField required fullWidth label="Thời gian kết thúc" type="datetime-local" name='reportSubmissionTimeEnd' value={newPeroid.reportSubmissionTimeEnd} onChange={handleInputChange1} InputLabelProps={{ shrink: true }} variant="outlined" />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>Thời gian lập hội đồng:</Typography>
                    <TextField required fullWidth label="Thời gian bắt đầu" type="datetime-local" name='councilReportTimeStart' value={newPeroid.councilReportTimeStart} onChange={handleInputChange1} InputLabelProps={{ shrink: true }} variant="outlined" />
                  </Grid>
                  <Grid item xs={6} style={{ marginTop: '40px' }}>
                    <TextField required fullWidth label="Thời gian kết thúc" type="datetime-local" name='councilReportTimeEnd' value={newPeroid.councilReportTimeEnd} onChange={handleInputChange1} InputLabelProps={{ shrink: true }} variant="outlined" />
                  </Grid>
                </Grid>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={handleAddPeroid}>Lưu</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default DataTablePeroidGraduation;
